import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { signupSchema, loginSchema, changePasswordSchema } from "../validators/authSchemas.js";

const SALT_ROUNDS = 10;
const MAX_ATTEMPTS = 5;

const createToken = (employee) =>
  jwt.sign(
    { id: employee.employee_id, role: employee.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

const formatErrors = (error) =>
  error.issues.map((i) => ({ field: i.path[0], message: i.message }));

export const signup = async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: formatErrors(parsed.error) });
  }

  const { name, email, password } = parsed.data;

  try {
    const [existing] = await pool.query(
      "SELECT employee_id FROM employees WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      "INSERT INTO employees (employee_name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "Account created",
      employee: { id: result.insertId, name, email, role: "employee" },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: formatErrors(parsed.error) });
  }

  const { email, password } = parsed.data;

  try {
    const [rows] = await pool.query(
      `SELECT employee_id, employee_name, email, password_hash, role,
              status, failed_attempts, must_change_password
       FROM employees WHERE email = ?`,
      [email]
    );
    const employee = rows[0];

    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (employee.status === "inactive") {
      return res.status(403).json({ message: "Account is deactivated" });
    }
    if (employee.status === "locked") {
      return res
        .status(403)
        .json({ message: "Account locked. Please contact the admin." });
    }

    const passwordOk = await bcrypt.compare(password, employee.password_hash);

    if (!passwordOk) {
      const attempts = employee.failed_attempts + 1;
      const newStatus = attempts >= MAX_ATTEMPTS ? "locked" : employee.status;
      await pool.query(
        "UPDATE employees SET failed_attempts = ?, status = ? WHERE employee_id = ?",
        [attempts, newStatus, employee.employee_id]
      );
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await pool.query(
      "UPDATE employees SET failed_attempts = 0 WHERE employee_id = ?",
      [employee.employee_id]
    );

    res.json({
      message: "Login successful",
      token: createToken(employee),
      employee: {
        id: employee.employee_id,
        name: employee.employee_name,
        email: employee.email,
        role: employee.role,
        mustChangePassword: Boolean(employee.must_change_password),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT employee_id AS id, employee_name AS name, email, role, status,
              must_change_password AS mustChangePassword
       FROM employees WHERE employee_id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ employee: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: formatErrors(parsed.error) });
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const [rows] = await pool.query(
      "SELECT password_hash FROM employees WHERE employee_id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const currentOk = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!currentOk) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query(
      "UPDATE employees SET password_hash = ?, must_change_password = FALSE WHERE employee_id = ?",
      [newHash, req.user.id]
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};