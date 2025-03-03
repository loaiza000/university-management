import { response } from "../helpers/response.js";
import { alumnoModel } from "../models/alumnoModel.js";
import { cursoModel } from "../models/cursoModel.js";
import { notaModel } from "../models/notaModel.js";
import { universidadModel } from "../models/universidadModel.js";

const alumnoController = {};

alumnoController.getAll = async (req, res) => {
  try {
    const alumnos = await alumnoModel.find();
    return response(res, 200, true, alumnos, "lista de alumnos");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

alumnoController.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumnoEncontrado = await alumnoModel.findById({ _id: id });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno no encontrado");
    }
    return response(res, 200, true, alumnoEncontrado, "alumno encontrado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

alumnoController.postAlumno = async (req, res) => {
  try {
    const { identificacion, correo, universidad } = req.body;

    const universidadExiste = await universidadModel.findById({
      _id: universidad,
    });
    if (!universidadExiste) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const identificacionRepetida = await alumnoModel.findOne({
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

    const correoRepetido = await alumnoModel.findOne({
      correo_electronico: correo,
    });
    if (correoRepetido) {
      return response(res, 400, false, "", "el correo ya esta registrado");
    }

    const nuevoAlumno = await alumnoModel.create(req.body);
    return response(res, 201, true, nuevoAlumno, "alumno creado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

alumnoController.putAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const { identificacion, telefono, universidad } = req.body;

    const alumnoEncontrado = await alumnoModel.findOne({ _id: id });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno no encontrado");
    }

    const universidadExiste = await universidadModel.findById({
      _id: universidad,
    });
    if (alumnoEncontrado.universidad !== universidad) {
      if (!universidadExiste) {
        return response(res, 404, false, "", "la universidad no existe");
      }
    }

    const telefonoRepetido = await alumnoModel.findOne({ telefono: telefono });
    if (telefonoRepetido) {
      return response(res, 400, false, "", "el telefono ya esta registrado");
    }

    if (alumnoEncontrado.identificacion !== identificacion) {
      return response(
        res,
        400,
        false,
        "",
        "la identificacion no se puede cambiar"
      );
    }

    await alumnoEncontrado.updateOne(req.body);
    return response(res, 200, true, "", "alumno actualizado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

alumnoController.deleteAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const alumnoEncontrado = await alumnoModel.findById({ _id: id });
    if (!alumnoEncontrado) {
      return response(res, 404, false, "", "alumno encontrado");
    }

    const alumnoCurso = await cursoModel.findOne({ alumnos: id });
    if (alumnoCurso) {
      return response(res, 400, false, "", "un curso esta asociado al alumno");
    }

    const alumnoNota = await notaModel.findOne({ alumno: id });
    if (alumnoNota) {
      return response(res, 400, false, "", "una nota esta asociada al alumno");
    }

    await alumnoEncontrado.deleteOne();
    return response(res, 200, true, "", "alumno eliminado");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS ALUMNOS DE UNA UNIVERSIDAD ESPECIFICA

alumnoController.listarUniEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const universidadEncontrado = await universidadModel.findById({ _id: id });
    if (!universidadEncontrado) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const alumnosUniversidad = await alumnoModel.find({
      universidad: universidadEncontrado._id,
    });
    if (!alumnosUniversidad) {
      return response(res, 404, false, "", "la universidad no tiene alumnos");
    }
    return response(
      res,
      200,
      true,
      alumnosUniversidad,
      `alumnos de la universidad con el id ${id} encontrados`
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS ALUMNOS QUE APROBARON UN CURSO EN PARTICULAR

alumnoController.alumnosAprobados = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "no se encontro el curso");
    }

    const notasCurso = await notaModel.find({ curso: cursoEncontrado._id });
    if (notasCurso.length === 0) {
      return response(res, 404, false, "", "el curso no tiene alumnos");
    }

    let aprobados = [];
    for (let nota of notasCurso) {
      if (nota.nota >= 3) {
        const alumno = await alumnoModel.findById(nota.alumno);
        if (alumno) {
          aprobados.push(alumno);
        }
      }
    }
    if (aprobados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el curso no tiene alumnos aprobados"
      );
    }

    return response(res, 200, true, aprobados, "alumnos aprobados");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** LISTAR LOS ALUMNOS QUE NO APROBARON UN CURSO EN PARTICULAR

alumnoController.alumnosDesaprobados = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    const notaCurso = await notaModel.find({ curso: cursoEncontrado._id });
    if (notaCurso.length === 0) {
      return response(res, 404, false, "", "el curso no tiene alumnos");
    }

    let reprobados = [];
    for (let nota of notaCurso) {
      if (nota.nota < 3) {
        const alumno = await alumnoModel.findById(nota.alumno);
        if (alumno) {
          reprobados.push(alumno);
        }
      }
    }
    if (reprobados.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "el curso no tiene alumnos reprobados"
      );
    }

    return response(res, 200, true, reprobados, "alumnos reprobados");
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** CALCULAR LA CANTIDAD DE ALUMNOS MATRICULADOS UNI ESP

alumnoController.cantidadAlumnosUniEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const universidadEncontrada = await universidadModel.findById({ _id: id });
    if (!universidadEncontrada) {
      return response(res, 404, false, "", "universidad no encontrada");
    }

    const alumnosUniversidad = await alumnoModel.find({
      universidad: universidadEncontrada._id,
    });
    if (alumnosUniversidad.length === 0) {
      return response(res, 404, false, "", "no hay alumnos en la universidad");
    }

    return response(
      res,
      200,
      true,
      alumnosUniversidad,
      "alumnos inscritos a la universidad"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** BUSCAR ALUMNO CON LA NOTA MAS ALTA EN CURSO ESPECIFICO

alumnoController.alumnosNotaCursoEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    const notasAlumno = await notaModel.find({ curso: cursoEncontrado._id });
    if (notasAlumno.length === 0) {
      return response(res, 404, false, "no hay notas registradas en el curso");
    }
    let notaAlta = 0;
    let alumnoNotaAlta = null;
    for (let nota of notasAlumno) {
      if (nota.nota > notaAlta) {
        notaAlta = nota.nota;
        alumnoNotaAlta = nota.alumno;
      }
    }

    if (!alumnoNotaAlta) {
      return response(
        res,
        404,
        false,
        "",
        "no hay alumnos con notas registradas en este curso"
      );
    }

    const alumnoConNotaAlta = await alumnoModel.findById(alumnoNotaAlta);
    return response(
      res,
      200,
      true,
      alumnoConNotaAlta,
      "alumno con la nota mas alta del curso"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

// ** BUSCAR ALUMNO CON LA NOTA MAS BAJA EN CURSO ESPECIFICO

alumnoController.alumnosNotaBajaCursoEsp = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEncontrado = await cursoModel.findById({ _id: id });
    if (!cursoEncontrado) {
      return response(res, 404, false, "", "curso no encontrado");
    }

    const notasAlumno = await notaModel.find({ curso: cursoEncontrado._id });
    if (notasAlumno.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "no hay notas registradas en el curso"
      );
    }
    let notaBaja = 6;
    let alumnoNotaBaja = null;
    for (let nota of notasAlumno) {
      if (nota.nota < notaBaja) {
        notaBaja = nota.nota;
        alumnoNotaBaja = nota.alumno;
      }
    }

    if (!alumnoNotaBaja) {
      return response(
        res,
        404,
        false,
        "",
        "no hay alumnos con notas registradas en este curso"
      );
    }

    const alumnoConNotaBaja = await alumnoModel.findById(alumnoNotaBaja);
    return response(
      res,
      200,
      true,
      alumnoConNotaBaja,
      "alumno con la nota mas baja del curso"
    );
  } catch (error) {
    return response(res, 500, false, "", error.message);
  }
};

export default alumnoController;
