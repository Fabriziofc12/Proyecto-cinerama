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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id", nullable = false)
    private SalaEntity sala;

    @Column(nullable = false, length = 5)
    private String fila;

    @Column(name = "numero_asiento", nullable = false)
    private Integer numeroAsiento;
}
