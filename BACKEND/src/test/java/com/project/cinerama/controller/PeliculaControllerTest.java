package com.project.cinerama.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.cinerama.dto.request.PeliculaRequest;
import com.project.cinerama.dto.response.PeliculaResponse;
import com.project.cinerama.exception.GlobalExceptionHandler;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.service.PeliculaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

class PeliculaControllerTest {

    private MockMvc mockMvc;
    private PeliculaService peliculaService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        peliculaService = mock(PeliculaService.class);
        objectMapper = new ObjectMapper();

        mockMvc = standaloneSetup(new PeliculaController(peliculaService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void listarTodas_debeRetornarOkYListaDePeliculas() throws Exception {
        PeliculaResponse pelicula = new PeliculaResponse(
                1,
                "Avatar",
                "Sinopsis",
                180,
                "PG-13",
                "poster.jpg",
                "banner.jpg",
                "trailer.mp4",
                true,
                Set.of("Acción"),
                Set.of("Español"),
                Set.of("3D")
        );

        when(peliculaService.obtenerTodas()).thenReturn(List.of(pelicula));

        mockMvc.perform(get("/api/peliculas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].titulo").value("Avatar"))
                .andExpect(jsonPath("$[0].duracionMinutos").value(180))
                .andExpect(jsonPath("$[0].clasificacion").value("PG-13"))
                .andExpect(jsonPath("$[0].esEstreno").value(true));
    }

    @Test
    void obtenerPorId_debeRetornarPeliculaCuandoExiste() throws Exception {
        PeliculaResponse pelicula = new PeliculaResponse(
                1,
                "Avatar",
                "Sinopsis",
                180,
                "PG-13",
                "poster.jpg",
                "banner.jpg",
                "trailer.mp4",
                true,
                Set.of("Acción"),
                Set.of("Español"),
                Set.of("3D")
        );

        when(peliculaService.obtenerPorId(1)).thenReturn(pelicula);

        mockMvc.perform(get("/api/peliculas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Avatar"));
    }

    @Test
    void obtenerPorId_debeRetornarNotFoundCuandoNoExiste() throws Exception {
        when(peliculaService.obtenerPorId(99))
                .thenThrow(new ResourceNotFoundException("Película no encontrada"));

        mockMvc.perform(get("/api/peliculas/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Recurso No Encontrado"))
                .andExpect(jsonPath("$.message").value("Película no encontrada"));
    }

    @Test
    void crear_debeRetornarCreatedCuandoRequestEsValido() throws Exception {
        PeliculaRequest request = new PeliculaRequest(
                "Avatar",
                "Sinopsis",
                180,
                "PG-13",
                "poster.jpg",
                "banner.jpg",
                "trailer.mp4",
                true,
                Set.of(1),
                Set.of(1),
                Set.of(1)
        );

        PeliculaResponse response = new PeliculaResponse(
                1,
                "Avatar",
                "Sinopsis",
                180,
                "PG-13",
                "poster.jpg",
                "banner.jpg",
                "trailer.mp4",
                true,
                Set.of("Acción"),
                Set.of("Español"),
                Set.of("3D")
        );

        when(peliculaService.crear(any(PeliculaRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/peliculas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Avatar"));
    }

    @Test
    void crear_debeRetornarBadRequestCuandoRequestEsInvalido() throws Exception {
        PeliculaRequest request = new PeliculaRequest(
                "",
                "Sinopsis",
                0,
                "",
                "poster.jpg",
                "banner.jpg",
                "trailer.mp4",
                true,
                Set.of(),
                Set.of(1),
                Set.of(1)
        );

        mockMvc.perform(post("/api/peliculas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Error de Validación de Datos"));
    }

    @Test
    void actualizar_debeRetornarOkCuandoRequestEsValido() throws Exception {
        PeliculaRequest request = new PeliculaRequest(
                "Avatar 2",
                "Sinopsis actualizada",
                190,
                "PG-13",
                "poster2.jpg",
                "banner2.jpg",
                "trailer2.mp4",
                true,
                Set.of(1),
                Set.of(1),
                Set.of(1)
        );

        PeliculaResponse response = new PeliculaResponse(
                1,
                "Avatar 2",
                "Sinopsis actualizada",
                190,
                "PG-13",
                "poster2.jpg",
                "banner2.jpg",
                "trailer2.mp4",
                true,
                Set.of("Acción"),
                Set.of("Español"),
                Set.of("3D")
        );

        when(peliculaService.actualizar(eq(1), any(PeliculaRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/peliculas/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.titulo").value("Avatar 2"));
    }

    @Test
    void eliminar_debeRetornarNoContent() throws Exception {
        doNothing().when(peliculaService).eliminar(1);

        mockMvc.perform(delete("/api/peliculas/1"))
                .andExpect(status().isNoContent());

        verify(peliculaService).eliminar(1);
    }
}