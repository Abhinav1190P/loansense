import "dotenv/config";
import express from "express";
import cors from "cors";
import loanRoutes from "./routes/loan";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/loan", loanRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`loansense backend listening on port ${port}`);
});
