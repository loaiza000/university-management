import mongoose from "mongoose";
import { handleError } from "../helpers/error.handler.js";
import { generateToken } from "../helpers/generate.token.js";
import { encryptPassword } from "../helpers/password.encrypt.js";
import { response } from "../helpers/response.js";
import { usuarioModel } from "../models/usuario.model.js";
import bcrypt from "bcrypt";

const usuarioController = {};

usuarioController.getAllUser = async (req, res) => {
  try {
    const users = await usuarioModel.find();
    if (users.length === 0) {
      return response(res, 404, false, "", "No se encontraron usuarios");
    }

    return response(res, 200, true, users, "Lista de usaurios");
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.getUserById = async (req, res) => {
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

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `Usuario no encontrado con el id ${id}`
      );
    }

    return response(
      res,
      200,
      true,
      userFound,
      `Usuario encontrado con el id ${id}`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.postUser = async (req, res) => {
  try {
    const { password, email, nombre } = req.body;

    if (!password || !email || !nombre) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (password, email y nombre) son requeridos"
      );
    }

    const emailFound = await usuarioModel.findOne({ email: email });
    if (emailFound) {
      return response(
        res,
        400,
        false,
        "",
        `El email ${email} ya se encuentra registrado`
      );
    }

    if (password.length < 6) {
      return response(
        res,
        400,
        false,
        "",
        "El password no puede tener menos de 6 caracteres"
      );
    }

    const encryptarPassword = encryptPassword(password);
    const newUser = {
      nombre,
      email,
      password: encryptarPassword,
    };
    const token = generateToken({ user: newUser._id });
    newUser.token = token;
    await newUser.save();
    return response(
      res,
      201,
      true,
      { ...newUser._doc, password: null },
      "Usuario creado"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, email, nombre } = req.body;

    if (mongoose.Types.ObjectId.isValid(id)) {
      return response(
        res,
        400,
        false,
        "",
        `El id ${id} no es valido para la base de datos`
      );
    }

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `Usuario no encontrado con el id ${id}`
      );
    }

    if (!password || !email || !nombre) {
      return response(
        res,
        400,
        false,
        "",
        "Los campos (password, email y nombre) son requeridos"
      );
    }

    if (userFound.email != email) {
      const emailFound = await usuarioModel.findOne({ email: email });
      if (emailFound) {
        return response(
          res,
          400,
          false,
          "",
          `El email ${email} ya se encuentra registrado`
        );
      }
    }

    if (password.length < 6) {
      return response(
        res,
        400,
        false,
        "",
        "El password no puede tener menos de 6 caracteres"
      );
    }

    const userActualizado = await usuarioModel.updateOne(req.body);
    return response(
      res,
      200,
      true,
      userActualizado,
      `Usuario con el id ${id} fue actualizado`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

usuarioController.deleteUser = async (req, res) => {
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

    const userFound = await usuarioModel.findById({ _id: id });
    if (!userFound) {
      return response(
        res,
        404,
        false,
        "",
        `Usuario no encontrado con el id ${id}`
      );
    }

    await userFound.updateOne({ activo: false });
    return response(
      res,
      200,
      true,
      "",
      `El usuario con el di ${id} fue desactivado`
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** USUARIOS INACTIVOS

usuarioController.getUserInactivos = async (req, res) => {
  try {
    const userInactivos = await usuarioModel.find({ activo: false });
    if (userInactivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron usuarios inactivos"
      );
    }

    return response(
      res,
      200,
      true,
      userInactivos,
      "Lista de usuarios inactivos"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

// ** USUARIOS ACTIVOS

usuarioController.getUserActivos = async (req, res) => {
  try {
    const userActivos = await usuarioModel.find({ activo: true });
    if (userActivos.length === 0) {
      return response(
        res,
        404,
        false,
        "",
        "No se encontraron usuarios activos"
      );
    }

    return response(res, 200, true, userActivos, "Lista de usuarios activos");
  } catch (error) {
    return handleError(res, error);
  }
};

// ** LOGIN

usuarioController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegister = await usuarioModel.findOne({ email: email });
    if (!emailRegister) {
      return response(
        res,
        404,
        false,
        "",
        "El email no esta registrado o encontrado"
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      emailRegister.password
    );
    if (!validPassword) {
      return response(res, 404, false, "", "Password incorrecto");
    }

    const token = generateToken(emailRegister._id);

    const userResponse = {
      id: emailRegister._id,
      nombre: emailRegister.nombre,
      email: emailRegister.email,
      password: "", 
    };

    return response(
      res,
      200,
      true,
      { usuario: userResponse, token },
      "Bienvenido"
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export default usuarioController;
