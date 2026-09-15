package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.GeneroEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneroRepository extends JpaRepository<GeneroEntity, Integer> {
}
