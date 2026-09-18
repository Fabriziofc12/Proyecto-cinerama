package com.project.cinerama.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

/**
 * DTO de entrada para crear una Reserva.
 *
 * RNF-02: El Service envuelve toda la lógica de este request en @Transactional.
 * RN-02: El Service verifica disponibilidad con PESSIMISTIC_WRITE lock.
 * RN-03: El Service calcula montoTotal = asientoIds.size() × funcion.precioEntrada.
 *
 * usuarioId puede ser null si la compra es como invitado (RF-10).
 */
public record ReservaRequest(

    @NotNull(message = "Debe indicar la función")
    Integer funcionId,

    Integer usuarioId,   // nullable → compra como invitado (RF-10)

    @NotEmpty(message = "Debe seleccionar al menos un asiento")
    Set<Integer> asientoIds

) {}
