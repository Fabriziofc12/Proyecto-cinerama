package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.CineResponse;
import com.project.cinerama.persistence.entity.CineEntity;
import com.project.cinerama.persistence.entity.CiudadEntity;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class CineMapperTest {

    private final CineMapper cineMapper = new CineMapper();

    @Test
    void toResponse_debeRetornarNullCuandoEntityEsNull() {
        CineResponse response = cineMapper.toResponse(null);

        assertNull(response);
    }

    @Test
    void toResponse_debeMapearCineConCiudad() {
        CiudadEntity ciudad = new CiudadEntity();
        ciudad.setId(1);
        ciudad.setNombre("Lima");

        CineEntity entity = CineEntity.builder()
                .id(1)
                .nombre("Cinerama Centro")
                .direccion("Av. Principal 123")
                .urlImagen("cine.jpg")
                .ciudad(ciudad)
                .build();

        CineResponse response = cineMapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals("Cinerama Centro", response.nombre());
        assertEquals("Av. Principal 123", response.direccion());
        assertEquals("cine.jpg", response.urlImagen());
        assertEquals("Lima", response.ciudadNombre());
    }

    @Test
    void toResponse_debeMapearCiudadNombreNullCuandoCiudadEsNull() {
        CineEntity entity = CineEntity.builder()
                .id(1)
                .nombre("Cinerama Centro")
                .direccion("Av. Principal 123")
                .urlImagen("cine.jpg")
                .ciudad(null)
                .build();

        CineResponse response = cineMapper.toResponse(entity);

        assertNotNull(response);
        assertEquals(1, response.id());
        assertEquals("Cinerama Centro", response.nombre());
        assertNull(response.ciudadNombre());
    }
}