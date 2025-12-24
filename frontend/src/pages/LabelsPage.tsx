import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LabelDto, UpsertLabelRequest } from "../api/types";
import { useCreateLabel, useDeleteLabel, useLabels, useUpdateLabel } from "../api/hooks";
import LabelFormDialog from "../components/LabelFormDialog";

export default function LabelsPage() {
  const nav = useNavigate();
  const { data, isLoading, error } = useLabels();

  const createMut = useCreateLabel();
  const updateMut = useUpdateLabel();
  const deleteMut = useDeleteLabel();

  const [snack, setSnack] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<LabelDto | null>(null);

  const rows = (data ?? []).map((l) => ({ ...l, id: l.id })); // DataGrid requires `id`

  const cols: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", flex: 1, minWidth: 220 },
      { field: "type", headerName: "Type", width: 120 },
      { field: "messagesUnread", headerName: "Unread", width: 110 },
      { field: "messagesTotal", headerName: "Total", width: 110 },
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const row = params.row as LabelDto;
          const isSystem = row.type?.toLowerCase() === "system";

          return (
            <Stack direction="row" spacing={1} sx={{ py: 1 }}>
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(row);
                  setEditOpen(true);
                }}
                disabled={isSystem}
              >
                Edit
              </Button>

              <Button
                size="small"
                color="error"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (isSystem) return;

                  const ok = confirm(`Delete label "${row.name}"?`);
                  if (!ok) return;

                  try {
                    await deleteMut.mutateAsync(row.id);
                    setSnack({ type: "success", msg: "Label deleted" });
                  } catch (err: any) {
                    setSnack({ type: "error", msg: err?.message || "Delete failed" });
                  }
                }}
                disabled={isSystem}
              >
                Delete
              </Button>
            </Stack>
          );
        },
      },
    ],
    [deleteMut]
  );

  async function handleCreate(body: UpsertLabelRequest) {
    try {
      await createMut.mutateAsync(body);
      setCreateOpen(false);
      setSnack({ type: "success", msg: "Label created" });
    } catch (err: any) {
      setSnack({ type: "error", msg: err?.message || "Create failed" });
    }
  }

  async function handleUpdate(body: UpsertLabelRequest) {
    if (!editing) return;
    try {
      await updateMut.mutateAsync({ id: editing.id, body });
      setEditOpen(false);
      setEditing(null);
      setSnack({ type: "success", msg: "Label updated" });
    } catch (err: any) {
      setSnack({ type: "error", msg: err?.message || "Update failed" });
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Gmail Labels</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create Label
        </Button>
      </Stack>

      {isLoading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Alert severity="error">
          {(error as any)?.message || "Failed to load labels"}
        </Alert>
      )}

      {!isLoading && !error && (
        <div style={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={cols}
            onRowClick={(p) => nav(`/labels/${encodeURIComponent(p.row.id)}`)}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
            disableRowSelectionOnClick
          />
        </div>
      )}

      <LabelFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createMut.isPending}
      />

      <LabelFormDialog
        open={editOpen}
        mode="edit"
        initial={editing}
        onClose={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onSubmit={handleUpdate}
        isSubmitting={updateMut.isPending}
      />

        {snack && (
        <Snackbar
            open
            autoHideDuration={3500}
            onClose={() => setSnack(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert severity={snack.type} onClose={() => setSnack(null)}>
            {snack.msg}
            </Alert>
        </Snackbar>
        )}
    </Box>
  );
}