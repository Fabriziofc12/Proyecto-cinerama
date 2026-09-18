package com.project.cinerama.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

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
