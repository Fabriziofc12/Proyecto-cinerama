package com.project.cinerama.controller;

import com.project.cinerama.dto.request.ReservaRequest;
import com.project.cinerama.dto.response.ReservaResponse;
import com.project.cinerama.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponse>> obtenerPorUsuario(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponse> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<ReservaResponse> crearReserva(@Valid @RequestBody ReservaRequest request) {
        ReservaResponse creada = reservaService.crearReserva(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }
}
