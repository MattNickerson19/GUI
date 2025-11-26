// backend/server.js
const express = require("express");
const app = express();
const PORT = 3001;

app.get("/api/ping", (req, res) => {
  res.json({ message: "Backend alive!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
