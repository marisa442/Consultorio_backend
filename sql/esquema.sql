-- =====================================================================
-- Sistema Medico Universitario - Esquema de base de datos (PostgreSQL)
-- Compatible con Supabase. Corresponde 1:1 a los modelos Sequelize del
-- backend (apiBaseWithNode/models). No es obligatorio ejecutarlo: si lo
-- omites, Sequelize crea las mismas tablas automaticamente al levantar
-- el servidor (sequelize.sync). Se entrega para el SQL Editor de
-- Supabase / documentacion del modelo de datos.
-- =====================================================================

-- Para volver a ejecutar el script desde cero, descomenta este bloque:
-- DROP TABLE IF EXISTS examenes_solicitados CASCADE;
-- DROP TABLE IF EXISTS detalle_recetas CASCADE;
-- DROP TABLE IF EXISTS consultas CASCADE;
-- DROP TABLE IF EXISTS citas CASCADE;
-- DROP TABLE IF EXISTS medicos CASCADE;
-- DROP TABLE IF EXISTS pacientes CASCADE;
-- DROP TABLE IF EXISTS examenes CASCADE;
-- DROP TABLE IF EXISTS medicamentos CASCADE;
-- DROP TABLE IF EXISTS especialidades CASCADE;
-- DROP TABLE IF EXISTS usuarios CASCADE;

-- ---------------------------------------------------------------------
-- usuarios: cuentas de acceso al sistema (administrador, medico o paciente).
-- paciente_id/medico_id vinculan la cuenta con su registro de dominio cuando
-- el rol no es administrador (se completan despues de crear esas filas, ver
-- ALTER TABLE mas abajo para evitar referencias circulares en la creacion).
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    rol             VARCHAR(20) NOT NULL DEFAULT 'paciente'
                    CHECK (rol IN ('administrador', 'medico', 'paciente')),
    paciente_id     INTEGER,
    medico_id       INTEGER,
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- especialidades: catalogo de especialidades medicas
-- ---------------------------------------------------------------------
CREATE TABLE especialidades (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(255) NOT NULL UNIQUE,
    descripcion     TEXT,
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- medicamentos: catalogo de medicamentos + inventario de farmacia
-- (estado: true = disponible, false = no disponible)
-- ---------------------------------------------------------------------
CREATE TABLE medicamentos (
    id                      SERIAL PRIMARY KEY,
    codigo                  VARCHAR(255) NOT NULL UNIQUE,
    nombre                  VARCHAR(255) NOT NULL,
    presentacion            VARCHAR(255),
    concentracion           VARCHAR(255),
    descripcion             TEXT,
    precio                  NUMERIC(10, 2) NOT NULL DEFAULT 0,
    cantidad_disponible     INTEGER NOT NULL DEFAULT 0,
    estado                  BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- examenes: catalogo de examenes medicos
-- ---------------------------------------------------------------------
CREATE TABLE examenes (
    id              SERIAL PRIMARY KEY,
    codigo          VARCHAR(255) NOT NULL UNIQUE,
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT,
    costo           NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estado          BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- pacientes
-- ---------------------------------------------------------------------
CREATE TABLE pacientes (
    id                      SERIAL PRIMARY KEY,
    numero_identificacion   VARCHAR(255) NOT NULL UNIQUE,
    nombres                 VARCHAR(255) NOT NULL,
    apellidos               VARCHAR(255) NOT NULL,
    fecha_nacimiento        DATE NOT NULL,
    sexo                    VARCHAR(1) NOT NULL
                            CHECK (sexo IN ('M', 'F')),
    correo_electronico      VARCHAR(255) NOT NULL UNIQUE,
    telefono                VARCHAR(255),
    direccion               VARCHAR(255),
    tipo_paciente           VARCHAR(20) NOT NULL
                            CHECK (tipo_paciente IN ('estudiante', 'docente', 'administrativo')),
    estado                  BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- medicos: cada medico pertenece a una unica especialidad
-- ---------------------------------------------------------------------
CREATE TABLE medicos (
    id                      SERIAL PRIMARY KEY,
    numero_identificacion   VARCHAR(255) NOT NULL UNIQUE,
    nombres                 VARCHAR(255) NOT NULL,
    apellidos               VARCHAR(255) NOT NULL,
    correo_electronico      VARCHAR(255) NOT NULL UNIQUE,
    telefono                VARCHAR(255),
    numero_licencia         VARCHAR(255) NOT NULL UNIQUE,
    especialidad_id         INTEGER NOT NULL
                            REFERENCES especialidades(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    estado                  BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medicos_especialidad_id ON medicos(especialidad_id);

-- Ahora que pacientes/medicos ya existen, se completan las FK de usuarios.
ALTER TABLE usuarios
    ADD CONSTRAINT fk_usuarios_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_usuarios_medico
        FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX idx_usuarios_paciente_id ON usuarios(paciente_id);
CREATE INDEX idx_usuarios_medico_id ON usuarios(medico_id);

-- ---------------------------------------------------------------------
-- citas: un paciente solicita una cita, atendida por un medico
-- ---------------------------------------------------------------------
CREATE TABLE citas (
    id                      SERIAL PRIMARY KEY,
    paciente_id             INTEGER NOT NULL
                            REFERENCES pacientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    medico_id               INTEGER NOT NULL
                            REFERENCES medicos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    fecha_solicitud         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_hora_atencion     TIMESTAMPTZ NOT NULL,
    modalidad               VARCHAR(20) NOT NULL
                            CHECK (modalidad IN ('presencial', 'virtual')),
    motivo_consulta         TEXT NOT NULL,
    estado                  VARCHAR(20) NOT NULL DEFAULT 'solicitada'
                            CHECK (estado IN ('solicitada', 'confirmada', 'atendida', 'cancelada', 'no_asistida')),
    "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citas_paciente_id ON citas(paciente_id);
CREATE INDEX idx_citas_medico_id ON citas(medico_id);
CREATE INDEX idx_citas_estado ON citas(estado);

-- ---------------------------------------------------------------------
-- consultas: maximo una consulta por cita (cita_id UNIQUE)
-- ---------------------------------------------------------------------
CREATE TABLE consultas (
    id                  SERIAL PRIMARY KEY,
    cita_id             INTEGER NOT NULL UNIQUE
                        REFERENCES citas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    diagnostico         TEXT NOT NULL,
    sintomas            TEXT,
    observaciones       TEXT,
    recomendaciones     TEXT,
    fecha_atencion      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- detalle_recetas: resuelve la relacion N:M Consulta <-> Medicamento
-- ---------------------------------------------------------------------
CREATE TABLE detalle_recetas (
    id                      SERIAL PRIMARY KEY,
    consulta_id             INTEGER NOT NULL
                            REFERENCES consultas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    medicamento_id          INTEGER NOT NULL
                            REFERENCES medicamentos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    dosis                   VARCHAR(255) NOT NULL,
    frecuencia              VARCHAR(255) NOT NULL,
    duracion_tratamiento    VARCHAR(255) NOT NULL,
    indicaciones            TEXT,
    "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_detalle_recetas_consulta_id ON detalle_recetas(consulta_id);
CREATE INDEX idx_detalle_recetas_medicamento_id ON detalle_recetas(medicamento_id);

-- ---------------------------------------------------------------------
-- examenes_solicitados: resuelve la relacion N:M Consulta <-> Examen
-- ---------------------------------------------------------------------
CREATE TABLE examenes_solicitados (
    id                  SERIAL PRIMARY KEY,
    consulta_id         INTEGER NOT NULL
                        REFERENCES consultas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    examen_id           INTEGER NOT NULL
                        REFERENCES examenes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    fecha_solicitud     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resultado           TEXT,
    fecha_resultado     TIMESTAMPTZ,
    estado              VARCHAR(20) NOT NULL DEFAULT 'solicitado'
                        CHECK (estado IN ('solicitado', 'realizado', 'entregado', 'cancelado')),
    "createdAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_examenes_solicitados_consulta_id ON examenes_solicitados(consulta_id);
CREATE INDEX idx_examenes_solicitados_examen_id ON examenes_solicitados(examen_id);

-- =====================================================================
-- Datos iniciales (equivalentes a apiBaseWithNode/seed/seed.js)
-- Recomendado: corre "npm run seed" en vez de este bloque, genera los
-- hashes de contrasena en el momento. Este INSERT se deja solo como
-- referencia rapida para el SQL Editor de Supabase.
-- =====================================================================
INSERT INTO especialidades (nombre, descripcion) VALUES
    ('Medicina General', 'Atencion medica general'),
    ('Odontologia', 'Atencion dental'),
    ('Psicologia', 'Atencion psicologica'),
    ('Nutricion', 'Atencion nutricional'),
    ('Fisioterapia', 'Atencion fisioterapeutica')
ON CONFLICT (nombre) DO NOTHING;

-- Usuario admin: admin@espam.edu.ec / EspamAdmin#26
-- El hash de abajo fue generado con bcrypt (10 rounds) y verificado localmente.
INSERT INTO usuarios (nombre, email, password, rol) VALUES
    ('Administrador', 'admin@espam.edu.ec', '$2b$10$cjIgdthk53loACMUm857BenouEeSA75XDuBA4VVfUZHiMayUpfXL.', 'administrador')
ON CONFLICT (email) DO NOTHING;

-- Medico: e.vera@espam.edu.ec / EVera#Med26
INSERT INTO medicos (numero_identificacion, nombres, apellidos, correo_electronico, telefono, numero_licencia, especialidad_id)
SELECT '1300000001', 'Elena', 'Vera', 'e.vera@espam.edu.ec', '0990000001', 'LIC-0001', id
FROM especialidades WHERE nombre = 'Medicina General'
ON CONFLICT (correo_electronico) DO NOTHING;

INSERT INTO usuarios (nombre, email, password, rol, medico_id)
SELECT 'Elena Vera', 'e.vera@espam.edu.ec', '$2b$10$u2x9tZrYCUFeToYMt0AkHOgPQZi9u1nPJoeXOkpthHJ499duw34VC', 'medico', id
FROM medicos WHERE correo_electronico = 'e.vera@espam.edu.ec'
ON CONFLICT (email) DO NOTHING;

-- Paciente: c.zambrano@espam.edu.ec / CZambrano#26
INSERT INTO pacientes (numero_identificacion, nombres, apellidos, fecha_nacimiento, sexo, correo_electronico, telefono, direccion, tipo_paciente)
VALUES ('1300000002', 'Carlos', 'Zambrano', '2001-05-14', 'M', 'c.zambrano@espam.edu.ec', '0990000002', 'Campus ESPAM, Calceta', 'estudiante')
ON CONFLICT (correo_electronico) DO NOTHING;

INSERT INTO usuarios (nombre, email, password, rol, paciente_id)
SELECT 'Carlos Zambrano', 'c.zambrano@espam.edu.ec', '$2b$10$osp.SOqaeV9PsxqkFB9IG.9VR6yrKiGhqgnzuHTAYWDBJIMqm5Jei', 'paciente', id
FROM pacientes WHERE correo_electronico = 'c.zambrano@espam.edu.ec'
ON CONFLICT (email) DO NOTHING;
