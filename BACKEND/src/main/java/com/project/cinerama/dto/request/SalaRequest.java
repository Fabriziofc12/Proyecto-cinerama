package com.project.cinerama.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SalaRequest(
    @NotNull Integer cineId,
    @NotBlank String nombre,
    @NotNull @Min(1) Integer totalAsientos
) {}
