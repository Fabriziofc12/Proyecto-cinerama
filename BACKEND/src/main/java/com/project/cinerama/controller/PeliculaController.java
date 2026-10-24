package com.project.cinerama.controller;

import com.project.cinerama.dto.request.PeliculaRequest;
import com.project.cinerama.dto.response.PeliculaResponse;
import com.project.cinerama.service.PeliculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;

    @GetMapping
    public ResponseEntity<List<PeliculaResponse>> listarTodas() {
        return ResponseEntity.ok(peliculaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeliculaResponse> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(peliculaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<PeliculaResponse> crear(@Valid @RequestBody PeliculaRequest request) {
        PeliculaResponse creada = peliculaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PeliculaResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody PeliculaRequest request
    ) {
        return ResponseEntity.ok(peliculaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        peliculaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
