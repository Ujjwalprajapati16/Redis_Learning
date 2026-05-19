import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, "EX", 60);
    res.json({ ok: true, otp });
});

app.post("/otp/verify", async (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = await redis.get(otpKey(phone));
    // console.log(storedOtp);

    if(!storedOtp) {
        return res.json({ ok: false, message: "OTP not found" });
    }

    if(storedOtp !== otp) {
        return res.json({ ok: false, message: "Invalid OTP" });
    }

    await redis.del(otpKey(phone));

    res.json({ ok: true, message: "OTP verified" });
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone));
    res.json({ ttl });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});