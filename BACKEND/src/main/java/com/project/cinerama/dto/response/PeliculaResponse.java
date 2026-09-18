package com.project.cinerama.dto.response;

import java.util.Set;

/**
 * DTO de salida para Película.
 *
 * Los nombres de géneros, idiomas y formatos se devuelven como Strings (no IDs)
 * para que el frontend no tenga que hacer lookups adicionales.
 */
public record PeliculaResponse(
    Integer id,
    String  titulo,
    String  sinopsis,
    Integer duracionMinutos,
    String  clasificacion,
    String  urlPoster,
    String  urlBanner,
    String  urlTrailer,
    Boolean esEstreno,
    Set<String> generos,   // Nombres, no IDs → ej: {"Acción", "Drama"}
    Set<String> idiomas,   // ej: {"Español", "Inglés"}
    Set<String> formatos   // ej: {"2D", "3D", "IMAX"}
) {}
