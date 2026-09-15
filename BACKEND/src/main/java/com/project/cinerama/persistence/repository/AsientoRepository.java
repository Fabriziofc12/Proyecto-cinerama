package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.AsientoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsientoRepository extends JpaRepository<AsientoEntity, Integer> {

    /**
     * Busca todos los asientos de una sala.
     * Usado para mostrar el mapa de asientos (RF-09) y para validar RN-04.
     */
    List<AsientoEntity> findBySalaId(Integer salaId);

    /**
     * Cuenta los asientos registrados de una sala.
     * Útil para validar que total_asientos == cantidad registrada (RN-04).
     */
    long countBySalaId(Integer salaId);
}
