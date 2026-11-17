package com.project.cinerama.dto.response;

public record SalaResponse(
    Integer id,
    String nombre,
    Integer totalAsientos,
    Integer cineId,
    String cineNombre
) {}
// cambio de nombre de variable cineId a cineNombre para que sea más descriptivo y consistente con el resto del código.