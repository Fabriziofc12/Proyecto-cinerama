package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.SalaResponse;
import com.project.cinerama.persistence.entity.SalaEntity;
import org.springframework.stereotype.Component;

@Component
public class SalaMapper {

    public SalaResponse toResponse(SalaEntity entity) {
        if (entity == null) {
            return null;
        }

        Integer cineId = entity.getCine() != null ? entity.getCine().getId() : null;
        String cineNombre = entity.getCine() != null ? entity.getCine().getNombre() : null;

        return new SalaResponse(
                entity.getId(),
                entity.getNombre(),
                entity.getTotalAsientos(),
                cineId,
                cineNombre
        );
    }
}
