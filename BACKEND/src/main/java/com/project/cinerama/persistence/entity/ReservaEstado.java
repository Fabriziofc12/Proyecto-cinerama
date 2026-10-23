package com.project.cinerama.persistence.entity;

/**
 * Estados posibles de una reserva.
 * Se almacena como String en la BD (varchar(20)) mediante @Enumerated(EnumType.STRING).
 *
 * PENDIENTE  → Reserva creada pero sin pago confirmado (flujo futuro de pagos).
 * CONFIRMADA → Pago exitoso, entradas activas.
 * CANCELADA  → Cancelada por el usuario o expirada. Los asientos vuelven a estar disponibles.
 */
public enum ReservaEstado {
    PENDIENTE,
    CONFIRMADA,
    CANCELADA
}
