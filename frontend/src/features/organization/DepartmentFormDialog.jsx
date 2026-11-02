import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { departmentSchema } from "./departmentSchema";
import { createDepartment, updateDepartment } from "../../api/departmentApi";
import { useToast } from "../../hooks/useToast";
import { toFieldErrors } from "../../utils/zodErrors";

export default function DepartmentFormDialog({ department, onClose, onSaved }) {
  const isEdit = Boolean(department);

  const [name, setName] = useState(department?.name ?? "");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const result = departmentSchema.safeParse({ name });
    if (!result.success) {
      setError(toFieldErrors(result.error).name);
      return;
    }
    setError("");

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateDepartment(department.id, result.data);
      } else {
        await createDepartment(result.data);
      }
      showToast(isEdit ? "Department updated" : "Department added");
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      setServerError(
        data?.errors?.[0]?.message || data?.message || "Could not reach the server"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEdit ? "Edit department" : "Add department"}</DialogTitle>

        <DialogContent sx={{ pt: "8px !important" }}>
          <div className="flex flex-col gap-3">
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField
              autoFocus
              required
              fullWidth
              size="small"
              label="Department name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(error)}
              helperText={error}
            />
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : isEdit ? (
              "Save changes"
            ) : (
              "Add department"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}