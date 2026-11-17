package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.CineEntity;
import com.project.cinerama.persistence.entity.CiudadEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
class CineRepositoryTest {

    @Autowired
    private CineRepository cineRepository;

    @Autowired
    private CiudadRepository ciudadRepository;

    @Test
    void findByCiudadId_debeRetornarCinesDeLaCiudadIndicada() {
        CiudadEntity lima = new CiudadEntity();
        lima.setNombre("Lima");
        ciudadRepository.save(lima);

        CiudadEntity cusco = new CiudadEntity();
        cusco.setNombre("Cusco");
        ciudadRepository.save(cusco);

        CineEntity cineLima = CineEntity.builder()
                .nombre("Cinerama Centro")
                .direccion("Av. Principal 123")
                .urlImagen("cine-lima.jpg")
                .ciudad(lima)
                .build();

        CineEntity cineCusco = CineEntity.builder()
                .nombre("Cinerama Cusco")
                .direccion("Av. Cusco 456")
                .urlImagen("cine-cusco.jpg")
                .ciudad(cusco)
                .build();

        cineRepository.save(cineLima);
        cineRepository.save(cineCusco);

        List<CineEntity> resultado = cineRepository.findByCiudadId(lima.getId());

        assertEquals(1, resultado.size());
        assertEquals("Cinerama Centro", resultado.getFirst().getNombre());
        assertEquals("Lima", resultado.getFirst().getCiudad().getNombre());
    }

    @Test
    void findAll_debeRetornarTodosLosCinesGuardados() {
        CiudadEntity ciudad = new CiudadEntity();
        ciudad.setNombre("Lima");
        ciudadRepository.save(ciudad);

        CineEntity cineUno = CineEntity.builder()
                .nombre("Cinerama Centro")
                .direccion("Av. Principal 123")
                .urlImagen("cine1.jpg")
                .ciudad(ciudad)
                .build();

        CineEntity cineDos = CineEntity.builder()
                .nombre("Cinerama Norte")
                .direccion("Av. Norte 456")
                .urlImagen("cine2.jpg")
                .ciudad(ciudad)
                .build();

        cineRepository.save(cineUno);
        cineRepository.save(cineDos);

        List<CineEntity> resultado = cineRepository.findAll();

        assertEquals(2, resultado.size());
    }
}