package com.project.cinerama.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "asientos",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_asiento_sala",
            columnNames = {"sala_id", "fila", "numero_asiento"}
        )
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;

    @Column(nullable = false, length = 5)
    private String fila;

    @Column(name = "numero_asiento", nullable = false)
    private Integer numeroAsiento;
}