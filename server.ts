import express from 'express'
import cors from 'cors'
import { Request, Response, NextFunction} from "express"
import errorhandler, { errorType } from './src/middleware/erroHandler';
import { notif } from './src/routes/notif';

export const app = express()

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//routes
// app.use('', (req : Request, res : Response) => res.status(200).send("ecos expo push server 🎉"))
app.use('/notif', notif)

// error handler
app.use((err : errorType, req : Request, res : Response, next : NextFunction) => errorhandler(err, req, res, next))





const port = process.env.PORT || 3005
app.listen(port, ()=>{console.log(`🌏 Listening at port ${port}`)})