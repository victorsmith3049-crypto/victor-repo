import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLabel, deleteLabel, getLabel, listLabels, updateLabel } from "./labels";
import type { LabelDto, UpsertLabelRequest } from "./types";

export const qk = {
  labels: ["labels"] as const,
  label: (id: string) => ["labels", id] as const,
};

export function useLabels() {
  return useQuery({
    queryKey: qk.labels,
    queryFn: listLabels,
  });
}

export function useLabel(id: string) {
  return useQuery({
    queryKey: qk.label(id),
    queryFn: () => getLabel(id),
    enabled: !!id,
  });
}

export function useCreateLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertLabelRequest) => createLabel(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.labels });
    },
  });
}

export function useUpdateLabel() {
  const qc = useQueryClient();

  return useMutation<LabelDto, Error, { id: string; body: UpsertLabelRequest }>({
    mutationFn: ({ id, body }) => updateLabel(id, body),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: qk.labels });
      await qc.invalidateQueries({ queryKey: qk.label(vars.id) });
    },
  });
}

export function useDeleteLabel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLabel(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.labels });
    },
  });
}