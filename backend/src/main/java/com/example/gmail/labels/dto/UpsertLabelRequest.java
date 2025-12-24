package com.example.gmail.labels.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Minimal fields used in this challenge.
 * Gmail supports more, but these are the most relevant for CRUD + UI.
 */
public record UpsertLabelRequest(
    @NotBlank String name,
    String labelListVisibility,    // "labelShow" | "labelHide" | ...
    String messageListVisibility   // "show" | "hide"
) {}