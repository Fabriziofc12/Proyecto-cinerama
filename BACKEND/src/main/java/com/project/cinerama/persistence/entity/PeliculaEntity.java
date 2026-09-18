package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "peliculas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"generos", "idiomas", "formatos"})
public class PeliculaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String sinopsis;

    @Column(name = "duracion_minutos", nullable = false)
    private Integer duracionMinutos;

    @Column(nullable = false, length = 20)
    private String clasificacion;

    @Column(name = "url_poster", columnDefinition = "TEXT")
    private String urlPoster;

    @Column(name = "url_banner", columnDefinition = "TEXT")
    private String urlBanner;

    @Column(name = "url_trailer", columnDefinition = "TEXT")
    private String urlTrailer;

    @Column(name = "es_estreno")
    @Builder.Default
    private Boolean esEstreno = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "pelicula_generos",
        joinColumns        = @JoinColumn(name = "pelicula_id"),
        inverseJoinColumns = @JoinColumn(name = "genero_id")
    )
    @Builder.Default
    private Set<GeneroEntity> generos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "pelicula_idiomas",
        joinColumns        = @JoinColumn(name = "pelicula_id"),
        inverseJoinColumns = @JoinColumn(name = "idioma_id")
    )
    @Builder.Default
    private Set<IdiomaEntity> idiomas = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "pelicula_formatos",
        joinColumns        = @JoinColumn(name = "pelicula_id"),
        inverseJoinColumns = @JoinColumn(name = "formato_id")
    )
    @Builder.Default
    private Set<FormatoEntity> formatos = new HashSet<>();
}
