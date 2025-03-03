import mongoose from "mongoose";
const { model, Schema } = mongoose;

const alumnoSchema = new Schema(
  {
    nombre: { type: String, require: [true, "El campo nombre es requerido"] },
    apellido: {
      type: String,
      require: [true, "El campo apellido es requerido"],
    },
    correo_electronico: {
      type: String,
      require: [true, "El campo correo electronico es requerido"],
    },
    telefono: {
      type: String,
      require: [true, "El campo telefono es requerido"],
    },
    identificacion: {
      type: Number,
      require: [true, "El campo identificacion es requerido"],
    },
    universidad: { type: Schema.Types.ObjectId, ref: "universidad" },
  },
  {
    timestamps: true,
  }
);

export const alumnoModel = model("alumno", alumnoSchema);