package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.CiudadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CiudadRepository extends JpaRepository<CiudadEntity, Integer> {
}
