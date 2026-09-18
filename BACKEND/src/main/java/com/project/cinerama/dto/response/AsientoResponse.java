package com.project.cinerama.dto.response;

/**
 * DTO de salida para Asiento.
 * Usado en RF-09 para el mapa interactivo de selección de asientos.
 * El campo "ocupado" lo calculará el Service consultando detalle_reservas.
 */
public record AsientoResponse(
    Integer id,
    String  fila,
    Integer numeroAsiento,
    Integer salaId,
    boolean ocupado   // true si ya está reservado en la función consultada
) {}
