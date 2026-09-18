package com.project.cinerama.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de entrada para programar una Función.
 *
 * El Service valida RN-01 (traslape) antes de persistir.
 * El precio se define a nivel de función (RN-06).
 */
public record FuncionRequest(

    @NotNull(message = "Debe indicar la película")
    Integer peliculaId,

    @NotNull(message = "Debe indicar la sala")
    Integer salaId,

    @NotNull(message = "Debe indicar el formato")
    Integer formatoId,

    @NotNull(message = "Debe indicar el idioma")
    Integer idiomaId,

    @NotNull(message = "Debe indicar la fecha y hora de inicio")
    LocalDateTime fechaHoraInicio,

    @NotNull(message = "Debe indicar el precio de entrada")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    BigDecimal precioEntrada

) {}
