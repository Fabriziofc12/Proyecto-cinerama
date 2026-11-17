package com.project.cinerama.service;

import com.project.cinerama.dto.request.CineRequest;
import com.project.cinerama.dto.response.CineResponse;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.CineMapper;
import com.project.cinerama.persistence.entity.CineEntity;
import com.project.cinerama.persistence.entity.CiudadEntity;
import com.project.cinerama.persistence.repository.CineRepository;
import com.project.cinerama.persistence.repository.CiudadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CineService {

    private final CineRepository cineRepository;
    private final CiudadRepository ciudadRepository;
    private final CineMapper cineMapper;

    @Transactional(readOnly = true)
    public List<CineResponse> obtenerTodos() {
        return cineRepository.findAll().stream()
                .map(cineMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CineResponse obtenerPorId(Integer id) {
        CineEntity cine = cineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cine no encontrado con ID: " + id));
        return cineMapper.toResponse(cine);
    }

    @Transactional
    public CineResponse crear(CineRequest request) {
        CiudadEntity ciudad = ciudadRepository.findById(request.ciudadId())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad no encontrada con ID: " + request.ciudadId()));

        CineEntity cine = CineEntity.builder()
                .ciudad(ciudad)
                .nombre(request.nombre())
                .direccion(request.direccion())
                .urlImagen(request.urlImagen())
                .build();

        CineEntity guardado = cineRepository.save(cine);
        return cineMapper.toResponse(guardado);
    }

    @Transactional
    public CineResponse actualizar(Integer id, CineRequest request) {
        CineEntity cine = cineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cine no encontrado con ID: " + id));

        CiudadEntity ciudad = ciudadRepository.findById(request.ciudadId())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad no encontrada con ID: " + request.ciudadId()));

        cine.setCiudad(ciudad);
        cine.setNombre(request.nombre());
        cine.setDireccion(request.direccion());
        cine.setUrlImagen(request.urlImagen());

        CineEntity actualizado = cineRepository.save(cine);
        return cineMapper.toResponse(actualizado);
    }

    @Transactional
    public void eliminar(Integer id) {
        if (!cineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cine no encontrado con ID: " + id);
        }
        // Si la eliminación falla por FK constraint (salas/funciones), GlobalExceptionHandler responde 400 amistoso.
        cineRepository.deleteById(id);
    }
}
