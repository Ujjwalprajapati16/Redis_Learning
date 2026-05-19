import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const mongo = new mongoose.Mongoose();
mongo.connect(process.env.MONGO_URL || "mongodb://localhost:27017/chai_aur_redis");

app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
});

app.get("/mongo", async (req, res) => {
    const reply = await mongo.connection.db.command({ ping: 1 });
    res.json({ mongo: reply });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});