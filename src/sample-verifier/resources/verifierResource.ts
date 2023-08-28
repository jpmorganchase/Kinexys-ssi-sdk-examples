import express, { Request, Response } from 'express';
import { VerifierService } from '../services/verifierService'

const verifierRouter = express.Router({
    strict: true,
})

export default verifierRouter;

const verificationService = new VerifierService();

verifierRouter.get("/info", (req: Request, res: Response) => {
    try {
        res.status(200).json("Verifier Service");
    } catch (e: any) {
        res.status(500).send(e.message);
    }
})

verifierRouter.post("/verify", async (req: Request, res: Response) => {
    try {
        res.status(200).json(await verificationService.verify(req.body.presentation));
    } catch (e: any) {
        res.status(400).json({
            status: "invalid",
            errors: [
                {
                    message: e.message
                }
            ]
        })
    }
})