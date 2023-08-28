import express from "express";
import verificationRouter from './resources/verifierResource'

const app = express();
app.use(express.json());

app.use('/', verificationRouter);

app.listen(process.env.PORT, () => {
    console.log(`Verifier started on http://localhost:${process.env.PORT}`);

})
