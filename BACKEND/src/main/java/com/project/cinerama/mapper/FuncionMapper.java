package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.FuncionResponse;
import com.project.cinerama.persistence.entity.FuncionEntity;
import org.springframework.stereotype.Component;

@Component
public class FuncionMapper {

    public FuncionResponse toResponse(FuncionEntity entity) {
        if (entity == null) {
            return null;
        }

        Integer peliculaId = entity.getPelicula() != null ? entity.getPelicula().getId() : null;
        String peliculaTitulo = entity.getPelicula() != null ? entity.getPelicula().getTitulo() : null;
        Integer duracionMinutos = entity.getPelicula() != null ? entity.getPelicula().getDuracionMinutos() : null;

        Integer salaId = entity.getSala() != null ? entity.getSala().getId() : null;
        String salaNombre = entity.getSala() != null ? entity.getSala().getNombre() : null;

        Integer cineId = (entity.getSala() != null && entity.getSala().getCine() != null) ? entity.getSala().getCine().getId() : null;
        String cineNombre = (entity.getSala() != null && entity.getSala().getCine() != null) ? entity.getSala().getCine().getNombre() : null;

        String ciudadNombre = (entity.getSala() != null && entity.getSala().getCine() != null && entity.getSala().getCine().getCiudad() != null)
                ? entity.getSala().getCine().getCiudad().getNombre() : null;

        String formato = entity.getFormato() != null ? entity.getFormato().getNombre() : null;
        String idioma = entity.getIdioma() != null ? entity.getIdioma().getNombre() : null;

        return new FuncionResponse(
                entity.getId(),
                peliculaId,
                peliculaTitulo,
                duracionMinutos,
                salaId,
                salaNombre,
                cineId,
                cineNombre,
                ciudadNombre,
                formato,
                idioma,
                entity.getFechaHoraInicio(),
                entity.getPrecioEntrada()
        );
    }
}
