package com.project.cinerama.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para registrar un nuevo usuario.
 *
 * RNF-01: El campo 'contrasena' llega aquí en texto plano.
 * El UsuarioService aplicará BCrypt ANTES de crear la entidad.
 * La entidad UsuarioEntity.contrasenaHash NUNCA recibe este valor directo.
 */
public record UsuarioRequest(

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    String nombreCompleto,

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico no tiene un formato válido")
    @Size(max = 150, message = "El correo no puede superar los 150 caracteres")
    String correoElectronico,

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    String contrasena  // texto plano → el Service hashea antes de persistir

) {}
