package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.DetalleReservaEntity;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * Repository para detalle_reservas.
 *
 * ══════════════════════════════════════════════════════════════════════
 * RN-02 / RNF-03 — CONTROL DE CONCURRENCIA (Bloqueo Pesimista)
 * ══════════════════════════════════════════════════════════════════════
 *
 * Problema: Si dos usuarios intentan comprar el Asiento A1 de la Función F
 * al mismo tiempo, ambos podrían pasar el chequeo "¿está disponible?" antes
 * de que cualquiera haya insertado su detalle → condición de carrera.
 *
 * Solución implementada — Bloqueo Pesimista (SELECT ... FOR UPDATE):
 *
 *   El Service, dentro de una transacción @Transactional, llama a
 *   findAsientosOcupadosEnFuncionConLock() con @Lock(PESSIMISTIC_WRITE).
 *
 *   Hibernate emitirá: SELECT ... FROM detalle_reservas ... FOR UPDATE
 *
 *   Esto bloquea las filas leídas en PostgreSQL hasta que termine la transacción.
 *   El segundo usuario queda en espera y, al reanudar, verá el asiento ya ocupado.
 *
 * Por qué pesimista y no optimista (@Version):
 *   - En un sistema de reservas de asientos, la contención es alta y predecible.
 *   - El bloqueo optimista causaría muchos reintentos y una UX muy pobre.
 *   - El pesimista garantiza que solo un hilo "gana" por asiento.
 *
 * NOTA IMPORTANTE sobre el índice de la BD:
 *   El UNIQUE INDEX actual en la BD es sobre (reserva_id, asiento_id).
 *   Esto previene el mismo asiento dos veces en la MISMA reserva, pero no
 *   protege contra el mismo asiento en DOS reservas distintas de la MISMA función.
 *   → Considera agregar en el DDL:
 *   CREATE UNIQUE INDEX uk_detalle_funcion_asiento
 *     ON detalle_reservas (asiento_id, (SELECT funcion_id FROM reservas WHERE id = reserva_id));
 *   O manejarlo solo a nivel de aplicación (opción actual).
 */
@Repository
public interface DetalleReservaRepository extends JpaRepository<DetalleReservaEntity, Integer> {

    /**
     * RF-09: IDs de asientos ya ocupados en una función dada.
     * Usado para construir el mapa interactivo de asientos (libres vs ocupados).
     * Solo considera reservas ACTIVAS (no CANCELADAS).
     */
    @Query("""
        SELECT d.asiento.id
        FROM DetalleReservaEntity d
        WHERE d.reserva.funcion.id = :funcionId
          AND d.reserva.estado <> com.project.cinerama.persistence.entity.ReservaEstado.CANCELADA
        """)
    Set<Integer> findAsientoIdsOcupadosEnFuncion(@Param("funcionId") Integer funcionId);

    /**
     * RN-02 / RNF-03: Misma query anterior pero con BLOQUEO PESIMISTA.
     *
     * Úsala SOLO dentro de un @Transactional en el Service, justo antes
     * de intentar insertar los nuevos detalles. El lock se libera al final
     * de la transacción (commit o rollback).
     *
     * Flujo del Service:
     *   1. [LOCK] findAsientosOcupadosEnFuncionConLock(funcionId)
     *   2. Verificar que ningún asientoId del request esté en el resultado
     *   3. Si alguno está ocupado → lanzar excepción (rollback automático)
     *   4. Si todos libres → guardar ReservaEntity con sus detalles (cascade)
     *   5. [COMMIT] → lock liberado
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT d
        FROM DetalleReservaEntity d
        WHERE d.reserva.funcion.id = :funcionId
          AND d.reserva.estado <> com.project.cinerama.persistence.entity.ReservaEstado.CANCELADA
          AND d.asiento.id IN :asientoIds
        """)
    List<DetalleReservaEntity> findAsientosOcupadosEnFuncionConLock(
        @Param("funcionId")  Integer funcionId,
        @Param("asientoIds") Set<Integer> asientoIds
    );

    /**
     * Todos los detalles de una reserva específica (para el ticket/resumen).
     */
    List<DetalleReservaEntity> findByReservaId(Integer reservaId);
}
