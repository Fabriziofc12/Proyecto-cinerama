package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "salas") // Evita StackOverflowError en relaciones bidireccionales
public class CineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ciudad_id", nullable = false)
    private CiudadEntity ciudad;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "url_imagen", columnDefinition = "TEXT")
    private String urlImagen;

    @OneToMany(mappedBy = "cine", fetch = FetchType.LAZY)
    @Builder.Default // Evita NullPointerException cuando se usa el builder de Lombok
    private List<SalaEntity> salas = new ArrayList<>();
}
