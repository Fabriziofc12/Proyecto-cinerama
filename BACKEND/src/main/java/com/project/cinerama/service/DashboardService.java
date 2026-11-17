package com.project.cinerama.service;

import com.project.cinerama.dto.response.IngresosPorCineResponse;
import com.project.cinerama.persistence.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ReservaRepository reservaRepository;

    @Transactional(readOnly = true)
    public List<IngresosPorCineResponse> obtenerIngresosPorCine() {
        List<Object[]> resultados = reservaRepository.findIngresosPorCine();

        return resultados.stream()
                .map(fila -> new IngresosPorCineResponse(
                        (String) fila[0],
                        (BigDecimal) fila[1]
                ))
                .collect(Collectors.toList());
    }
}
