package com.project.cinerama.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de salida para Reserva — vista completa (ticket).
 *
 * Incluye los detalles de asientos y la información de la función
 * para que el frontend pueda renderizar el ticket sin consultas adicionales.
 */
public record ReservaResponse(
    Integer                  id,
    String                   estado,
    BigDecimal               montoTotal,
    LocalDateTime            fechaCreacion,

    // Datos del usuario (null si fue compra como invitado)
    Integer                  usuarioId,
    String                   usuarioNombre,

    // Datos de la función
    Integer                  funcionId,
    String                   peliculaTitulo,
    LocalDateTime            fechaHoraFuncion,
    String                   salaNombre,
    String                   cineNombre,
    String                   formato,
    String                   idioma,

    // Detalle de asientos comprados
    List<DetalleReservaResponse> detalles
) {}
