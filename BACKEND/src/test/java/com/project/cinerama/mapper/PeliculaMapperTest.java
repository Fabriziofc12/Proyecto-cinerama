package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.PeliculaResponse;
import com.project.cinerama.persistence.entity.FormatoEntity;
import com.project.cinerama.persistence.entity.GeneroEntity;
import com.project.cinerama.persistence.entity.IdiomaEntity;
import com.project.cinerama.persistence.entity.PeliculaEntity;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PeliculaMapperTest {

    private final PeliculaMapper peliculaMapper = new PeliculaMapper();

    @Test
    void toResponse_debeRetornarNullCuandoEntityEsNull() {
        PeliculaResponse response = peliculaMapper.toResponse(null);

        assertNull(response);
    }

    @Test
    void toResponse_debeMapearPeliculaConRelaciones() {
        GeneroEntity genero = new GeneroEntity();
        genero.setId(1);
        genero.setNombre("Acción");

        IdiomaEntity idioma = new IdiomaEntity();
        idioma.setId(1);
        idioma.setNombre("Español");

        FormatoEntity formato = new FormatoEntity();
        formato.setId(1);
        formato.setNombre("3D");

        PeliculaEntity entity = PeliculaEntity.builder()
                .id(1)
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .urlPoster("poster.jpg")
                .urlBanner("banner.jpg")
                .urlTrailer("trailer.mp4")
                .esEstreno(true)
                .generos(Set.of(genero))
                .idiomas(Set.of(idioma))
                .formatos(Set.of(formato))
                .build();

        PeliculaResponse response = peliculaMapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals("Avatar", response.titulo());
        assertEquals("Sinopsis", response.sinopsis());
        assertEquals(180, response.duracionMinutos());
        assertEquals("PG-13", response.clasificacion());
        assertEquals("poster.jpg", response.urlPoster());
        assertEquals("banner.jpg", response.urlBanner());
        assertEquals("trailer.mp4", response.urlTrailer());
        assertEquals(true, response.esEstreno());
        assertTrue(response.generos().contains("Acción"));
        assertTrue(response.idiomas().contains("Español"));
        assertTrue(response.formatos().contains("3D"));
    }

    @Test
    void toResponse_debeRetornarSetsVaciosCuandoRelacionesSonNull() {
        PeliculaEntity entity = PeliculaEntity.builder()
                .id(1)
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .urlPoster("poster.jpg")
                .urlBanner("banner.jpg")
                .urlTrailer("trailer.mp4")
                .esEstreno(true)
                .generos(null)
                .idiomas(null)
                .formatos(null)
                .build();

        PeliculaResponse response = peliculaMapper.toResponse(entity);

        assertNotNull(response);
        assertTrue(response.generos().isEmpty());
        assertTrue(response.idiomas().isEmpty());
        assertTrue(response.formatos().isEmpty());
    }
}