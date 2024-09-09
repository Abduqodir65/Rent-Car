import { Router } from "express";

const pageRouter = Router()

pageRouter.get('/',(req,res) => {
    res.render('index')
})

pageRouter.get('/about',(req,res) => {
    res.render('about')
})

export default pageRouter;