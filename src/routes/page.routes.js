import { Router } from "express";

const pageRouter = Router()

pageRouter.get('/',(req,res) => {
    res.render('index')
})

export default pageRouter;