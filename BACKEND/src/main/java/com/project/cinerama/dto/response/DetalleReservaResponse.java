package com.project.cinerama.dto.response;

import java.math.BigDecimal;

/**
 * DTO de salida para cada línea del detalle de una reserva.
 * Se anida dentro de ReservaResponse para el ticket completo.
 */
public record DetalleReservaResponse(
    Integer    id,
    Integer    asientoId,
    String     fila,
    Integer    numeroAsiento,
    BigDecimal precioUnitario
) {}
