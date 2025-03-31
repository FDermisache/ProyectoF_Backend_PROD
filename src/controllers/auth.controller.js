import { ServerError } from "../utils/errors.utils.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENVIROMENT from "../config/enviroment.config.js";
import { sendMail } from "../utils/mailer.utils.js";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      throw new ServerError("username is required", 400);
    }
    if (!email) {
      throw new ServerError("email is required", 400);
    }
    if (!password) {
      throw new ServerError("password is required", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verification_token = jwt.sign(
      { email }, //Lo que queremos guardar en el token
      ENVIROMENT.SECRET_KEY_JWT, //Clave con la que vamos a firmar
      { expiresIn: "24h" } //Fecha de expiracion del token
    );

    await UserRepository.create({
      username,
      email,
      password: passwordHash,
      verification_token,
    });
    //Le vamos a enviar un mail a el usuario
    //El mail va a tener un link
    //<a href='http://localhost:3000/api/auth/verifyEmail?verification_token=dsadssadosakdsaodsadsadijiodsad$'>Click para verificar</a>
    await sendMail({
      to: email,
      subject: "Verifica tu cuenta",
      html: `
              <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
                  <!-- Contenedor principal -->
                  <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                      <!-- Contenido del mensaje -->
                      <h1 style="color: #333;">Verifica tu cuenta</h1>
                      <p style="font-size: 16px; color: #555;">
                          Hola <strong>${username}</strong>, para verificar tu cuenta haz clic en el siguiente enlace.
                          Si no solicitaste la verificación, ignora este mail.
                      </p>
          
                     
                      <a href="${ENVIROMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}" 
                         style="display: inline-block; background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; 
                                font-size: 18px; border-radius: 5px; margin-top: 20px; font-weight: bold;">
                          Verificar mi cuenta
                      </a>
                  </div>
              </div>
            `,
    });
    return res.status(201).send({
      message: "user created",
      status: 201,
      ok: true,
    });
  } catch (error) {
    console.log("error al registrar", error);

    if (error.status) {
      return res.status(400).send({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    res.status(500).send({
      status: 500,
      ok: false,
      message: "internal server error",
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { verification_token } = req.query;
    const payload = jwt.verify(verification_token, ENVIROMENT.SECRET_KEY_JWT);
    const { email } = payload;
    const user_found = await UserRepository.verifyUserByEmail(email);
    res.redirect(ENVIROMENT.URL_FRONTEND + "/login");
  } catch (error) {
    console.log("error al registrar", error);

    if (error.status) {
      return res.send({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    res.send({
      status: 500,
      ok: false,
      message: "internal server error",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user_found = await UserRepository.findUserByEmail(email);
    if (!user_found) {
      throw new ServerError("User not found", 404);
    }
    if (!user_found.verified) {
      throw new ServerError("User found has no validated his email", 400);
    }
    const isSamePassword = await bcrypt.compare(password, user_found.password);
    if (!isSamePassword) {
      throw new ServerError("The password is not correct", 400);
    }
    const authorization_token = jwt.sign(
      {
        _id: user_found._id,
        username: user_found.username,
        email: user_found.email,
      },
      ENVIROMENT.SECRET_KEY_JWT,
      { expiresIn: "2h" }
    );
    return res.json({
      ok: true,
      status: 200,
      message: "Logged",
      data: {
        authorization_token,
      },
    });
  } catch (error) {
    console.log("error al registrar", error);

    if (error.status) {
      return res.send({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    res.send({
      status: 500,
      ok: false,
      message: "internal server error",
    });
  }
};
export const rewritePasswordController = async (req, res) => {
  try {
    const { password, reset_token } = req.body; // toma la nueva contraseña y el token del body
    const { _id } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT); // verifica el token esta firmado con nuestra firma, si no lo es lanza un error. Toma el Id del token

    // Hashear la contraseña
    const newHashedPassword = await bcrypt.hash(password, 10);
    await UserRepository.changeUserPassword(_id, newHashedPassword); // meotdo en userRpository
    if ("pepe123" === "pepe123 ") {
    }

    return res.json({
      ok: true,
      message: "Password changed succesfully",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    if (err.status) {
      return res.send({
        ok: false,
        status: err.status,
        message: err.message,
      });
    }
    return res.send({
      message: "Internal server error",
      status: 500,
      ok: true,
    });
  }
};

// lo probamos en el postman, metodo PUT, URl /api/auth/reqwrite > en el raw le pasamos la password nueva y el reset_token(que lo sacamos del frontend cuadno nos redirige el mail)

export const resetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user_found = await UserRepository.findUserByEmail(email);
    if (!user_found) {
      throw new ServerError("User not found", 404);
    }
    if (!user_found.verified) {
      throw new ServerError("User email is not validated yet", 400);
    }

    const reset_token = jwt.sign(
      { email, _id: user_found._id },
      ENVIROMENT.SECRET_KEY_JWT,
      { expiresIn: "2h" }
    );
    await sendMail({
      to: email,
      subject: "Reset your password",
      html: `
            <h1>Has solicitado resetar tu contraseña de no ser tu ignora este mail</h1>
            <a href='${ENVIROMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}'>Click aqui para resetear</a>
            `,
    });
    res.json({
      ok: true,
      status: 200,
      message: "Reset mail sent",
    });
  } catch (error) {
    console.log("error al registrar", error);

    if (error.status) {
      return res.send({
        ok: false,
        status: error.status,
        message: error.message,
      });
    }

    res.send({
      status: 500,
      ok: false,
      message: "internal server error",
    });
  }
};
