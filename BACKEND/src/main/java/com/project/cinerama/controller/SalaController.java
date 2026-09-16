package com.project.cinerama.controller;

import com.project.cinerama.dto.request.SalaRequest;
import com.project.cinerama.dto.response.SalaResponse;
import com.project.cinerama.service.SalaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService salaService;

    @GetMapping("/cine/{cineId}")
    public ResponseEntity<List<SalaResponse>> listarPorCine(@PathVariable Integer cineId) {
        return ResponseEntity.ok(salaService.obtenerTodasPorCine(cineId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaResponse> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(salaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<SalaResponse> crear(@Valid @RequestBody SalaRequest request) {
        SalaResponse creada = salaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        salaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
