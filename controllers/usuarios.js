const { response, request } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");

const usuariosGet = async (req = request, res = response) => {
  //const { q, nombre = "No name", apikey, page = 1, limit } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  /* const usuarios = await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite));

  const total = await Usuario.countDocuments(query); */

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.json({
    msg: "post API - Controlador",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  // TODO validar contra base de datos.
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.status(500).json({
    msg: "put API - Controlador",
    id,
  });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch API - Controlador",
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  //Fisicamente lo borramos
  //const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    usuario,
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
};
