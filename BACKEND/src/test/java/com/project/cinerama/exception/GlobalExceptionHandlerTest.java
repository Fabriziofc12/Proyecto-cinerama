package com.project.cinerama.exception;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleNotFound_debeRetornarStatus404() {
        ResourceNotFoundException exception = new ResourceNotFoundException("Recurso no encontrado");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleNotFound(exception);

        assertEquals(404, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().status());
        assertEquals("Recurso No Encontrado", response.getBody().error());
        assertEquals("Recurso no encontrado", response.getBody().message());
    }

    @Test
    void handleConflict_debeRetornarStatus409() {
        ConflictException exception = new ConflictException("Conflicto detectado");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleConflict(exception);

        assertEquals(409, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(409, response.getBody().status());
        assertEquals("Conflicto de Horario / Recursos", response.getBody().error());
        assertEquals("Conflicto detectado", response.getBody().message());
    }

    @Test
    void handleBusinessRule_debeRetornarStatus400() {
        BusinessRuleException exception = new BusinessRuleException("Regla incumplida");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleBusinessRule(exception);

        assertEquals(400, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().status());
        assertEquals("Regla de Negocio Incumplida", response.getBody().error());
        assertEquals("Regla incumplida", response.getBody().message());
    }

    @Test
    void handleDataIntegrityViolation_debeRetornarStatus400() {
        DataIntegrityViolationException exception = new DataIntegrityViolationException("Error de integridad");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleDataIntegrityViolation(exception);

        assertEquals(400, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().status());
        assertEquals("Restricción de Borrado / Integridad de Datos", response.getBody().error());
        assertEquals(
                "No se puede realizar la operación porque el registro posee relaciones o datos vinculados en el sistema (ej. funciones o reservas activas).",
                response.getBody().message()
        );
    }

    @Test
    void handleGenericException_debeRetornarStatus500() {
        Exception exception = new Exception("Error inesperado");

        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = handler.handleGenericException(exception);

        assertEquals(500, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(500, response.getBody().status());
        assertEquals("Error Interno del Servidor", response.getBody().error());
        assertEquals("Error inesperado", response.getBody().message());
    }
}