const express = require("express");
import Play from "../controller/play";

const router = express.Router();

router.get("/", Play.getBoard);

export default router;
