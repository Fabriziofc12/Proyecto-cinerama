package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.IdiomaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdiomaRepository extends JpaRepository<IdiomaEntity, Integer> {
}
