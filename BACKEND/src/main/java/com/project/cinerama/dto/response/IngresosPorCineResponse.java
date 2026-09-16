package com.project.cinerama.dto.response;

import java.math.BigDecimal;

public record IngresosPorCineResponse(
    String cineNombre,
    BigDecimal totalIngresos
) {}
