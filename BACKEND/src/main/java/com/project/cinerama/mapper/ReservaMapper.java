package com.project.cinerama.mapper;

import com.project.cinerama.dto.response.DetalleReservaResponse;
import com.project.cinerama.dto.response.ReservaResponse;
import com.project.cinerama.persistence.entity.DetalleReservaEntity;
import com.project.cinerama.persistence.entity.FuncionEntity;
import com.project.cinerama.persistence.entity.ReservaEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReservaMapper {

    public ReservaResponse toResponse(ReservaEntity entity) {
        if (entity == null) {
            return null;
        }

        Integer usuarioId = entity.getUsuario() != null ? entity.getUsuario().getId() : null;
        String usuarioNombre = entity.getUsuario() != null ? entity.getUsuario().getNombreCompleto() : null;

        FuncionEntity funcion = entity.getFuncion();
        Integer funcionId = funcion != null ? funcion.getId() : null;
        String peliculaTitulo = (funcion != null && funcion.getPelicula() != null) ? funcion.getPelicula().getTitulo() : null;
        var fechaHoraFuncion = funcion != null ? funcion.getFechaHoraInicio() : null;
        String salaNombre = (funcion != null && funcion.getSala() != null) ? funcion.getSala().getNombre() : null;
        String cineNombre = (funcion != null && funcion.getSala() != null && funcion.getSala().getCine() != null)
                ? funcion.getSala().getCine().getNombre() : null;
        String formato = (funcion != null && funcion.getFormato() != null) ? funcion.getFormato().getNombre() : null;
        String idioma = (funcion != null && funcion.getIdioma() != null) ? funcion.getIdioma().getNombre() : null;

        List<DetalleReservaResponse> detalles = entity.getDetalles() != null
                ? entity.getDetalles().stream().map(this::toDetalleResponse).collect(Collectors.toList())
                : Collections.emptyList();

        return new ReservaResponse(
                entity.getId(),
                entity.getEstado() != null ? entity.getEstado().name() : null,
                entity.getMontoTotal(),
                entity.getFechaCreacion(),
                usuarioId,
                usuarioNombre,
                funcionId,
                peliculaTitulo,
                fechaHoraFuncion,
                salaNombre,
                cineNombre,
                formato,
                idioma,
                detalles
        );
    }

    public DetalleReservaResponse toDetalleResponse(DetalleReservaEntity detalle) {
        if (detalle == null) {
            return null;
        }

        Integer asientoId = detalle.getAsiento() != null ? detalle.getAsiento().getId() : null;
        String fila = detalle.getAsiento() != null ? detalle.getAsiento().getFila() : null;
        Integer numeroAsiento = detalle.getAsiento() != null ? detalle.getAsiento().getNumeroAsiento() : null;

        return new DetalleReservaResponse(
                detalle.getId(),
                asientoId,
                fila,
                numeroAsiento,
                detalle.getPrecioUnitario()
        );
    }
}
