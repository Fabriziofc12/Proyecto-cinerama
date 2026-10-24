package com.project.cinerama.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.cinerama.dto.request.CineRequest;
import com.project.cinerama.dto.response.CineResponse;
import com.project.cinerama.exception.GlobalExceptionHandler;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.service.CineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

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

class CineControllerTest {

    private MockMvc mockMvc;
    private CineService cineService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        cineService = mock(CineService.class);
        objectMapper = new ObjectMapper();

        mockMvc = standaloneSetup(new CineController(cineService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void listarTodos_debeRetornarOkYListaDeCines() throws Exception {
        CineResponse cine = new CineResponse(
                1,
                "Cinerama Centro",
                "Av. Principal 123",
                "cine.jpg",
                "Lima"
        );

        when(cineService.obtenerTodos()).thenReturn(List.of(cine));

        mockMvc.perform(get("/api/cines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nombre").value("Cinerama Centro"))
                .andExpect(jsonPath("$[0].direccion").value("Av. Principal 123"))
                .andExpect(jsonPath("$[0].ciudadNombre").value("Lima"));
    }

    @Test
    void obtenerPorId_debeRetornarCineCuandoExiste() throws Exception {
        CineResponse cine = new CineResponse(
                1,
                "Cinerama Centro",
                "Av. Principal 123",
                "cine.jpg",
                "Lima"
        );

        when(cineService.obtenerPorId(1)).thenReturn(cine);

        mockMvc.perform(get("/api/cines/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Cinerama Centro"));
    }

    @Test
    void obtenerPorId_debeRetornarNotFoundCuandoNoExiste() throws Exception {
        when(cineService.obtenerPorId(99))
                .thenThrow(new ResourceNotFoundException("Cine no encontrado"));

        mockMvc.perform(get("/api/cines/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Recurso No Encontrado"))
                .andExpect(jsonPath("$.message").value("Cine no encontrado"));
    }

    @Test
    void crear_debeRetornarCreatedCuandoRequestEsValido() throws Exception {
        CineRequest request = new CineRequest(
                1,
                "Cinerama Centro",
                "Av. Principal 123",
                "cine.jpg"
        );

        CineResponse response = new CineResponse(
                1,
                "Cinerama Centro",
                "Av. Principal 123",
                "cine.jpg",
                "Lima"
        );

        when(cineService.crear(any(CineRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/cines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Cinerama Centro"));
    }

    @Test
    void crear_debeRetornarBadRequestCuandoRequestEsInvalido() throws Exception {
        CineRequest request = new CineRequest(
                null,
                "",
                "",
                "cine.jpg"
        );

        mockMvc.perform(post("/api/cines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Error de Validación de Datos"));
    }

    @Test
    void actualizar_debeRetornarOkCuandoRequestEsValido() throws Exception {
        CineRequest request = new CineRequest(
                1,
                "Cinerama Actualizado",
                "Av. Nueva 456",
                "cine2.jpg"
        );

        CineResponse response = new CineResponse(
                1,
                "Cinerama Actualizado",
                "Av. Nueva 456",
                "cine2.jpg",
                "Lima"
        );

        when(cineService.actualizar(eq(1), any(CineRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/cines/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nombre").value("Cinerama Actualizado"));
    }

    @Test
    void eliminar_debeRetornarNoContent() throws Exception {
        doNothing().when(cineService).eliminar(1);

        mockMvc.perform(delete("/api/cines/1"))
                .andExpect(status().isNoContent());

        verify(cineService).eliminar(1);
    }
}