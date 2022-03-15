import express from "express";
import bodyParser from "body-parser";
import play from "./router/play";

const app = express();
app.use(express.json());
app.use(bodyParser.json());

//Tic Tac Toe API
app.use("/play", play);
app.get("/", (req, res) => {
  console.log({ message: "The Tic-tac-toe Game API" });
  return res.status(200).send({
    status: 200,
    message: "Welcome PROJECT_11-API",
  });
});

const port = "3000";
app.listen(port, () => console.log(`Listening on port ${port}`));

// ++x++++++
// ++x+++o++
// ++x+++o+o
// ++x+++oxo
// o+x+++oxo
// o+xx++oxo
// ooxxxooxo

// o|o|x
// -+-+-
// x|x|o
// -+-+-
// o|x|o

// +xxo++o++
// oxxo++o++

// x   ooo




//winner ++x+++ooo
//draw ooxxxooxo
//continue ooxxxoox+