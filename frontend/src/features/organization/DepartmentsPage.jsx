import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import Delete from "@mui/icons-material/Delete";
import EditOutlined from "@mui/icons-material/EditOutlined";
import Search from "@mui/icons-material/Search";
import ConfirmDialog from "../../common/ConfirmDialog";
import EmptyState from "../../common/EmptyState";
import PageHeader from "../../common/PageHeader";
import DepartmentFormDialog from "./DepartmentFormDialog";
import { deleteDepartment, getDepartments } from "../../api/departmentApi";
import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/formatDate";

export default function DepartmentsPage() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialog, setDialog] = useState(null); // { department } or null
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const search = useDebounce(searchText, 400);
  const { showToast } = useToast();

  useEffect(() => {
    let ignore = false;

    getDepartments({ search, page: page + 1, limit: rowsPerPage })
      .then((res) => {
        if (ignore) return;
        setRows(res.data.items);
        setTotal(res.data.total);
        setError("");
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || "Could not load departments");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [search, page, rowsPerPage, reloadKey]);

  const reload = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(0);
    setLoading(true);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const handleRowsChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
    setLoading(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDepartment(deleteTarget.id);
      showToast("Department deleted");
      if (rows.length === 1 && page > 0) setPage(page - 1);
      reload();
    } catch (err) {
      showToast(err.response?.data?.message || "Could not delete the department", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const addButton = (
    <Button variant="contained" startIcon={<Add />} onClick={() => setDialog({ department: null })}>
      Add department
    </Button>
  );

  const showEmpty = !error && !loading && rows.length === 0;

  return (
    <>
      <PageHeader
        subtitle="Create and manage the departments in your company."
        action={addButton}
      />

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <div className="p-3">
          <TextField
            size="small"
            placeholder="Search departments"
            value={searchText}
            onChange={handleSearchChange}
            className="w-full sm:w-72"
            slotProps={{
              htmlInput: { "aria-label": "Search departments" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        {loading && <LinearProgress />}

        {error ? (
          <Alert
            severity="error"
            sx={{ mx: 2, mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={reload}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : showEmpty ? (
          searchText ? (
            <EmptyState
              icon={BusinessOutlined}
              title="No matching departments"
              text={`Nothing matches "${searchText}".`}
              action={
                <Button onClick={() => setSearchText("")}>Clear search</Button>
              }
            />
          ) : (
            <EmptyState
              icon={BusinessOutlined}
              title="No departments yet"
              text="Add your first department to get started."
              action={addButton}
            />
          )
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell>Employees</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Created
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.employeeCount}
                          color={row.employeeCount > 0 ? "secondary" : "default"}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label={`Edit ${row.name}`}
                            onClick={() => setDialog({ department: row })}
                          >
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            row.employeeCount > 0
                              ? `${row.employeeCount} employee(s) linked, so it can't be deleted`
                              : "Delete"
                          }
                        >
                          <span>
                            <IconButton
                              aria-label={`Delete ${row.name}`}
                              disabled={row.employeeCount > 0}
                              onClick={() => setDeleteTarget(row)}
                            >
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsChange}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>

      {dialog && (
        <DepartmentFormDialog
          key={dialog.department?.id ?? "new"}
          department={dialog.department}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            reload();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete department?"
        message={`"${deleteTarget?.name}" will be permanently deleted. This can't be undone.`}
        confirmText="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}