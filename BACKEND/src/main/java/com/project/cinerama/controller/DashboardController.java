package com.project.cinerama.controller;

import com.project.cinerama.dto.response.IngresosPorCineResponse;
import com.project.cinerama.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/ingresos-por-cine")
    public ResponseEntity<List<IngresosPorCineResponse>> obtenerIngresosPorCine() {
        return ResponseEntity.ok(dashboardService.obtenerIngresosPorCine());
    }
}
