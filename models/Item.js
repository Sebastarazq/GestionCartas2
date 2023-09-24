import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  urlImagen: String,
  heroe: String,
  nombre: String,
  efecto: {
    case: Number,
    statEffect: Number,
    stat: [String], // Esto permite una matriz de cadenas
    target: String,
    turnCount: Number,
  },
  activo: Boolean,
  desc: String,
},{ versionKey: false }); // Desactiva el campo __v);

const ItemModel = mongoose.model("items", itemSchema);

export default ItemModel;
