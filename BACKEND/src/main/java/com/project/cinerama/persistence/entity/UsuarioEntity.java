package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Mapea la tabla "usuarios".
 *
 * RNF-01: El campo contrasenaHash NUNCA se puebla con texto plano.
 * El Service (UsuarioService) es responsable de aplicar BCrypt
 * antes de llamar a repository.save().
 *
 * RF-10: usuario_id en reservas puede ser NULL (compra como invitado),
 * por eso la relación OneToMany aquí es opcional.
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "reservas")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    /**
     * UNIQUE en la BD: un correo no puede repetirse.
     * El UsuarioRepository tendrá un finder por correo para login.
     */
    @Column(name = "correo_electronico", nullable = false, unique = true, length = 150)
    private String correoElectronico;

    /**
     * RNF-01: Solo se almacena el hash (BCrypt). Nunca la contraseña en claro.
     * La longitud 255 es suficiente para cualquier hash BCrypt ($2a$...).
     */
    @Column(name = "contrasena_hash", nullable = false, length = 255)
    private String contrasenaHash;

    /**
     * DEFAULT now() en la BD. Se puede omitir en el INSERT y la BD lo auto-completa.
     * @Column(insertable = false) le dice a Hibernate que NO incluya este campo
     * en el INSERT, dejando que el default de PostgreSQL actúe.
     */
    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.LAZY)
    @Builder.Default
    private List<ReservaEntity> reservas = new ArrayList<>();
}
