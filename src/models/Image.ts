import { connection } from "../config/database.js";
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    label: {
        type: String,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

const Image = connection.model("Image", imageSchema);

export default Image;
