CREATE DATABASE IF NOT EXISTS marcas_equipos
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
 
USE marcas_equipos;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE departamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  encargado VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(150) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(150) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  departamento_id INT,
  rol_id INT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id) ON DELETE RESTRICT,
  CONSTRAINT fk_usuarios_rol
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);
 
CREATE INDEX idx_usuarios_departamento ON usuarios(departamento_id);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);

CREATE TABLE dispositivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  identificador_unico VARCHAR(255) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  usuario_id INT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT fk_dispositivos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
 
CREATE INDEX idx_dispositivos_usuario ON dispositivos(usuario_id);

CREATE TABLE marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  tipo ENUM('ENTRADA', 'SALIDA') NOT NULL,
  ip VARCHAR(45) NOT NULL,
  dispositivo_id INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_marcas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_marcas_dispositivo
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE SET NULL
);

CREATE INDEX idx_marcas_usuario_fecha ON marcas(usuario_id, fecha);
CREATE INDEX idx_marcas_dispositivo ON marcas(dispositivo_id);

CREATE TABLE equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NOT NULL,
  imagen VARCHAR(255),
  estado ENUM('DISPONIBLE', 'PRESTADO', 'MANTENIMIENTO', 'INACTIVO') NOT NULL DEFAULT 'DISPONIBLE',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE INDEX idx_equipos_estado ON equipos(estado);

CREATE TABLE prestamos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  encargado_id INT NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('ACTIVO', 'FINALIZADO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT fk_prestamos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_prestamos_encargado
    FOREIGN KEY (encargado_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);
 
CREATE INDEX idx_prestamos_usuario ON prestamos(usuario_id);
CREATE INDEX idx_prestamos_estado ON prestamos(estado);

CREATE TABLE prestamo_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prestamo_id INT NOT NULL,
  equipo_id INT NOT NULL,
  estado_devolucion ENUM('PENDIENTE', 'DEVUELTO') NOT NULL DEFAULT 'PENDIENTE',
  fecha_devolucion DATETIME NULL,
  CONSTRAINT fk_detalle_prestamo
    FOREIGN KEY (prestamo_id) REFERENCES prestamos(id) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_equipo
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE RESTRICT,

  CONSTRAINT unique_prestamo_equipo UNIQUE (prestamo_id, equipo_id)
);
 
CREATE INDEX idx_detalle_equipo ON prestamo_detalle(equipo_id);

CREATE TABLE configuracion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(100) NOT NULL UNIQUE,
  valor VARCHAR(255) NOT NULL
);
 
CREATE TABLE tokens_recuperacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  fecha_expiracion DATETIME NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tokens_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
 
CREATE INDEX idx_tokens_usuario ON tokens_recuperacion(usuario_id);
 
INSERT INTO roles (nombre) VALUES
  ('usuario'),
  ('administrador');

INSERT INTO departamentos (nombre, descripcion, encargado) VALUES
  ('Administración', 'Departamento administrativo de la institución', 'Por definir');

INSERT INTO configuracion (clave, valor) VALUES
  ('nombre_institucion', 'Universidad Técnica Nacional'),
  ('rango_ip_permitido', '0.0.0.0/0'),
  ('tiempo_max_sesion_min', '60'),
  ('tamano_max_archivo_mb', '5');
 
INSERT INTO usuarios (nombre_completo, fecha_nacimiento, correo, username, password_hash, departamento_id, rol_id)
VALUES (
  'Administrador del Sistema',
  '2000-01-01',
  'admin@utn.ac.cr',
  'admin',
  '$2b$10$TrLrHgE06Idro9jHJ/wYs.ZmxA/skrQqmuQ7h0aqj62EXS4gipGJG',
  1,
  (SELECT id FROM roles WHERE nombre = 'administrador')
);