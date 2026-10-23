package com.project.cinerama.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CineRequest(
    @NotNull Integer ciudadId,
    @NotBlank String nombre,
    @NotBlank String direccion,
    String urlImagen
) {}
