import { Request, Response, NextFunction } from "express"
import { getEarthquake } from './getEarthquake';
import { getRiverDicharge } from './getRiverDischarge';
import earthquakeAlert from '../controllers/earthquakeAlert';
import { sendMessage } from './push';
import { getAirPollutionCurrent, getAirPollutionForecast } from './getAirPollution';
import { getFireWeather } from './fire';
import { getPrecipitation } from './precipitation';
import { getWeather } from './weather';
import riverDischargeAlert from '../controllers/riverDischarge';
import dotenv from 'dotenv';

dotenv.config()

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
    const {response, error} = await getAirPollutionCurrent()
    if(response)
        res.status(200).json(response)
    if(error)
        res.status(500).json(error.response.data)
    console.log('done ✅')
}