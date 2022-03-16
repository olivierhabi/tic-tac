import express from "express";
import bodyParser from "body-parser";
import play from "./router/play";

const app = express();
app.use(express.json());
app.use(bodyParser.json());

//Tic Tac Toe API
app.use("/play", play);
app.get("/", (req, res) => {
  return res.status(200).send({
    status: 200,
    message: "The Tic-tac-toe Game API",
  });
});

const port = "3000";
app.listen(port, () => console.log(`Listening on port ${port}`));
