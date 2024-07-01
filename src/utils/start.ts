import { Request, Response, NextFunction } from "express"
import { getEarthquake } from './getEarthquake';
import { getRiverDicharge } from './getRiverDischarge';
import earthquakeAlert from '../controllers/earthquakeAlert';
import { sendMessage } from './push';

const message = async ()=>{
    const tokens = ['ExponentPushToken[IDkakXEPDXCy-NU-SmBs13]', 'ExponentPushToken[_ednsVAJQk7JnpfF3wTlxC]']
    for(let token of tokens){
        const response = await sendMessage([
            {
                to: token,
                sound: 'default',
                title : 'ecos',
                body: 'This is a test notification',
                data: { withSome: 'data' },
            }
        ])
    }
}

export const start = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const {response, error} = await earthquakeAlert()
        console.log({response, error})
        console.log('done ✅')
        res.status(200).json(response)
    } catch (error) {   
        res.status(500).json(error.message)
        console.log("start unsuccessful", error)
    }
}