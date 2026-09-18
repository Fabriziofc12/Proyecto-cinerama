# 🎬 Cinerama Backend API

Este es el proyecto backend del sistema de gestión y venta de entradas "Cinerama", desarrollado con **Java 25**, **Spring Boot 4.1.1** y **PostgreSQL**.

## 🏗 Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas basada en dominio, aislada de la siguiente manera:

- **Capa de Persistencia (`persistence`)**: Contiene las entidades JPA (`entity`) estrictamente mapeadas al modelo de base de datos relacional, y los repositorios de Spring Data (`repository`) con queries optimizadas.
- **Capa de Transferencia (`dto`)**: Records inmutables de Java utilizados para tipar de manera estricta los JSONs de entrada (Requests) y salida (Responses) de la API, incluyendo validaciones de *Jakarta*.
- **Capa de Servicios (`service`)**: (*En desarrollo*) Orquesta las reglas de negocio, maneja la transaccionalidad (`@Transactional`) y contiene la lógica pesada del sistema.
- **Capa de Controladores (`controller`)**: (*En desarrollo*) Expone la funcionalidad mediante una API RESTful estándar hacia el cliente React.

## Requisitos Previos

- **Java Development Kit (JDK) 25**
- **Maven 3.8+**
- **PostgreSQL 14+**

## Configuración y Ejecución

1. Clonar el repositorio.
2. Asegurar que el servidor PostgreSQL esté corriendo localmente en el puerto `5432`.
3. Crear una base de datos llamada `cinerama_db`.
4. Ejecutar el script SQL inicial (`cinerama_bd.sql`) proveído en la raíz del proyecto para crear las tablas y relaciones. **El backend asume que la base de datos ya existe y no la modificará** (`ddl-auto=validate`).
5. Configurar credenciales: Las propiedades se encuentran en `src/main/resources/application.properties`. Por defecto, asume `username=postgres` y `password=admin`. 
6. Ejecutar el proyecto:
   ```bash
   ./mvnw spring-boot:run
   ```

## Reglas de Negocio Destacadas (Implementadas en BD y Repositorios)

- **Control de Concurrencia**: Las compras de asientos se manejan mediante Bloqueo Pesimista (Pessimistic Locking) a nivel base de datos para evitar que dos usuarios compren la misma butaca simultáneamente.
- **Detección de Traslape**: Las colisiones de horarios entre proyecciones (funciones) en una misma sala se detectan mediante queries nativas espaciales (intervalos) en la base de datos antes de impactar el horario.
- **Inmutabilidad Financiera**: Los detalles de reserva clonan y fijan el precio histórico del momento de compra, ignorando futuras variaciones en el precio base de la función.

## 🛠 Tecnologías Utilizadas

- **Spring Boot Web** (REST API)
- **Spring Data JPA** (Hibernate ORM)
- **PostgreSQL Driver**
- **Lombok** (Generación de código boilerplate de manera segura)
- **Jakarta Validation** (Validación semántica de DTOs)
