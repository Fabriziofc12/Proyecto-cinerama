package com.project.cinerama.persistence.repository;

import com.project.cinerama.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Integer> {

    /**
     * RF-05 / RNF-01: Buscar usuario por correo para autenticación.
     * Spring Security (futuro) usará este método en el UserDetailsService.
     */
    Optional<UsuarioEntity> findByCorreoElectronico(String correoElectronico);

    /**
     * Validación de unicidad antes de registrar un nuevo usuario.
     * Más eficiente que findByCorreoElectronico() cuando solo necesitamos saber si existe.
     */
    boolean existsByCorreoElectronico(String correoElectronico);
}
