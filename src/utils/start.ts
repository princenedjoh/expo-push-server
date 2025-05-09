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
import airQualityAlert from '../controllers/airquality';
import dotenv from 'dotenv';

dotenv.config()

const message = async ()=>{
    const tokens = ['ExponentPushToken[IDkakXEPDXCy-NU-SmBs13]', 'ExponentPushToken[_ednsVAJQk7JnpfF3wTlxC]', 'ExponentPushToken[JD5Zz-MxGFOz32gTQ9d8BS]']
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
    const {response : airResponse, error : airError} = await airQualityAlert()
    const {response : earthquakeResponse, error : earthquakeError} = await earthquakeAlert()
    const {response : waterReponse, error : waterError} = await riverDischargeAlert()

    const response = {
        airquality : {
            reponse : airResponse,
            error : airError
        },
        water : {
            response : waterReponse,
            error : waterError
        },
        earthquake : {
            reponse : earthquakeResponse,
            error : earthquakeError
        }
    }

    res.status(200).json(response)
    console.log('done ✅')
}