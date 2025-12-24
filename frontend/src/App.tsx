import { Container, CssBaseline } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import LabelsPage from "./pages/LabelsPage";
import LabelDetailsPage from "./pages/LabelDetailsPage";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/labels" replace />} />
          <Route path="/labels" element={<LabelsPage />} />
          <Route path="/labels/:id" element={<LabelDetailsPage />} />
        </Routes>
      </Container>
    </>
  );
}