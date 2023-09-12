import dotenv from "dotenv-defaults";
dotenv.config();

import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { connect } from "./config/database.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", router);

const port = process.env.PORT ?? 4000;

connect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
