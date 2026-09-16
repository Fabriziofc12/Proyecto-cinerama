package com.project.cinerama.service;

import com.project.cinerama.dto.request.SalaRequest;
import com.project.cinerama.dto.response.SalaResponse;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.SalaMapper;
import com.project.cinerama.persistence.entity.AsientoEntity;
import com.project.cinerama.persistence.entity.CineEntity;
import com.project.cinerama.persistence.entity.SalaEntity;
import com.project.cinerama.persistence.repository.AsientoRepository;
import com.project.cinerama.persistence.repository.CineRepository;
import com.project.cinerama.persistence.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;
    private final CineRepository cineRepository;
    private final AsientoRepository asientoRepository;
    private final SalaMapper salaMapper;

    @Transactional(readOnly = true)
    public List<SalaResponse> obtenerTodasPorCine(Integer cineId) {
        return salaRepository.findByCineId(cineId).stream()
                .map(salaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalaResponse obtenerPorId(Integer id) {
        SalaEntity sala = salaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sala no encontrada con ID: " + id));
        return salaMapper.toResponse(sala);
    }

    /**
     * Crear Sala y autogenerar N asientos (filas alfabéticas A-Z).
     */
    @Transactional
    public SalaResponse crear(SalaRequest request) {
        CineEntity cine = cineRepository.findById(request.cineId())
                .orElseThrow(() -> new ResourceNotFoundException("Cine no encontrado con ID: " + request.cineId()));

        SalaEntity sala = SalaEntity.builder()
                .cine(cine)
                .nombre(request.nombre())
                .totalAsientos(request.totalAsientos())
                .build();

        SalaEntity salaGuardada = salaRepository.save(sala);

        // Autogenerar N instancias de AsientoEntity
        List<AsientoEntity> asientosGenerados = generarAsientosAlfabeticos(salaGuardada, request.totalAsientos());
        asientoRepository.saveAll(asientosGenerados);

        return salaMapper.toResponse(salaGuardada);
    }

    @Transactional
    public void eliminar(Integer id) {
        if (!salaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sala no encontrada con ID: " + id);
        }
        // Si falla por FK violation, GlobalExceptionHandler responde 400 amistoso.
        salaRepository.deleteById(id);
    }

    /**
     * Genera N asientos organizados en filas alfabéticas (A, B, C...) con 10 asientos por fila.
     */
    private List<AsientoEntity> generarAsientosAlfabeticos(SalaEntity sala, int totalAsientos) {
        List<AsientoEntity> asientos = new ArrayList<>();
        int asientosPorFila = 10;

        for (int i = 0; i < totalAsientos; i++) {
            int filaIndex = i / asientosPorFila;
            int numeroAsiento = (i % asientosPorFila) + 1;
            String fila = String.valueOf((char) ('A' + filaIndex));

            AsientoEntity asiento = AsientoEntity.builder()
                    .sala(sala)
                    .fila(fila)
                    .numeroAsiento(numeroAsiento)
                    .build();

            asientos.add(asiento);
        }
        return asientos;
    }
}
