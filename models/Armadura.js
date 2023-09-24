import mongoose from "mongoose";

const armaduraSchema = new mongoose.Schema({
  urlImagen: String,
  heroe: String,
  tipo: String,
  efecto: {
    case: { type: Number, name: 'case' }, // Nombre en la base de datos es 'case'
    statEffect: Number,
    stat: String,
    target: String,
    turnCount: Number,
  },
  activo: Boolean,
  desc: String,
},{ versionKey: false }); // Desactiva el campo __v);

const ArmaduraModel = mongoose.model("armaduras", armaduraSchema);

export default ArmaduraModel;
