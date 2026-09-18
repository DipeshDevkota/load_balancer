import express from "express";

const app = express();

const PORT = 3003;

app.get("/", (req, res) => {
  res.json({
    server: "Server 3",
    message: "Hello from Server 3",
  });
});

app.listen(PORT, () => {
  console.log(`Server 3 running on http://localhost:${PORT}`);
});
 