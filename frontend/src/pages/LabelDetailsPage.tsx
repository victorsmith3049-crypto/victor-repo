import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useLabel } from "../api/hooks";

export default function LabelDetailsPage() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();

  const labelId = id ? decodeURIComponent(id) : "";
  const { data, isLoading, error } = useLabel(labelId);

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button onClick={() => nav("/labels")}>Back</Button>
        <Typography variant="h5">Label Details</Typography>
      </Stack>

      {isLoading && (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Alert severity="error">
          {(error as any)?.message || "Failed to load label"}
        </Alert>
      )}

      {data && (
        <Card>
          <CardContent sx={{ display: "grid", gap: 1 }}>
            <Typography variant="h6">{data.name}</Typography>

            <Typography><b>ID:</b> {data.id}</Typography>
            <Typography><b>Type:</b> {data.type ?? "-"}</Typography>

            <Typography><b>Unread:</b> {data.messagesUnread ?? "-"}</Typography>
            <Typography><b>Total:</b> {data.messagesTotal ?? "-"}</Typography>

            <Typography><b>Threads Unread:</b> {data.threadsUnread ?? "-"}</Typography>
            <Typography><b>Threads Total:</b> {data.threadsTotal ?? "-"}</Typography>

            <Typography><b>Label List Visibility:</b> {data.labelListVisibility ?? "-"}</Typography>
            <Typography><b>Message List Visibility:</b> {data.messageListVisibility ?? "-"}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}