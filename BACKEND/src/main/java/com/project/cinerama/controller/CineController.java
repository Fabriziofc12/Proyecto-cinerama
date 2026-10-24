package com.project.cinerama.controller;

import com.project.cinerama.dto.request.CineRequest;
import com.project.cinerama.dto.response.CineResponse;
import com.project.cinerama.service.CineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cines")
@RequiredArgsConstructor
public class CineController {

    private final CineService cineService;

    @GetMapping
    public ResponseEntity<List<CineResponse>> listarTodos() {
        return ResponseEntity.ok(cineService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CineResponse> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(cineService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<CineResponse> crear(@Valid @RequestBody CineRequest request) {
        CineResponse creado = cineService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CineResponse> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody CineRequest request
    ) {
        return ResponseEntity.ok(cineService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        cineService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
