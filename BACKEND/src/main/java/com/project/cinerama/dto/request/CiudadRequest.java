package com.project.cinerama.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CiudadRequest(
    @NotBlank String nombre
) {}
