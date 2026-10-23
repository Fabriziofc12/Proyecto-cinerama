package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.FuncionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FuncionRepository extends JpaRepository<FuncionEntity, Integer> {

    /**
     * RF-08: Todas las funciones de una película (por sus cines y horarios).
     */
    List<FuncionEntity> findByPeliculaId(Integer peliculaId);

    /**
     * RF-08: Todas las funciones de una sala específica.
     */
    List<FuncionEntity> findBySalaId(Integer salaId);

    /**
     * RF-08: Funciones de un cine (navegando Sala → Cine).
     * Spring Data resuelve el join automáticamente.
     */
    List<FuncionEntity> findBySalaCineId(Integer cineId);

    /**
     * RF-08: Funciones a partir de una fecha (cartelera vigente).
     */
    List<FuncionEntity> findByFechaHoraInicioAfter(LocalDateTime desde);

    /**
     * ══════════════════════════════════════════════════════════════════
     * RN-01 — VALIDACIÓN DE TRASLAPE DE HORARIOS (Conflict Check)
     * ══════════════════════════════════════════════════════════════════
     *
     * Lógica del traslape:
     *   Una función existente ocupa el rango [existStart, existEnd]
     *   donde existEnd = existStart + duracionMinutos + 15 min de limpieza.
     *
     *   Hay conflicto si la nueva función [nuevaInicio, nuevaFin] se superpone:
     *     nuevaInicio  <  existEnd
     *     nuevaFin     >  existStart
     *
     * Se usa una native query de PostgreSQL porque JPQL no soporta
     * aritmética de intervalos sobre columnas dinámicas.
     *
     * @param salaId      ID de la sala a validar
     * @param nuevaInicio Inicio de la función que se quiere programar
     * @param nuevaFin    Fin calculado: nuevaInicio + duracionMinutos de la nueva pelicula
     * @param excluirId   ID de la función actual (para edición, pasar null en creación)
     * @return true si existe al menos una función que traslapa
     */
    @Query(value = """
        SELECT EXISTS (
            SELECT 1
            FROM funciones f
            JOIN peliculas p ON f.pelicula_id = p.id
            WHERE f.sala_id = :salaId
              AND (:excluirId IS NULL OR f.id <> :excluirId)
              AND :nuevaInicio < (f.fecha_hora_inicio + ((p.duracion_minutos + 15) * INTERVAL '1 minute'))
              AND :nuevaFin    > f.fecha_hora_inicio
        )
        """, nativeQuery = true)
    boolean existeTraslapeEnSala(
        @Param("salaId")      Integer salaId,
        @Param("nuevaInicio") LocalDateTime nuevaInicio,
        @Param("nuevaFin")    LocalDateTime nuevaFin,
        @Param("excluirId")   Integer excluirId
    );

    /**
     * RF-09: Cargar la función con todas sus relaciones necesarias para
     * mostrar el detalle + mapa de asientos. JOIN FETCH evita N+1.
     */
    @Query("""
        SELECT f FROM FuncionEntity f
        JOIN FETCH f.pelicula
        JOIN FETCH f.sala s
        JOIN FETCH s.cine
        JOIN FETCH f.formato
        JOIN FETCH f.idioma
        WHERE f.id = :id
        """)
    java.util.Optional<FuncionEntity> findByIdConRelaciones(@Param("id") Integer id);
}
