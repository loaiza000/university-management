import mongoose from "mongoose";
const { model, Schema } = mongoose;

const cursoSchema = new Schema(
  {
    nombre: { type: String, require: [true, "El campo nombre es requerido"] },
    descripcio: {
      type: String,
      require: [true, "El campo descripcion es requerido"],
    },
    profesor: { type: Schema.Types.ObjectId, ref: "profesor" },
    alumnos: [{ type: Schema.Types.ObjectId, ref: "alumno" }],
    universidad: { type: Schema.Types.ObjectId, ref: "universidad" },
  },
  {
    timestamps: true,
  }
);

export const cursoModel = model("curso", cursoSchema);
