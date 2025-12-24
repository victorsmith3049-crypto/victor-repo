import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { LabelDto, UpsertLabelRequest } from "../api/types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initial?: LabelDto | null;
  onClose: () => void;
  onSubmit: (data: UpsertLabelRequest) => void;
  isSubmitting?: boolean;
};

export default function LabelFormDialog({ open, mode, initial, onClose, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpsertLabelRequest>({
    defaultValues: { name: "", labelListVisibility: "labelShow", messageListVisibility: "show" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        labelListVisibility: initial?.labelListVisibility ?? "labelShow",
        messageListVisibility: initial?.messageListVisibility ?? "show",
      });
    }
  }, [open, initial, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "create" ? "Create Label" : "Edit Label"}</DialogTitle>

      <form
        onSubmit={handleSubmit((data) => {
          // Basic trimming to avoid accidental whitespace-only label names
          onSubmit({ ...data, name: data.name.trim() });
        })}
      >
        <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            fullWidth
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Label List Visibility"
            select
            fullWidth
            {...register("labelListVisibility")}
          >
            <MenuItem value="labelShow">labelShow</MenuItem>
            <MenuItem value="labelHide">labelHide</MenuItem>
            <MenuItem value="labelShowIfUnread">labelShowIfUnread</MenuItem>
          </TextField>

          <TextField
            label="Message List Visibility"
            select
            fullWidth
            {...register("messageListVisibility")}
          >
            <MenuItem value="show">show</MenuItem>
            <MenuItem value="hide">hide</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}