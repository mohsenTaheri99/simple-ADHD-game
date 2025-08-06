const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));
const scores = [
  { username: "nobody", score: -420 },
  { username: "nobody", score: -420 },
  { username: "nobody", score: -420 },
];

app.post("/score", (req, res) => {
  const { username, score } = req.body;
  console.log(req.body);
  if (!username || typeof score !== "number") {
    console.log("invalid score from" + username);
    return res.status(400).json({ error: "invalid data" });
  }

  scores.push({ username: username, score: score });
  scores.sort((a, b) => b.score - a.score);
  const top3 = scores.slice(0, 3);
  console.log(top3);
  res.json(top3);
});

app.get("/score-all", async (req, res) => {
  res.json(scores);
});
app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
