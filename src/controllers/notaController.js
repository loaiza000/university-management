import { alumnoModel } from "../models/alumnoModel.js";
import { cursoModel } from "../models/cursoModel.js";
import { notaModel } from "../models/notaModel.js";
import { universidadModel } from "../models/universidadModel.js";
import { response } from "../helpers/response.js";
import mongoose from "mongoose";

const notaController = {};

notaController.getAll = async (req, res) => {
  try {
    const notas = await notaModel.find();
    if (notas.length === 0) {
      return response(res, 404, false, "", "No se encontraron notas");
    }
    return response(res, 200, true, notas, "lista de notas");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

notaController.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        `El id ${id} no es valido para la base de datos`
      );
    }

    const notaEncontrada = await notaModel.findById({ _id: id });
    if (!notaEncontrada) {
      return response(res, 404, false, "", "nota no encontrada");
    }
    return response(res, 200, true, notaEncontrada, "nota encontrada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

notaController.postNota = async (req, res) => {
  try {
    const { alumno, curso, nota } = req.body;

    const alumnoExiste = await alumnoModel.findById({ _id: alumno });
    if (!alumnoExiste) {
      return response(res, 404, false, "", "el alumno no existe");
    }

    if (nota < 0 || nota > 5) {
      return response(
        res,
        400,
        false,
        "",
        "la nota no puede ser menor de 0 y mayor a 5"
      );
    }

    const cursoExiste = await cursoModel.findById({ _id: curso });
    if (!cursoExiste) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    const nuevaNota = await notaModel.create(req.body);
    return response(res, 201, true, nuevaNota, "nota creada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

notaController.putNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { alumno, curso } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        `El id ${id} no es valido para la base de datos`
      );
    }

    const notaEncontrada = await notaModel.findById({ _id: id });
    if (!notaEncontrada) {
      return response(res, 404, false, "", "nota no encontrada");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        `El id ${alumno} no es valido para la base de datos`
      );
    }

    const alumnoExiste = await alumnoModel.findById({ _id: alumno });
    if (!alumnoExiste) {
      return response(res, 404, false, "", "el alumno no existe");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        `El id ${curso} no es valido para la base de datos`
      );
    }
    const cursoExiste = await cursoModel.findById({ _id: curso });
    if (!cursoExiste) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    await notaEncontrada.updateOne(req.body);
    return response(res, 200, true, "", "nota actualizada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

notaController.deleteNota = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        `El id ${id} no es valido para la base de datos`
      );
    }

    const notaEncontrada = await notaModel.findById({ _id: id });
    if (!notaEncontrada) {
      return response(res, 404, false, "", "nota no encontrada");
    }

    await notaEncontrada.deleteOne();
    return response(res, 200, true, "", "nota eliminada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR NOTAS DE UN ALUMNO POR IDENTIFICACION

notaController.listarNotasPorIdentificacion = async (req, res) => {
  try {
    const { identificacion } = req.params;
    const alumnoEncontrado = await alumnoModel.findOne({
      identificacion: identificacion,
    });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno no encontrado");
    }

    const notaAlumno = await notaModel.find({
      alumno: alumnoEncontrado.identificacion,
    });

    if (notaAlumno.length === 0) {
      return response(res, 404, false, "", "el alumno no tiene notas");
    }

    return response(res, 200, true, notaAlumno, "notas del alumno");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** OBTENER EL PROMEDIO DE LAS NOTAS DE UN CURSO ESP

notaController.promedioNotas = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "curso no econtrado");
    }

    const notasCurso = await notaModel.find({ curso: cursoEncontrado._id });
    if (notasCurso.length === 0) {
      return response(res, 404, false, "", "el curso no tiene notas");
    }

    let acumulador = [];
    for (let nota of notasCurso) {
      acumulador += nota.nota;
    }

    const promedio = acumulador / notasCurso.length;

    return response(res, 200, true, promedio, "promedio");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** PROMEDIO DE NOTAS DE TODOS LOS ALUMNOS DE UNA UNIVERSIDAD

notaController.promedioUniversidad = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const universidadEncontrada = await universidadModel.findById({ _id: id });
    if (!universidadEncontrada) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const alumnosUniversidad = await alumnoModel.find({
      universidad: universidadEncontrada._id,
    });
    if (alumnosUniversidad.length === 0) {
      return response(res, 404, false, "", "la universidad no tiene alumnos");
    }

    let sumaNotas = 0;
    let totalNotas = 0;
    for (const alumno of alumnosUniversidad) {
      const notasAlumno = await notaModel.find({ alumno: alumno._id });
      for (const nota of notasAlumno) {
        sumaNotas += nota.nota;
        totalNotas++;
      }
    }

    const promedio = sumaNotas / totalNotas;
    return response(res, 200, true, promedio, "promedio de todos los alumnos");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

export default notaController;
