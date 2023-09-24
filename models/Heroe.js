import mongoose from "mongoose";

const heroeSchema = new mongoose.Schema({
  urlImagen: String,
  clase: String,
  tipo: String,
  poder: Number,
  vida: Number,
  defensa: Number,
  ataqueBase: Number,
  ataqueDado: Number,
  danoMax: Number,
  activo: Boolean,
  desc: String,
}, { versionKey: false }); // Desactiva el campo __v

const HeroModel = mongoose.model("heroes", heroeSchema);


export default HeroModel;
