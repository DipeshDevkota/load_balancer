import express from "express";

const app = express();

const PORT = 3002;

app.get("/", (req, res) => {
  res.json({
    server: "Server 2",
    message: "Hello from Server 2",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server 2 running on http://localhost:${PORT}`);
});
