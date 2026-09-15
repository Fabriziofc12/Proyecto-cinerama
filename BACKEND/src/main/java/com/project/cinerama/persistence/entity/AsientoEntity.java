package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "asientos",
    uniqueConstraints = @UniqueConstraint(columnNames = {"sala_id", "fila", "numero_asiento"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class AsientoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    /**
     * FK → salas.id
     * Según RN-04, los asientos se generan automáticamente al crear la sala.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id", nullable = false)
    private SalaEntity sala;

    /**
     * Fila del asiento (ej: "A", "B", "C"). varchar(5) en la BD.
     */
    @Column(nullable = false, length = 5)
    private String fila;

    /**
     * Número de asiento dentro de la fila (ej: 1, 2, 3...).
     */
    @Column(name = "numero_asiento", nullable = false)
    private Integer numeroAsiento;
}
