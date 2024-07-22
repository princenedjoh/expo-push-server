import axios from 'axios';
import { responseType } from './@types';

export const getFireWeather = async (): Promise<responseType> => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/fwi`, {
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