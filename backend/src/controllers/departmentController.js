import pool from "../config/db.js";
import { departmentSchema } from "../validators/departmentSchemas.js";
import { formatErrors } from "../utils/formatErrors.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Stops a user's % or _ from acting as search wildcards
const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

export const listDepartments = async (req, res) => {
  const search = String(req.query.search || "").trim();
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  const like = `%${escapeLike(search)}%`;

  try {
    const [items] = await pool.query(
      `SELECT d.department_id AS id,
              d.department_name AS name,
              d.created_at AS createdAt,
              COUNT(e.employee_id) AS employeeCount
       FROM departments d
       LEFT JOIN employees e ON e.department_id = d.department_id
       WHERE d.department_name LIKE ?
       GROUP BY d.department_id, d.department_name, d.created_at
       ORDER BY d.department_name
       LIMIT ? OFFSET ?`,
      [like, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM departments WHERE department_name LIKE ?",
      [like]
    );

    res.json({ items, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createDepartment = async (req, res) => {
  const parsed = departmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: formatErrors(parsed.error) });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO departments (department_name) VALUES (?)",
      [parsed.data.name]
    );
    res.status(201).json({
      message: "Department created",
      department: { id: result.insertId, name: parsed.data.name },
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "A department with this name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateDepartment = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid department id" });

  const parsed = departmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: formatErrors(parsed.error) });
  }

  try {
    const [result] = await pool.query(
      "UPDATE departments SET department_name = ? WHERE department_id = ?",
      [parsed.data.name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "A department with this name already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDepartment = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ message: "Invalid department id" });

  try {
    const [[{ count }]] = await pool.query(
      "SELECT COUNT(*) AS count FROM employees WHERE department_id = ?",
      [id]
    );
    if (count > 0) {
      return res.status(409).json({
        message: `Cannot delete: ${count} employee(s) are linked to this department`,
      });
    }

    const [result] = await pool.query(
      "DELETE FROM departments WHERE department_id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted" });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res
        .status(409)
        .json({ message: "Cannot delete: other records still use this department" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};