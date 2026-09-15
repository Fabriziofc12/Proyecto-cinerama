package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.ReservaEntity;
import com.project.cinerama.persistence.entity.ReservaEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<ReservaEntity, Integer> {

    /**
     * RF-10: Historial de reservas de un usuario autenticado.
     */
    List<ReservaEntity> findByUsuarioId(Integer usuarioId);

    /**
     * RF-04: Todas las reservas de una función (vista de taquilla admin).
     */
    List<ReservaEntity> findByFuncionId(Integer funcionId);

    /**
     * RF-04: Reservas de una función filtradas por estado (ej: solo CONFIRMADA).
     */
    List<ReservaEntity> findByFuncionIdAndEstado(Integer funcionId, ReservaEstado estado);

    /**
     * Carga la reserva con todos sus detalles y asientos en una sola query.
     * Usado para mostrar el resumen de compra (RF-09) y el ticket.
     * JOIN FETCH en colección → requiere DISTINCT para evitar duplicados por el JOIN.
     */
    @Query("""
        SELECT DISTINCT r FROM ReservaEntity r
        JOIN FETCH r.funcion f
        JOIN FETCH f.pelicula
        JOIN FETCH f.sala s
        JOIN FETCH s.cine
        JOIN FETCH r.detalles d
        JOIN FETCH d.asiento
        WHERE r.id = :id
        """)
    Optional<ReservaEntity> findByIdConDetalles(@Param("id") Integer id);

    /**
     * RF-06: Ingresos totales agrupados por cine (para el dashboard admin).
     * Devuelve Object[] → [cineNombre, totalIngresos].
     * El Service lo mapeará a un DTO de reporte.
     */
    @Query("""
        SELECT s.cine.nombre, SUM(r.montoTotal)
        FROM ReservaEntity r
        JOIN r.funcion f
        JOIN f.sala s
        WHERE r.estado = 'CONFIRMADA'
        GROUP BY s.cine.nombre
        ORDER BY SUM(r.montoTotal) DESC
        """)
    List<Object[]> findIngresosPorCine();
}
