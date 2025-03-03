import mongoose from "mongoose";

const { model, Schema } = mongoose;

const universidadSchema = new Schema(
  {
    nombre: { type: String, require: [true, "El campo nombre es requerido"] },
    direccion: {
      type: String,
      require: [true, "El campo direccion es requerido"],
    },
    ciudad: { type: String, require: [true, "El campo ciudad es requerido"] },
    pais: { type: String, require: [true, "El campo pais el requerido"] },
    telefono: {
      type: Number,
      require: [true, "El campo telefono es requerido"],
    },
    correo_electronico: {
      type: String,
      require: [true, "El campo correo electronico es requerido"],
    },
  },
  {
    timestamps: true,
  }
);

export const universidadModel = model("universidad", universidadSchema);
