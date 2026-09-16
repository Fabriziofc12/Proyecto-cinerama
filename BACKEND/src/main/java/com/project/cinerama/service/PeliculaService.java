package com.project.cinerama.service;

import com.project.cinerama.dto.request.PeliculaRequest;
import com.project.cinerama.dto.response.PeliculaResponse;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.PeliculaMapper;
import com.project.cinerama.persistence.entity.FormatoEntity;
import com.project.cinerama.persistence.entity.GeneroEntity;
import com.project.cinerama.persistence.entity.IdiomaEntity;
import com.project.cinerama.persistence.entity.PeliculaEntity;
import com.project.cinerama.persistence.repository.FormatoRepository;
import com.project.cinerama.persistence.repository.GeneroRepository;
import com.project.cinerama.persistence.repository.IdiomaRepository;
import com.project.cinerama.persistence.repository.PeliculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final GeneroRepository generoRepository;
    private final IdiomaRepository idiomaRepository;
    private final FormatoRepository formatoRepository;
    private final PeliculaMapper peliculaMapper;

    @Transactional(readOnly = true)
    public List<PeliculaResponse> obtenerTodas() {
        return peliculaRepository.findAll().stream()
                .map(peliculaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PeliculaResponse obtenerPorId(Integer id) {
        PeliculaEntity pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        return peliculaMapper.toResponse(pelicula);
    }

    @Transactional
    public PeliculaResponse crear(PeliculaRequest request) {
        PeliculaEntity pelicula = new PeliculaEntity();
        mapearRequestAEntidad(request, pelicula);
        PeliculaEntity guardada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponse(guardada);
    }

    @Transactional
    public PeliculaResponse actualizar(Integer id, PeliculaRequest request) {
        PeliculaEntity pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Película no encontrada con ID: " + id));
        mapearRequestAEntidad(request, pelicula);
        PeliculaEntity actualizada = peliculaRepository.save(pelicula);
        return peliculaMapper.toResponse(actualizada);
    }

    @Transactional
    public void eliminar(Integer id) {
        if (!peliculaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Película no encontrada con ID: " + id);
        }
        // Si falla por FK violation, GlobalExceptionHandler responde 400 amistoso.
        peliculaRepository.deleteById(id);
    }

    private void mapearRequestAEntidad(PeliculaRequest request, PeliculaEntity entity) {
        entity.setTitulo(request.titulo());
        entity.setSinopsis(request.sinopsis());
        entity.setDuracionMinutos(request.duracionMinutos());
        entity.setClasificacion(request.clasificacion());
        entity.setUrlPoster(request.urlPoster());
        entity.setUrlBanner(request.urlBanner());
        entity.setUrlTrailer(request.urlTrailer());
        entity.setEsEstreno(request.esEstreno() != null ? request.esEstreno() : false);

        if (request.generoIds() != null && !request.generoIds().isEmpty()) {
            Set<GeneroEntity> generos = new HashSet<>(generoRepository.findAllById(request.generoIds()));
            entity.setGeneros(generos);
        } else {
            entity.getGeneros().clear();
        }

        if (request.idiomaIds() != null && !request.idiomaIds().isEmpty()) {
            Set<IdiomaEntity> idiomas = new HashSet<>(idiomaRepository.findAllById(request.idiomaIds()));
            entity.setIdiomas(idiomas);
        } else {
            entity.getIdiomas().clear();
        }

        if (request.formatoIds() != null && !request.formatoIds().isEmpty()) {
            Set<FormatoEntity> formatos = new HashSet<>(formatoRepository.findAllById(request.formatoIds()));
            entity.setFormatos(formatos);
        } else {
            entity.getFormatos().clear();
        }
    }
}
