package com.project.cinerama.controller;

import com.project.cinerama.dto.request.FuncionRequest;
import com.project.cinerama.dto.response.FuncionResponse;
import com.project.cinerama.service.FuncionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funciones")
@RequiredArgsConstructor
public class FuncionController {

    private final FuncionService funcionService;

    @GetMapping("/pelicula/{peliculaId}")
    public ResponseEntity<List<FuncionResponse>> listarPorPelicula(@PathVariable Integer peliculaId) {
        return ResponseEntity.ok(funcionService.obtenerPorPelicula(peliculaId));
    }

    @GetMapping("/cine/{cineId}")
    public ResponseEntity<List<FuncionResponse>> listarPorCine(@PathVariable Integer cineId) {
        return ResponseEntity.ok(funcionService.obtenerPorCine(cineId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionResponse> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(funcionService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<FuncionResponse> crear(@Valid @RequestBody FuncionRequest request) {
        FuncionResponse creada = funcionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        funcionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
