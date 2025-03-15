import jsonwebtoken from "jsonwebtoken";
import { response } from "../helpers/response.js";

const messageNoAuth = (res) => {
  return response(res, 401, false, "", "No esta autorizado");
};

export const authClient = (roles) => {
  return (req, res, next) => {
    let token = null;

    if (
      req.header.authorization &&
      req.header.authorization.startsWith("Bearer")
    ) {
      token = req.header.authorization.split(" "[1]);
      jsonwebtoken.verify(token, process.env.SECRET, async (error, payload) => {
        if (error) {
          return messageNoAuth(res);
        }

        const user = await usuarioModel.findById({ _id: payload.user });
        if (!user) {
          return messageNoAuth(res);
        }

        if (roles.includes(user.roles)) {
          req.userId = payload.user;
          next();
        } else {
          return response(
            res,
            400,
            false,
            "",
            `Se requiere un rol valido ${roles}`
          );
        }
      });
    }

    if (!token) {
      return messageNoAuth(res);
    }
  };
};
