import mongoose from "mongoose";
const { model, Schema } = mongoose;

const notaSchema = new Schema(
  {
    alumno: { type: Schema.Types.ObjectId, ref: "alumno" },
    curso: { type: Schema.Types.ObjectId, ref: "curso" },
    nota: { type: Number, require: [true, "El campo nota es requerido"] },
  },
  {
    timestamps: true,
  }
);

export const notaModel = model("nota", notaSchema);
