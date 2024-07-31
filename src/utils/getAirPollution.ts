import axios from 'axios';
import { responseType } from './@types';

export const getAirPollutionCurrent = async (): Promise<responseType> => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution`, {
            params : {
                lat : 59.1,
                lon : 10.75,
                appid : '12d9154b1f1c1178b34d1b238de0b6f4'
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}

export const getAirPollutionForecast = async (): Promise<responseType> => {
    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/forecast`, {
            params : {
                lat : 59.1,
                lon : 10.75,
                appid : '12d9154b1f1c1178b34d1b238de0b6f4'
            }
        })
        if(response)
            return {response : response?.data}
        return {error : {message : 'no response'}}
    } catch (error) {
        console.log(error.message)
        return {error}
    }
}