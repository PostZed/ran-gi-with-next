import mongoose, { Schema } from "mongoose";

const squareSchema = new Schema({
    color: Number,
    col: Number,
    row: Number,
    hint: Number,
    count: Number,
    isClueSquare: Boolean,
}, { _id: false });


const gameSchema = new Schema({
    dimensions: Number,
    squares: [squareSchema]
}, { timestamps: {} });

//export { Game }
export default mongoose.models.Game || mongoose.model("Game", gameSchema);
