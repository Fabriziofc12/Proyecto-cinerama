package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.CineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CineRepository extends JpaRepository<CineEntity, Integer> {
    List<CineEntity> findByCiudadId(Integer ciudadId);
}
