package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Mapea la tabla "reservas".
 *
 * RNF-02: La creación de esta entidad y sus DetalleReservaEntity hijos
 * debe ocurrir dentro de una única transacción @Transactional en el Service.
 * Si falla al guardar cualquier detalle, el rollback revierte toda la reserva.
 *
 * RN-03: monto_total debe ser igual a la suma de precio_unitario de sus detalles.
 * Esta invariante se calcula y valida en el Service antes de persistir.
 */
@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"usuario", "funcion", "detalles"})
public class ReservaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    /**
     * FK → usuarios.id (NULLABLE).
     * Si es null, la compra fue hecha como invitado (RF-10).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = true)
    private UsuarioEntity usuario;

    /**
     * FK → funciones.id (NOT NULL).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "funcion_id", nullable = false)
    private FuncionEntity funcion;

    /**
     * RN-03: El Service calcula este valor como suma de los precio_unitario
     * de los detalles antes de persistir. Nunca se recibe desde el cliente.
     */
    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    /**
     * Estado tipado con Enum → se almacena como String en la BD.
     * EnumType.STRING es obligatorio; EnumType.ORDINAL es frágil si se reordena el enum.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservaEstado estado;

    /**
     * DEFAULT now() en la BD. insertable=false → Hibernate no envía este campo en el INSERT.
     */
    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    /**
     * CascadeType.ALL + orphanRemoval: si se elimina la Reserva, se eliminan sus detalles.
     * Esto también permite guardar la reserva con sus detalles en una sola llamada (RNF-02).
     */
    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<DetalleReservaEntity> detalles = new ArrayList<>();
}
