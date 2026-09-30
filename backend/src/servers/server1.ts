import express from "express";

const app = express();

const PORT = 3001;

app.get("/", (req, res) => {
  res.json({
    server: "Server 1",
    message: "Hello from Server 1",
  });
});

app.get("/health",(req,res)=>{
  res.json({
    status:"ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server 1 running on http://localhost:${PORT}`);
});
