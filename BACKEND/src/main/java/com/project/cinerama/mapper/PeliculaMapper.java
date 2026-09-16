package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.PeliculaResponse;
import com.project.cinerama.persistence.entity.FormatoEntity;
import com.project.cinerama.persistence.entity.GeneroEntity;
import com.project.cinerama.persistence.entity.IdiomaEntity;
import com.project.cinerama.persistence.entity.PeliculaEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class PeliculaMapper {

    public PeliculaResponse toResponse(PeliculaEntity entity) {
        if (entity == null) {
            return null;
        }

        Set<String> generos = entity.getGeneros() != null ?
                entity.getGeneros().stream().map(GeneroEntity::getNombre).collect(Collectors.toSet()) : Collections.emptySet();

        Set<String> idiomas = entity.getIdiomas() != null ?
                entity.getIdiomas().stream().map(IdiomaEntity::getNombre).collect(Collectors.toSet()) : Collections.emptySet();

        Set<String> formatos = entity.getFormatos() != null ?
                entity.getFormatos().stream().map(FormatoEntity::getNombre).collect(Collectors.toSet()) : Collections.emptySet();

        return new PeliculaResponse(
                entity.getId(),
                entity.getTitulo(),
                entity.getSinopsis(),
                entity.getDuracionMinutos(),
                entity.getClasificacion(),
                entity.getUrlPoster(),
                entity.getUrlBanner(),
                entity.getUrlTrailer(),
                entity.getEsEstreno(),
                generos,
                idiomas,
                formatos
        );
    }
}
