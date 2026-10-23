package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.SalaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaRepository extends JpaRepository<SalaEntity, Integer> {
    List<SalaEntity> findByCineId(Integer cineId);
}
