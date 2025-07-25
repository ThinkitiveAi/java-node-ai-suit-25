require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// Provider registration route placeholder
app.use("/api/v1/provider", require("./routes/provider"));
app.use("/api/v1/patient", require("./routes/patient"));
app.use("/api/v1/provider/availability", require("./routes/availability"));
app.use("/api/v1/availability", require("./routes/availability"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
