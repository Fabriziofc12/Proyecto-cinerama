package com.project.cinerama.service;

import com.project.cinerama.dto.request.UsuarioRequest;
import com.project.cinerama.dto.response.UsuarioResponse;
import com.project.cinerama.exception.BusinessRuleException;
import com.project.cinerama.exception.ResourceNotFoundException;
import com.project.cinerama.mapper.UsuarioMapper;
import com.project.cinerama.persistence.entity.UsuarioEntity;
import com.project.cinerama.persistence.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper usuarioMapper;

    @Transactional(readOnly = true)
    public List<UsuarioResponse> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Integer id) {
        UsuarioEntity usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return usuarioMapper.toResponse(usuario);
    }

    /**
     * Registrar usuario con hashing BCrypt de la contraseña.
     */
    @Transactional
    public UsuarioResponse registrar(UsuarioRequest request) {
        if (usuarioRepository.existsByCorreoElectronico(request.correoElectronico())) {
            throw new BusinessRuleException("El correo electrónico ya se encuentra registrado.");
        }

        // Hashear la contraseña en texto plano antes de guardar
        String contrasenaHasheada = passwordEncoder.encode(request.contrasena());

        UsuarioEntity usuario = UsuarioEntity.builder()
                .nombreCompleto(request.nombreCompleto())
                .correoElectronico(request.correoElectronico())
                .contrasenaHash(contrasenaHasheada)
                .build();

        UsuarioEntity guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toResponse(guardado);
    }
}
