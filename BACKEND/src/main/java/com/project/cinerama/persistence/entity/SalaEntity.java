package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "asientos") // Evita StackOverflowError en relaciones bidireccionales
public class SalaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cine_id", nullable = false)
    private CineEntity cine;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "total_asientos", nullable = false)
    private Integer totalAsientos;

    /**
     * Relación inversa necesaria para RN-04: generación automática de asientos
     * al crear una sala. El Service iterará esta colección para poblar/validar asientos.
     */
    @OneToMany(mappedBy = "sala", fetch = FetchType.LAZY)
    @Builder.Default
    private List<AsientoEntity> asientos = new ArrayList<>();
}
