import mongoose from "mongoose";
import { response } from "../helpers/response.js";
import { alumnoModel } from "../models/alumnoModel.js";
import { cursoModel } from "../models/cursoModel.js";
import { profesorModel } from "../models/profesorModel.js";
import { universidadModel } from "../models/universidadModel.js";

const universidadController = {};

universidadController.getAll = async (req, res) => {
  try {
    const universidades = await universidadModel.find();
    if (universidades.length === 0) {
      return response(res, 404, false, "", "No se encontraron universidades");
    }
    return response(res, 200, true, universidades, "lista de universidades");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

universidadController.getById = async (req, res) => {
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

    return response(
      res,
      200,
      true,
      universidadEncontrada,
      "universidad encontrada"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

universidadController.postUniversidad = async (req, res) => {
  try {
    const { nombre, telefono, correo_electronico } = req.body;
    const nombreRepetido = await universidadModel.findOne({ nombre: nombre });
    if (nombreRepetido) {
      return response(res, 400, false, "", "el nombre ya esta registrado");
    }

    const telefonoRepetido = await universidadModel.findOne({
      telefono: telefono,
    });
    if (telefonoRepetido) {
      return response(res, 400, false, "", "El telefono ya esta registrado");
    }

    const correoRepetido = await universidadModel.findOne({
      correo_electronico: correo_electronico,
    });
    if (correoRepetido) {
      return response(res, 400, false, "", "el correo ya esta registrado");
    }

    const nuevaUniversidad = await universidadModel.create(req.body);
    return response(res, 201, true, nuevaUniversidad, "universidad creada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

universidadController.putUniversidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo } = req.body;

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

    const nombreRepetido = await universidadModel.findOne({ nombre: nombre });
    if (nombreRepetido) {
      return response(res, 400, false, "", "el nombre ya esta registrado");
    }

    const telefonoRepetido = await universidadModel.findOne({
      telefono: telefono,
    });
    if (telefonoRepetido) {
      return response(res, 400, false, "", "El telefono ya esta registrado");
    }

    const correoRepetido = await universidadModel.findOne({
      correo_electronico: correo,
    });
    if (correoRepetido) {
      return response(res, 400, false, "", "el correo ya esta registrado");
    }

    await universidadEncontrada.updateOne(req.body);
    return response(res, 200, true, "", "universidad actualizada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

universidadController.deleteUniversidad = async (req, res) => {
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

    const universidadAlumno = await alumnoModel.findOne({ universidad: id });
    if (universidadAlumno) {
      return response(
        res,
        400,
        false,
        "",
        "la universidad esta asociada a un alumno"
      );
    }

    const universidadProfesor = await profesorModel.findOne({
      universidad: id,
    });
    if (universidadProfesor) {
      return response(
        res,
        400,
        false,
        "",
        "la universidad esta asociada a un profesor"
      );
    }

    const universidadCurso = await cursoModel.findOne({ universidad: id });
    if (universidadCurso) {
      return response(
        res,
        400,
        false,
        "",
        "la universidad esta asociada a un curso"
      );
    }

    await universidadEncontrada.deleteOne();
    return response(res, 200, true, "", "universidad eliminada");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

universidadController.getByName = async (req, res) => {
  try {
    const { nombre } = req.params;
    const universidadByName = await universidadModel.findOne({
      nombre: nombre,
    });
    if (!universidadByName) {
      return response(
        res,
        404,
        false,
        "",
        `la universidad con el nombre ${nombre} no fue encontrada`
      );
    }

    return response(
      res,
      200,
      true,
      universidadByName,
      "universidad encontrada"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};
export default universidadController;
