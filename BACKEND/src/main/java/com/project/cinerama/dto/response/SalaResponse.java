package com.project.cinerama.dto.response;

public record SalaResponse(
    Integer id,
    String nombre,
    Integer totalAsientos,
    Integer cineId,
    String cineNombre
) {}
//actualizacion de sala response para que traiga el nombre del cine y el id del cine al que pertenece la sala