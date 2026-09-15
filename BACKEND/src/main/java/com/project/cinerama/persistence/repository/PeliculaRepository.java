package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.PeliculaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeliculaRepository extends JpaRepository<PeliculaEntity, Integer> {

    /**
     * RF-07: Cartelera de estrenos.
     * Spring Data infiere: WHERE es_estreno = true
     */
    List<PeliculaEntity> findByEsEstrenoTrue();

    /**
     * RF-07: Filtrar películas por nombre de género.
     * JOIN FETCH para traer géneros en una sola query (evita N+1).
     */
    @Query("""
        SELECT DISTINCT p FROM PeliculaEntity p
        JOIN FETCH p.generos g
        WHERE g.nombre = :nombreGenero
        """)
    List<PeliculaEntity> findByGeneroNombre(@Param("nombreGenero") String nombreGenero);

    /**
     * RF-07: Filtrar películas por nombre de formato (ej: "3D", "IMAX").
     */
    @Query("""
        SELECT DISTINCT p FROM PeliculaEntity p
        JOIN FETCH p.formatos f
        WHERE f.nombre = :nombreFormato
        """)
    List<PeliculaEntity> findByFormatoNombre(@Param("nombreFormato") String nombreFormato);

    /**
     * RF-08: Buscar por título (búsqueda parcial, insensible a mayúsculas).
     * Spring Data infiere: WHERE LOWER(titulo) LIKE LOWER(:titulo)
     */
    List<PeliculaEntity> findByTituloContainingIgnoreCase(String titulo);

    /**
     * RF-06/RF-08: Cargar una película con todas sus relaciones en una sola query.
     * Se usa en el detalle de película para evitar múltiples queries lazy.
     */
    @Query("""
        SELECT p FROM PeliculaEntity p
        LEFT JOIN FETCH p.generos
        LEFT JOIN FETCH p.idiomas
        LEFT JOIN FETCH p.formatos
        WHERE p.id = :id
        """)
    java.util.Optional<PeliculaEntity> findByIdConRelaciones(@Param("id") Integer id);
}
