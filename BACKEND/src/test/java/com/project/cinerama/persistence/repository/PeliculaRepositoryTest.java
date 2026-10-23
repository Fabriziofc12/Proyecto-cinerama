package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.FormatoEntity;
import com.project.cinerama.persistence.entity.GeneroEntity;
import com.project.cinerama.persistence.entity.IdiomaEntity;
import com.project.cinerama.persistence.entity.PeliculaEntity;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class PeliculaRepositoryTest {

    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    private GeneroRepository generoRepository;

    @Autowired
    private IdiomaRepository idiomaRepository;

    @Autowired
    private FormatoRepository formatoRepository;

    @Test
    void findByEsEstrenoTrue_debeRetornarSoloPeliculasEstreno() {
        PeliculaEntity estreno = PeliculaEntity.builder()
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .esEstreno(true)
                .build();

        PeliculaEntity noEstreno = PeliculaEntity.builder()
                .titulo("Titanic")
                .sinopsis("Sinopsis")
                .duracionMinutos(195)
                .clasificacion("PG-13")
                .esEstreno(false)
                .build();

        peliculaRepository.save(estreno);
        peliculaRepository.save(noEstreno);

        List<PeliculaEntity> resultado = peliculaRepository.findByEsEstrenoTrue();

        assertEquals(1, resultado.size());
        assertEquals("Avatar", resultado.getFirst().getTitulo());
    }

    @Test
    void findByTituloContainingIgnoreCase_debeBuscarPorTituloParcialSinImportarMayusculas() {
        PeliculaEntity pelicula = PeliculaEntity.builder()
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .esEstreno(true)
                .build();

        peliculaRepository.save(pelicula);

        List<PeliculaEntity> resultado = peliculaRepository.findByTituloContainingIgnoreCase("ava");

        assertEquals(1, resultado.size());
        assertEquals("Avatar", resultado.getFirst().getTitulo());
    }

    @Test
    void findByGeneroNombre_debeRetornarPeliculasDelGeneroIndicado() {
        GeneroEntity genero = new GeneroEntity();
        genero.setNombre("Acción");
        generoRepository.save(genero);

        PeliculaEntity pelicula = PeliculaEntity.builder()
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .esEstreno(true)
                .generos(Set.of(genero))
                .build();

        peliculaRepository.save(pelicula);

        List<PeliculaEntity> resultado = peliculaRepository.findByGeneroNombre("Acción");

        assertEquals(1, resultado.size());
        assertEquals("Avatar", resultado.getFirst().getTitulo());
    }

    @Test
    void findByFormatoNombre_debeRetornarPeliculasDelFormatoIndicado() {
        FormatoEntity formato = new FormatoEntity();
        formato.setNombre("3D");
        formatoRepository.save(formato);

        PeliculaEntity pelicula = PeliculaEntity.builder()
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .esEstreno(true)
                .formatos(Set.of(formato))
                .build();

        peliculaRepository.save(pelicula);

        List<PeliculaEntity> resultado = peliculaRepository.findByFormatoNombre("3D");

        assertEquals(1, resultado.size());
        assertEquals("Avatar", resultado.getFirst().getTitulo());
    }

    @Test
    void findByIdConRelaciones_debeRetornarPeliculaConRelaciones() {
        GeneroEntity genero = new GeneroEntity();
        genero.setNombre("Acción");
        generoRepository.save(genero);

        IdiomaEntity idioma = new IdiomaEntity();
        idioma.setNombre("Español");
        idiomaRepository.save(idioma);

        FormatoEntity formato = new FormatoEntity();
        formato.setNombre("3D");
        formatoRepository.save(formato);

        PeliculaEntity pelicula = PeliculaEntity.builder()
                .titulo("Avatar")
                .sinopsis("Sinopsis")
                .duracionMinutos(180)
                .clasificacion("PG-13")
                .esEstreno(true)
                .generos(Set.of(genero))
                .idiomas(Set.of(idioma))
                .formatos(Set.of(formato))
                .build();

        PeliculaEntity guardada = peliculaRepository.save(pelicula);

        Optional<PeliculaEntity> resultado = peliculaRepository.findByIdConRelaciones(guardada.getId());

        assertTrue(resultado.isPresent());
        assertEquals("Avatar", resultado.get().getTitulo());
        assertEquals(1, resultado.get().getGeneros().size());
        assertEquals(1, resultado.get().getIdiomas().size());
        assertEquals(1, resultado.get().getFormatos().size());
    }
}