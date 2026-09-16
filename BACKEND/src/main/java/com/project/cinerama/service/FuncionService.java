package com.project.cinerama.service;

import com.project.cinerama.dto.request.FuncionRequest;
import com.project.cinerama.dto.response.FuncionResponse;
import com.project.cinerama.exception.ConflictException;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.FuncionMapper;
import com.project.cinerama.persistence.entity.*;
import com.project.cinerama.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuncionService {

    private final FuncionRepository funcionRepository;
    private final PeliculaRepository peliculaRepository;
    private final SalaRepository salaRepository;
    private final FormatoRepository formatoRepository;
    private final IdiomaRepository idiomaRepository;
    private final FuncionMapper funcionMapper;

    @Transactional(readOnly = true)
    public List<FuncionResponse> obtenerPorPelicula(Integer peliculaId) {
        return funcionRepository.findByPeliculaId(peliculaId).stream()
                .map(funcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FuncionResponse> obtenerPorCine(Integer cineId) {
        return funcionRepository.findBySalaCineId(cineId).stream()
                .map(funcionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FuncionResponse obtenerPorId(Integer id) {
        FuncionEntity funcion = funcionRepository.findByIdConRelaciones(id)
                .orElseThrow(() -> new ResourceNotFoundException("Función no encontrada con ID: " + id));
        return funcionMapper.toResponse(funcion);
    }

    /**
     * Programación de Funciones con Validación de Traslape de Horarios.
     */
    @Transactional
    public FuncionResponse crear(FuncionRequest request) {
        PeliculaEntity pelicula = peliculaRepository.findById(request.peliculaId())
                .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + request.peliculaId()));

        SalaEntity sala = salaRepository.findById(request.salaId())
                .orElseThrow(() -> new ResourceNotFoundException("Sala no encontrada con ID: " + request.salaId()));

        FormatoEntity formato = formatoRepository.findById(request.formatoId())
                .orElseThrow(() -> new ResourceNotFoundException("Formato no encontrado con ID: " + request.formatoId()));

        IdiomaEntity idioma = idiomaRepository.findById(request.idiomaId())
                .orElseThrow(() -> new ResourceNotFoundException("Idioma no encontrado con ID: " + request.idiomaId()));

        // Calcular la fecha de fin y validar traslape
        validarTraslape(request.salaId(), request.fechaHoraInicio(), pelicula.getDuracionMinutos(), null);

        FuncionEntity funcion = FuncionEntity.builder()
                .pelicula(pelicula)
                .sala(sala)
                .formato(formato)
                .idioma(idioma)
                .fechaHoraInicio(request.fechaHoraInicio())
                .precioEntrada(request.precioEntrada())
                .build();

        FuncionEntity guardada = funcionRepository.save(funcion);
        return funcionMapper.toResponse(guardada);
    }

    @Transactional
    public void eliminar(Integer id) {
        if (!funcionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Función no encontrada con ID: " + id);
        }
        // Si la función ya tiene reservas asociadas, salta FK constraint y responde 400 amistoso.
        funcionRepository.deleteById(id);
    }

    /**
     * Calcula nuevaFin = nuevaInicio + duracionMinutos y llama a existeTraslapeEnSala.
     */
    private void validarTraslape(Integer salaId, LocalDateTime nuevaInicio, Integer duracionMinutos, Integer excluirId) {
        LocalDateTime nuevaFin = nuevaInicio.plusMinutes(duracionMinutos);
        boolean hayTraslape = funcionRepository.existeTraslapeEnSala(salaId, nuevaInicio, nuevaFin, excluirId);

        if (hayTraslape) {
            throw new ConflictException("Existe un conflicto de horarios: La sala seleccionada ya tiene una función programada en ese rango de tiempo (incluyendo los 15 minutos de limpieza requeridos).");
        }
    }
}
