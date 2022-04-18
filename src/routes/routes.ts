import { Request, Response, Router } from "express";
import { TranslateWorkerController } from "../controller/TranslateWorkerController";

export const router = Router();

router.get("/", (req, res) => {
    res.json({
        status: 200,
        msg: "Server created successfully !!!",
    });
});

router.post('/testing',(req:Request, resp:Response)=>{
    resp.json({
        status:"success",
        data:req.body
    })
})

router.post("/translate-api/translate",
    (req: Request, res: Response) => {
        return new TranslateWorkerController().languageTranslateWorker(req, res)
    })
