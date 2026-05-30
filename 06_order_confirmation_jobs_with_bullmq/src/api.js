import express from "express";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      subject: req.body.subject || "Welcome to our website",
      body: req.body.body || "Welcome to our website",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res.json({ message : "Email job added", job });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
