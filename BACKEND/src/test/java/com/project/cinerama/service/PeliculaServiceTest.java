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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.Set;

import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PeliculaServiceTest {

    private PeliculaRepository peliculaRepository;
    private GeneroRepository generoRepository;
    private IdiomaRepository idiomaRepository;
    private FormatoRepository formatoRepository;
    private PeliculaMapper peliculaMapper;
    private PeliculaService peliculaService;

    @BeforeEach
    void setUp() {
        peliculaRepository = mock(PeliculaRepository.class);
        generoRepository = mock(GeneroRepository.class);
        idiomaRepository = mock(IdiomaRepository.class);
        formatoRepository = mock(FormatoRepository.class);
        peliculaMapper = mock(PeliculaMapper.class);
        peliculaService = new PeliculaService(
                peliculaRepository,
                generoRepository,
                idiomaRepository,
                formatoRepository,
                peliculaMapper
        );
    }

    @Test
    void crearGuardaLaPeliculaConSusCatalogos() {
        GeneroEntity genero = GeneroEntity.builder().id(1).nombre("Drama").build();
        IdiomaEntity idioma = IdiomaEntity.builder().id(2).nombre("Español").build();
        FormatoEntity formato = FormatoEntity.builder().id(3).nombre("2D").build();
        PeliculaRequest request = request("Película nueva", Set.of(1), Set.of(2), Set.of(3));
        PeliculaResponse response = response(8, "Película nueva");

        when(generoRepository.findAllById(Set.of(1))).thenReturn(java.util.List.of(genero));
        when(idiomaRepository.findAllById(Set.of(2))).thenReturn(java.util.List.of(idioma));
        when(formatoRepository.findAllById(Set.of(3))).thenReturn(java.util.List.of(formato));
        when(peliculaRepository.save(any(PeliculaEntity.class))).thenAnswer(invocation -> {
            PeliculaEntity pelicula = invocation.getArgument(0);
            pelicula.setId(8);
            return pelicula;
        });
        when(peliculaMapper.toResponse(any(PeliculaEntity.class))).thenReturn(response);

        PeliculaResponse result = peliculaService.crear(request);

        assertEquals(response, result);
        ArgumentCaptor<PeliculaEntity> peliculaCaptor = ArgumentCaptor.forClass(PeliculaEntity.class);
        verify(peliculaRepository).save(peliculaCaptor.capture());
        assertAll(
                () -> assertEquals("Película nueva", peliculaCaptor.getValue().getTitulo()),
                () -> assertEquals(Set.of(genero), peliculaCaptor.getValue().getGeneros()),
                () -> assertEquals(Set.of(idioma), peliculaCaptor.getValue().getIdiomas()),
                () -> assertEquals(Set.of(formato), peliculaCaptor.getValue().getFormatos())
        );
        verify(peliculaMapper).toResponse(any(PeliculaEntity.class));
    }

    @Test
    void actualizarReemplazaDatosYCatalogos() {
        GeneroEntity genero = GeneroEntity.builder().id(1).nombre("Drama").build();
        PeliculaEntity pelicula = PeliculaEntity.builder()
                .id(4)
                .titulo("Título anterior")
                .duracionMinutos(90)
                .clasificacion("APT")
                .build();
        PeliculaRequest request = request("Título actualizado", Set.of(1), Set.of(), Set.of());
        PeliculaResponse response = response(4, "Título actualizado");

        when(peliculaRepository.findById(4)).thenReturn(Optional.of(pelicula));
        when(generoRepository.findAllById(Set.of(1))).thenReturn(java.util.List.of(genero));
        when(peliculaRepository.save(pelicula)).thenReturn(pelicula);
        when(peliculaMapper.toResponse(pelicula)).thenReturn(response);

        PeliculaResponse result = peliculaService.actualizar(4, request);

        assertEquals(response, result);
        assertAll(
                () -> assertEquals("Título actualizado", pelicula.getTitulo()),
                () -> assertEquals(120, pelicula.getDuracionMinutos()),
                () -> assertEquals(Set.of(genero), pelicula.getGeneros()),
                () -> assertEquals(Set.of(), pelicula.getIdiomas()),
                () -> assertEquals(Set.of(), pelicula.getFormatos())
        );
        verify(peliculaRepository).save(pelicula);
    }

    @Test
    void eliminarBorraUnaPeliculaExistente() {
        when(peliculaRepository.existsById(4)).thenReturn(true);

        peliculaService.eliminar(4);

        verify(peliculaRepository).deleteById(4);
    }

    @Test
    void consultarFallaCuandoLaPeliculaNoExiste() {
        when(peliculaRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> peliculaService.obtenerPorId(99));

        verify(peliculaMapper, never()).toResponse(any(PeliculaEntity.class));
    }

    private PeliculaRequest request(
            String titulo,
            Set<Integer> generoIds,
            Set<Integer> idiomaIds,
            Set<Integer> formatoIds
    ) {
        return new PeliculaRequest(
                titulo,
                "Sinopsis",
                120,
                "APT",
                null,
                null,
                null,
                false,
                generoIds,
                idiomaIds,
                formatoIds
        );
    }

    private PeliculaResponse response(Integer id, String titulo) {
        return new PeliculaResponse(
                id,
                titulo,
                "Sinopsis",
                120,
                "APT",
                null,
                null,
                null,
                false,
                Set.of("Drama"),
                Set.of(),
                Set.of()
        );
    }
}
