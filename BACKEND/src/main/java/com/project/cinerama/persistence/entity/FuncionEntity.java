package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Mapea la tabla "funciones".
 *
 * NOTA SOBRE fecha_hora_inicio:
 * El DDL declara el tipo como "datetime", que en PostgreSQL se interpreta
 * como "timestamp without time zone". LocalDateTime es el mapeo correcto
 * en Java para este tipo (sin información de zona horaria).
 */
@Entity
@Table(name = "funciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"pelicula", "sala", "formato", "idioma"})
public class FuncionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    /**
     * FK → peliculas.id
     * FetchType.LAZY: no cargar la película completa con cada función.
     * El Service decide cuándo hacer JOIN FETCH explícito.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pelicula_id", nullable = false)
    private PeliculaEntity pelicula;

    /**
     * FK → salas.id
     * Clave para la validación de traslape de horarios (RN-01).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id", nullable = false)
    private SalaEntity sala;

    /**
     * FK → formatos.id
     * RN-06: el precio y formato se define a nivel de función.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formato_id", nullable = false)
    private FormatoEntity formato;

    /**
     * FK → idiomas.id
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idioma_id", nullable = false)
    private IdiomaEntity idioma;

    /**
     * Fecha y hora de inicio de la función.
     * Mapeado a timestamp de PostgreSQL mediante LocalDateTime.
     */
    @Column(name = "fecha_hora_inicio", nullable = false)
    private LocalDateTime fechaHoraInicio;

    /**
     * Precio base de la entrada para esta función específica (RN-06).
     * precision=10, scale=2 → ej: 99999999.99
     */
    @Column(name = "precio_entrada", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioEntrada;
}
