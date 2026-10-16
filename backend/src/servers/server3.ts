import express from "express";

const app = express();

const PORT = 3003;

app.get("/", (req, res) => {
  res.json({
    server: "Server 3",
    message: "Hello from Server 3",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server 3 running on ${PORT}`);
});
