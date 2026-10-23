package com.project.cinerama.dto.response;

import java.time.LocalDateTime;

/**
 * DTO de salida para Usuario.
 * NUNCA se expone contrasenaHash ni ningún dato sensible.
 */
public record UsuarioResponse(
    Integer       id,
    String        nombreCompleto,
    String        correoElectronico,
    LocalDateTime fechaCreacion
) {}
