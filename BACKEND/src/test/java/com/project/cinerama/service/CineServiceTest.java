package com.project.cinerama.service;

import com.project.cinerama.dto.request.CineRequest;
import com.project.cinerama.dto.response.CineResponse;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.CineMapper;
import com.project.cinerama.persistence.entity.CineEntity;
import com.project.cinerama.persistence.entity.CiudadEntity;
import com.project.cinerama.persistence.repository.CineRepository;
import com.project.cinerama.persistence.repository.CiudadRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CineServiceTest {

    private CineRepository cineRepository;
    private CiudadRepository ciudadRepository;
    private CineMapper cineMapper;
    private CineService cineService;

    @BeforeEach
    void setUp() {
        cineRepository = mock(CineRepository.class);
        ciudadRepository = mock(CiudadRepository.class);
        cineMapper = mock(CineMapper.class);
        cineService = new CineService(cineRepository, ciudadRepository, cineMapper);
    }

    @Test
    void crearGuardaElCineAsociadoConLaCiudad() {
        CiudadEntity ciudad = CiudadEntity.builder().id(3).nombre("Lima").build();
        CineRequest request = new CineRequest(3, "Cinerama Centro", "Av. Central 123", null);
        CineResponse response = new CineResponse(7, "Cinerama Centro", "Av. Central 123", null, "Lima");

        when(ciudadRepository.findById(3)).thenReturn(Optional.of(ciudad));
        when(cineRepository.save(any(CineEntity.class))).thenAnswer(invocation -> {
            CineEntity cine = invocation.getArgument(0);
            cine.setId(7);
            return cine;
        });
        when(cineMapper.toResponse(any(CineEntity.class))).thenReturn(response);

        CineResponse result = cineService.crear(request);

        assertEquals(response, result);
        ArgumentCaptor<CineEntity> cineCaptor = ArgumentCaptor.forClass(CineEntity.class);
        verify(cineRepository).save(cineCaptor.capture());
        assertEquals(ciudad, cineCaptor.getValue().getCiudad());
        assertEquals("Cinerama Centro", cineCaptor.getValue().getNombre());
        assertEquals("Av. Central 123", cineCaptor.getValue().getDireccion());
        verify(cineMapper).toResponse(any(CineEntity.class));
    }

    @Test
    void actualizarModificaLosDatosYLaCiudad() {
        CiudadEntity ciudadAnterior = CiudadEntity.builder().id(1).nombre("Lima").build();
        CiudadEntity ciudadNueva = CiudadEntity.builder().id(2).nombre("Arequipa").build();
        CineEntity cine = CineEntity.builder()
                .id(5)
                .ciudad(ciudadAnterior)
                .nombre("Nombre anterior")
                .direccion("Dirección anterior")
                .build();
        CineRequest request = new CineRequest(2, "Cinerama Sur", "Av. Nueva 456", "poster.png");
        CineResponse response = new CineResponse(5, "Cinerama Sur", "Av. Nueva 456", "poster.png", "Arequipa");

        when(cineRepository.findById(5)).thenReturn(Optional.of(cine));
        when(ciudadRepository.findById(2)).thenReturn(Optional.of(ciudadNueva));
        when(cineRepository.save(cine)).thenReturn(cine);
        when(cineMapper.toResponse(cine)).thenReturn(response);

        CineResponse result = cineService.actualizar(5, request);

        assertEquals(response, result);
        assertEquals(ciudadNueva, cine.getCiudad());
        assertEquals("Cinerama Sur", cine.getNombre());
        assertEquals("Av. Nueva 456", cine.getDireccion());
        assertEquals("poster.png", cine.getUrlImagen());
        verify(cineRepository).save(cine);
    }

    @Test
    void eliminarBorraUnCineExistente() {
        when(cineRepository.existsById(5)).thenReturn(true);

        cineService.eliminar(5);

        verify(cineRepository).deleteById(5);
    }

    @Test
    void crearFallaSiLaCiudadNoExiste() {
        when(ciudadRepository.findById(99)).thenReturn(Optional.empty());
        CineRequest request = new CineRequest(99, "Cinerama", "Dirección", null);

        assertThrows(ResourceNotFoundException.class, () -> cineService.crear(request));

        verify(cineRepository, never()).save(any(CineEntity.class));
    }

    @Test
    void eliminarFallaSiElCineNoExiste() {
        when(cineRepository.existsById(99)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> cineService.eliminar(99));

        verify(cineRepository, never()).deleteById(99);
    }
}
