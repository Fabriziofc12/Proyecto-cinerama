package com.project.cinerama.dto.response;

public record CineResponse(
    Integer id,
    String nombre,
    String direccion,
    String urlImagen,
    String ciudadNombre
) {}
