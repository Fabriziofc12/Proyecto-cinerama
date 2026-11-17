package com.project.cinerama.dto.response;

public record CineResponse(
    Integer id,
    String nombre,
    String direccion,
    String urlImagen,
    String ciudadNombre
) {}
// cambio en el nombre de la clase de CineResponse a CineResponseDto para seguir la convención de nomenclatura de DTOs.