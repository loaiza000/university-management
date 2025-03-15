import mongoose from "mongoose";
import { response } from "../helpers/response.js";
import { alumnoModel } from "../models/alumnoModel.js";
import { cursoModel } from "../models/cursoModel.js";
import { profesorModel } from "../models/profesorModel.js";
import { universidadModel } from "../models/universidadModel.js";

const profesorController = {};

profesorController.getAll = async (req, res) => {
  try {
    const profesores = await profesorModel.find();
    if (profesores.length === 0) {
      return response(res, 404, false, "", "No se encontraron profesores");
    }
    return response(res, 200, true, profesores, "lista de profesores");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

profesorController.getById = async (req, res) => {
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

    const profesorEncontrado = await profesorModel.findById({ _id: id });
    if (!profesorEncontrado) {
      return response(res, 404, false, "", "profesor no encontrado");
    }

    return response(res, 200, true, profesorEncontrado, "profesor enconrtrado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

profesorController.postProfesor = async (req, res) => {
  try {
    const { correo, telefono, identificacion, universidad } = req.body;

    const universidadExiste = await universidadModel.findOne({
      _id: universidad,
    });
    if (!universidadExiste) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const correoRepetido = await profesorModel.findOne({
      correo_electronico: correo,
    });
    if (correoRepetido) {
      return response(res, 400, false, "", "el correo ya esta registrado");
    }

    const telefonoRepetido = await profesorModel.findOne({
      telefono: telefono,
    });
    if (telefonoRepetido) {
      return response(res, 400, false, "", "el telefono ya esta registrado");
    }

    const identificacionRepetida = await profesorModel.findOne({
      identificacion: identificacion,
    });
    if (identificacionRepetida) {
      return response(
        res,
        400,
        false,
        "",
        "la identificacion ya esta repetida"
      );
    }

    const nuevoProfesor = await profesorModel.create(req.body);
    return response(res, 201, true, nuevoProfesor, "profesor creado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

profesorController.putProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo, telefono, identificacion, universidad } = req.body;

    if (mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const profesorEncontrado = await profesorModel.findById({ _id: id });
    if (!profesorEncontrado) {
      return response(res, 404, false, "", "profesor no encontrado");
    }

    const universidadExiste = await universidadModel.findById({
      _id: universidad,
    });
    if (profesorEncontrado.universidad !== universidad) {
      if (!universidadExiste) {
        return response(res, 404, false, "", "la universidad no existe");
      }
    }

    const correoRepetido = await profesorModel.findOne({
      correo_electronico: correo,
    });
    if (correoRepetido) {
      return response(res, 400, false, "", "el correo ya esta registrado");
    }

    const telefonoRepetido = await profesorModel.findOne({
      telefono: telefono,
    });
    if (telefonoRepetido) {
      return response(res, 400, false, "", "el telefono ya esta registrado");
    }

    if (profesorEncontrado.identificacion !== identificacion) {
      const identificacionRepetida = await profesorModel.findOne({
        identificacion: identificacion,
      });
      if (identificacionRepetida) {
        return response(
          res,
          400,
          false,
          "",
          "la identificacion ya esta registrada"
        );
      }
    }

    await profesorEncontrado.updateOne(req.body);
    return response(res, 200, true, "", "profesor actualizado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

profesorController.deleteProfesor = async (req, res) => {
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

    const profesorEncontrado = await profesorModel.findById({ _id: id });
    if (!profesorEncontrado) {
      return response(res, 404, false, "", "profesor no encontrado");
    }

    const profesorCurso = await cursoModel.findOne({ profesor: id });
    if (profesorCurso) {
      return response(res, 400, false, "", "hay un curso asociado al profesor");
    }

    await profesorEncontrado.deleteOne();
    return response(res, 200, true, "", "profesor eliminado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS PROFESORES DE UNA UNIVERSIDAD ESPECIFICA

profesorController.listarProfesoresUniEsp = async (req, res) => {
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

    const universidadEncontrada = await universidadModel.findById({
      _id: id,
    });
    if (!universidadEncontrada) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const profesoresUniEsp = await profesorModel.find({
      universidad: universidadEncontrada._id,
    });
    if (profesoresUniEsp.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "la universidad no tiene profesores"
      );
    }

    return response(
      res,
      200,
      true,
      profesoresUniEsp,
      `profesores de la universidad con el id ${id} encontrados`
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS PROFESORES QUE IMPARTEN CURSOS EN LOS QUE ESTA UN ALUMNO ESPECIFICO

profesorController.profesoresCursosAlumnoEsp = async (req, res) => {
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

    const alumnoEncontrado = await alumnoModel.findById({ _id: id });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno no encontrado");
    }

    const alumnoCurso = await cursoModel.find({
      alumnos: alumnoEncontrado._id,
    });
    if (alumnoCurso.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el alumno no tiene cursos asociados"
      );
    }

    const profesoresId = alumnoCurso.map((item) => item.profesor);
    const profesores = await profesorModel.find({ _id: profesoresId });
    if (profesores.length === 0) {
      return response(res, 404, false, "", "profesores no encontrados");
    }

    return response(
      res,
      200,
      true,
      profesores,
      "profesores que imparten el curso donde esta el alumno"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

export default profesorController;
