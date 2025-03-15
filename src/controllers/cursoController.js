import { alumnoModel } from "../models/alumnoModel.js";
import { cursoModel } from "../models/cursoModel.js";
import { notaModel } from "../models/notaModel.js";
import { profesorModel } from "../models/profesorModel.js";
import { universidadModel } from "../models/universidadModel.js";
import { response } from "../helpers/response.js";
import mongoose from "mongoose";

const cursoController = {};

cursoController.getAll = async (req, res) => {
  try {
    const cursos = await cursoModel.find();
    if (cursos.length === 0) {
      return response(res, 404, false, "", "No se encontraron cursos");
    }
    return response(res, 200, true, cursos, "lista de cursos");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

cursoController.getById = async (req, res) => {
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
      return response(res, 404, false, "", "curso no encontrado");
    }

    return response(res, 200, true, cursoEncontrado, "curso encontrado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

cursoController.postCurso = async (req, res) => {
  try {
    const { profesor, alumnos, universidad, nombre } = req.body;

    const nombreRepetido = await cursoModel.findOne({ nombre: nombre });
    if (nombreRepetido) {
      return response(res, 400, false, "", "el nombre ya esta registrado");
    }

    const cursoProfesor = await profesorModel.findById({ _id: profesor });
    if (!cursoProfesor) {
      return response(res, 404, false, "", "no se encontro el profesor");
    }

    const cursoAlumno = await alumnoModel.findById({ _id: alumnos });
    if (!cursoAlumno) {
      return response(res, 404, false, "", "no se encontro el alumno");
    }

    const cursoUniversidad = await universidadModel.findById({
      _id: universidad,
    });
    if (!cursoUniversidad) {
      return response(res, 404, false, "", "no se encontro la universidad");
    }

    const nuevoCurso = await cursoModel.create(req.body);
    return response(res, 201, true, nuevoCurso, "curso creado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

cursoController.putCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { profesor, alumnos, universidad, nombre } = rea.body;

    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    const nombreRepetido = await cursoModel.findOne({ nombre: nombre });
    if (nombreRepetido) {
      return response(res, 400, false, "", "el nombre ya esta registrado");
    }

    const cursoProfesor = await profesorModel.findById({ _id: profesor });
    if (!cursoProfesor) {
      return response(res, 404, false, "", "no en encontro el profesor");
    }

    const cursoAlumno = await alumnoModel.findById({ _id: alumnos });
    if (!cursoAlumno) {
      return response(res, 404, false, "", "no se encontro el alumno");
    }

    if (cursoEncontrado.universidad !== universidad) {
      const cursoUniversidad = await universidadModel.findById({
        _id: universidad,
      });
      if (!cursoUniversidad) {
        return response(res, 404, false, "", "no se encontro la universidad");
      }
    }

    await cursoEncontrado.updateOne(req.body);
    return response(res, 200, true, "", "curso actualizado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

cursoController.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    const cursoNota = await notaModel.findOne({ curso: id });
    if (cursoNota) {
      return response(res, 400, false, "", "hay notas asociadas al curso");
    }

    await cursoEncontrado.deleteOne();
    return response(res, 200, true, "", "curso eliminado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS CURSOS DE UN PROFESOR POR IDENTIFICACION

cursoController.listarCursoIdentificacion = async (req, res) => {
  try {
    const { identificacion } = req.params;
    const profesorIdentificacion = await profesorModel.findOne({
      identificacion: identificacion,
    });
    if (!profesorIdentificacion) {
      return response(res, 404, false, "", "profesor no encontrado");
    }

    const profesorCursos = await cursoModel.find({
      profesor: profesorIdentificacion.identificacion,
    });
    if (profesorCursos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el profesor no tiene cursos asignados"
      );
    }
    return response(res, 200, true, profesorCursos, `cursos del profesor`);
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS CURSOS DE UNA UNIVERSIDAD ESPECIFICA

cursoController.listarCursosUniEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const universidadEncontrada = await universidadModel.findById({ _id: id });
    if (!universidadEncontrada) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const cursosUniEsp = await cursoModel.find({
      universidad: universidadEncontrada._id,
    });
    if (cursosUniEsp.length === 0) {
      return response(res, 404, false, "", "la universidad no tiene cursos");
    }
    return response(
      res,
      200,
      true,
      cursosUniEsp,
      `cursos de la universidad con el id ${id} encontrados`
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS CURSOS DE UN ALUMNO

cursoController.listarCursoDeAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const alumnoEncontrado = await alumnoModel.findById({ _id: id });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno no encontrado");
    }

    const cursoAlumno = await cursoModel.find({
      alumnos: alumnoEncontrado._id,
    });
    if (!cursoAlumno) {
      return response(res, 404, false, "", "el alumno no tiene cursos");
    }
    return response(
      res,
      200,
      true,
      cursoAlumno,
      `cursos del alumno con el id ${id} encontrados`
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS CURSOS EN LOS QUE UN PROFESOR ESPECIFICO ESTA ASIGNADO

cursoController.cursoProfesorEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const profesorEncontrado = await profesorModel.findById({ _id: id });
    if (!profesorEncontrado) {
      return response(res, 404, false, "", "profesor no encontrado");
    }

    const profesorAsignado = await cursoModel.find({
      profesor: profesorEncontrado._id,
    });
    if (profesorAsignado.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el profesor no tiene cursos asignados"
      );
    }
    return response(
      res,
      200,
      true,
      profesorAsignado,
      `cursos del profesor con el id ${id} encontrados`
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS CURSOS DONDE ALUMNO ESP TIENE NOTA MAYOR A 3

cursoController.cursosAlumnoEspNotaMayor = async (req, res) => {
  try {
    const { id } = req.params;
    const alumnoEncontrado = await alumnoModel.findById({ _id: id });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno no encontrado");
    }

    const notaAlumno = await notaModel.find({ alumno: alumnoEncontrado._id });
    if (notaAlumno.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el alumno no tiene cursos registrados"
      );
    }

    let notasMayores = [];
    for (let nota of notaAlumno) {
      if (nota.nota > 3) {
        const cursoNota = await cursoModel.findById(nota.curso);
        notasMayores.push(cursoNota);
      }
    }
    if (notasMayores.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el alumno no tiene ningun curso con notas mayores a 3"
      );
    }

    return response(
      res,
      200,
      true,
      notasMayores,
      "cursos del alumno con notas mayores a 3"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** CALCULAR LA CANTIDAD DE CURSOS OFRECIDO POR UNA UNIVERSIDAD ESP

cursoController.cursosUniEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const universidadEncontrada = await universidadModel.findById({ _id: id });
    if (!universidadEncontrada) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const cursoUniversidad = await cursoModel.find({
      universidad: universidadEncontrada._id,
    });
    if (cursoUniversidad.length === 0) {
      return response(res, 404, false, "", "la universidad no tiene cursos");
    }

    return response(
      res,
      200,
      true,
      cursoUniversidad,
      "cursos ofrecidos por la universidad"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

export default cursoController;
