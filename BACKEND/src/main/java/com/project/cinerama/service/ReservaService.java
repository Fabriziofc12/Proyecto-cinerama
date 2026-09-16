package com.project.cinerama.service;

import com.project.cinerama.dto.request.ReservaRequest;
import com.project.cinerama.dto.response.ReservaResponse;
import com.project.cinerama.exception.BusinessRuleException;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.ReservaMapper;
import com.project.cinerama.persistence.entity.*;
import com.project.cinerama.persistence.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final DetalleReservaRepository detalleReservaRepository;
    private final FuncionRepository funcionRepository;
    private final AsientoRepository asientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaMapper reservaMapper;

    @Transactional(readOnly = true)
    public List<ReservaResponse> obtenerPorUsuario(Integer usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId).stream()
                .map(reservaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservaResponse obtenerPorId(Integer id) {
        ReservaEntity reserva = reservaRepository.findByIdConDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con ID: " + id));
        return reservaMapper.toResponse(reserva);
    }

    /**
     * Creación Transaccional de Reservas con Bloqueo Pesimista (PESSIMISTIC_WRITE).
     */
    @Transactional
    public ReservaResponse crearReserva(ReservaRequest request) {
        // 1. Cargar la función
        FuncionEntity funcion = funcionRepository.findById(request.funcionId())
                .orElseThrow(() -> new ResourceNotFoundException("Función no encontrada con ID: " + request.funcionId()));

        // 2. Verificar disponibilidad con BLOQUEO PESIMISTA (SELECT ... FOR UPDATE)
        List<DetalleReservaEntity> asientosOcupados = detalleReservaRepository.findAsientosOcupadosEnFuncionConLock(
                request.funcionId(),
                request.asientoIds()
        );

        if (!asientosOcupados.isEmpty()) {
            throw new BusinessRuleException("Uno o más de los asientos seleccionados ya no se encuentran disponibles para esta función.");
        }

        // 3. Resolver usuario opcional (NULL si es compra como invitado - RF-10)
        UsuarioEntity usuario = null;
        if (request.usuarioId() != null) {
            usuario = usuarioRepository.findById(request.usuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + request.usuarioId()));
        }

        // 4. Calcular monto total (cantidad de asientos × precio de la función)
        BigDecimal precioEntrada = funcion.getPrecioEntrada();
        BigDecimal montoTotal = precioEntrada.multiply(BigDecimal.valueOf(request.asientoIds().size()));

        ReservaEntity reserva = ReservaEntity.builder()
                .funcion(funcion)
                .usuario(usuario)
                .montoTotal(montoTotal)
                .estado(ReservaEstado.CONFIRMADA)
                .build();

        // 5. Copiar precio histórico a cada detalle de la reserva
        for (Integer asientoId : request.asientoIds()) {
            AsientoEntity asiento = asientoRepository.findById(asientoId)
                    .orElseThrow(() -> new ResourceNotFoundException("Asiento no encontrado con ID: " + asientoId));

            // Validar que el asiento pertenezca a la sala de la función
            if (!asiento.getSala().getId().equals(funcion.getSala().getId())) {
                throw new BusinessRuleException("El asiento ID " + asientoId + " no pertenece a la sala de esta función.");
            }

            DetalleReservaEntity detalle = DetalleReservaEntity.builder()
                    .reserva(reserva)
                    .asiento(asiento)
                    .precioUnitario(precioEntrada)
                    .build();

            reserva.getDetalles().add(detalle);
        }

        // 6. Persistir en bloque con CascadeType.ALL
        ReservaEntity guardada = reservaRepository.save(reserva);

        // Retornar detalle completo cargado
        return reservaRepository.findByIdConDetalles(guardada.getId())
                .map(reservaMapper::toResponse)
                .orElse(reservaMapper.toResponse(guardada));
    }
}
