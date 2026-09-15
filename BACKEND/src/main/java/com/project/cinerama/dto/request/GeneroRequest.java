package com.project.cinerama.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GeneroRequest(
    @NotBlank String nombre
) {}
