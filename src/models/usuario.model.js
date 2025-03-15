import mongoose from "mongoose";

const { model, Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "El campo email es requerido"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "El campo password en requerido"],
    },
    nombreUsuario: {
      type: String,
      required: [true, "El campo nombre de usuario es requerido"],
    },
    token: { type: String },
    activo: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const usuarioModel = model("usuario", usuarioSchema);
