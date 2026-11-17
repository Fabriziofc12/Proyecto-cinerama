package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.UsuarioResponse;
import com.project.cinerama.persistence.entity.UsuarioEntity;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponse toResponse(UsuarioEntity entity) {
        if (entity == null) {
            return null;
        }

        return new UsuarioResponse(
                entity.getId(),
                entity.getNombreCompleto(),
                entity.getCorreoElectronico(),
                entity.getFechaCreacion()
        );
    }
}
