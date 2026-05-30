import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notifications", async (req, res) => {
  const payload = {
    title: req.body.title || "Feedback",
    createdAt: new Date().toISOString(),
  };

  const receiver = await publisher.publish(
    "notifications",
    JSON.stringify(payload),
  );

  res.json({ message: `Notification sent to ${receiver} subscribers` });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
