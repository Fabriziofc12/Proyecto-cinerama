package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.FormatoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormatoRepository extends JpaRepository<FormatoEntity, Integer> {
}
