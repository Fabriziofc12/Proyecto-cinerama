package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Mapea la tabla "detalle_reservas".
 *
 * RN-02: Un asiento específico en una función específica SOLO puede
 * reservarse una vez. La protección ocurre en dos niveles:
 *
 *   1. Nivel de aplicación: el Service usa un query con PESSIMISTIC_WRITE
 *      en el DetalleReservaRepository para bloquear filas durante la transacción
 *      y evitar condiciones de carrera entre hilos concurrentes.
 *
 *   2. Nivel de BD (último recurso): el índice UNIQUE en (reserva_id, asiento_id)
 *      lanzará una excepción si dos transacciones logran pasar el control de aplicación.
 *      La BD también debería tener un índice UNIQUE en (funcion_id_via_reserva, asiento_id)
 *      — ver nota en DetalleReservaRepository.
 *
 * RN-03: precio_unitario aquí debe coincidir con el precio_entrada de la función.
 *        El Service lo copia desde FuncionEntity.precioEntrada al crear el detalle.
 */
@Entity
@Table(
    name = "detalle_reservas",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_detalle_reserva_asiento",
        columnNames = {"reserva_id", "asiento_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"reserva", "asiento"})
public class DetalleReservaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    /**
     * FK → reservas.id
     * La relación inversa (ReservaEntity.detalles) usa CascadeType.ALL,
     * por lo que Hibernate gestionará el ciclo de vida de este objeto.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    private ReservaEntity reserva;

    /**
     * FK → asientos.id
     * Este es el asiento físico que se está reservando.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asiento_id", nullable = false)
    private AsientoEntity asiento;

    /**
     * RN-03: Precio al momento de la compra.
     * Se copia desde FuncionEntity.precioEntrada en el Service para
     * preservar el precio histórico (aunque la función cambie de precio).
     */
    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;
}
