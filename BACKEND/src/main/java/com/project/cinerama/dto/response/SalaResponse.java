package com.project.cinerama.dto.response;

public record SalaResponse(
    Integer id,
    String nombre,
    Integer totalAsientos,
    Integer cineId,
    String cineNombre
) {}
