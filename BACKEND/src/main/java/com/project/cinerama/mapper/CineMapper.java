package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.CineResponse;
import com.project.cinerama.persistence.entity.CineEntity;
import org.springframework.stereotype.Component;

@Component
public class CineMapper {

    public CineResponse toResponse(CineEntity entity) {
        if (entity == null) {
            return null;
        }

        String ciudadNombre = entity.getCiudad() != null ? entity.getCiudad().getNombre() : null;

        return new CineResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getDireccion(),
                entity.getUrlImagen(),
                ciudadNombre
        );
    }
}
