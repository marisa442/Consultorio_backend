// Migración única para bases de datos que ya existían antes del RBAC de 3
// roles (administrador/medico/paciente) y del inventario de medicamentos.
// Es idempotente: se puede correr varias veces sin romper nada.
//
// Uso: node scripts/migrar-rbac.js
import { sequelize } from "../db/conexion.js";

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado. Aplicando migración...");

    await sequelize.query(`
      ALTER TABLE usuarios
        ADD COLUMN IF NOT EXISTS paciente_id INTEGER,
        ADD COLUMN IF NOT EXISTS medico_id INTEGER;
    `);
    console.log("usuarios: paciente_id/medico_id listos.");

    await sequelize.query(`
      ALTER TABLE medicamentos
        ADD COLUMN IF NOT EXISTS precio NUMERIC(10, 2) NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS cantidad_disponible INTEGER NOT NULL DEFAULT 0;
    `);
    console.log("medicamentos: precio/cantidad_disponible listos.");

    // FKs solo si no existen ya (nombre fijo para poder detectarlas).
    const [[{ existe: fkPaciente }]] = await sequelize.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_usuarios_paciente'
      ) AS existe;
    `);
    if (!fkPaciente) {
      await sequelize.query(`
        ALTER TABLE usuarios
          ADD CONSTRAINT fk_usuarios_paciente
          FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log("FK fk_usuarios_paciente creada.");
    }

    const [[{ existe: fkMedico }]] = await sequelize.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_usuarios_medico'
      ) AS existe;
    `);
    if (!fkMedico) {
      await sequelize.query(`
        ALTER TABLE usuarios
          ADD CONSTRAINT fk_usuarios_medico
          FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE SET NULL ON UPDATE CASCADE;
      `);
      console.log("FK fk_usuarios_medico creada.");
    }

    // Roles heredados del esquema viejo (UsuarioModel.rol default "admin").
    const [resultado] = await sequelize.query(`
      UPDATE usuarios SET rol = 'administrador' WHERE rol = 'admin' RETURNING id, email;
    `);
    if (resultado.length) {
      console.log(
        `Roles migrados de "admin" a "administrador": ${resultado.map((u) => u.email).join(", ")}`
      );
    }

    console.log("Migración completada.");
    process.exit(0);
  } catch (error) {
    console.error("Error ejecutando la migración:", error);
    process.exit(1);
  }
};

run();
