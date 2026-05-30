import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const LEADERBOARD_KEY = "leaderboard:users";

app.post("/leaderboard/score", async (req, res) => {
  const { userId, score } = req.body;
  await redis.zincrby(LEADERBOARD_KEY, score, userId);
  res.json({ ok: true });
});

app.get("/leaderboard", async (req, res) => {
  const leaderboard = await redis.zrevrange(
    LEADERBOARD_KEY,
    0,
    -1,
    "WITHSCORES",
  );
  res.json({ leaderboard });
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
  const rank = await redis.zrevrank(LEADERBOARD_KEY, req.params.userId);
  res.json({ rank });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
