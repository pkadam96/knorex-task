const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./config/dbConnect");
const { userRouter } = require("./routes/userRouter");

const app = express();
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("server is running");
})

app.use("/", userRouter)

app.listen(process.env.PORT, async () => {
    await connectToDB();
    console.log(`Server is running on port ${process.env.PORT}`);
})