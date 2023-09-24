import mongoose from "mongoose";

const armaSchema = new mongoose.Schema({
  urlImagen: String,
  nombre: String,
  tipoHeroe: String,
  efecto: {
    case: Number,
    statEffect: Number,
    stat: String,
    target: String,
    turnCount: Number,
  },
  activo: Boolean,
  desc: String,
},{ versionKey: false }); // Desactiva el campo __v););

const ArmaModel = mongoose.model("armas", armaSchema);

export default ArmaModel;
