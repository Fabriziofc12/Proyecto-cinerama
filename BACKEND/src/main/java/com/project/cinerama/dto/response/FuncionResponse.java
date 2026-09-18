package com.project.cinerama.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de salida para Función.
 *
 * Incluye los nombres desnormalizados de sala, cine, formato e idioma
 * para que el frontend no necesite queries adicionales al renderizar
 * la lista de horarios (RF-08).
 */
public record FuncionResponse(
    Integer       id,
    Integer       peliculaId,
    String        peliculaTitulo,
    Integer       duracionMinutos,   // Para calcular hora de fin en el frontend
    Integer       salaId,
    String        salaNombre,
    Integer       cineId,
    String        cineNombre,
    String        ciudadNombre,
    String        formato,
    String        idioma,
    LocalDateTime fechaHoraInicio,
    BigDecimal    precioEntrada
) {}
