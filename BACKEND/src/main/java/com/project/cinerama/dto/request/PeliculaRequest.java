package com.project.cinerama.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

/**
 * DTO de entrada para crear o actualizar una Película.
 *
 * Los IDs de géneros, idiomas y formatos son los que ya existen en la BD
 * (catálogos). El Service resolverá las entidades completas a partir de estos IDs.
 */
public record PeliculaRequest(

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede superar los 200 caracteres")
    String titulo,

    String sinopsis,

    @NotNull(message = "La duración es obligatoria")
    @Min(value = 1, message = "La duración debe ser al menos 1 minuto")
    Integer duracionMinutos,

    @NotBlank(message = "La clasificación es obligatoria")
    @Size(max = 20, message = "La clasificación no puede superar los 20 caracteres")
    String clasificacion,

    String urlPoster,
    String urlBanner,
    String urlTrailer,

    Boolean esEstreno,

    @NotNull(message = "Debe asignar al menos un género")
    @Size(min = 1, message = "Debe asignar al menos un género")
    Set<Integer> generoIds,

    Set<Integer> idiomaIds,
    Set<Integer> formatoIds

) {}
