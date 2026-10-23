package com.project.cinerama.dto.request;

import jakarta.validation.constraints.NotBlank;

public record FormatoRequest(
    @NotBlank String nombre
) {}
