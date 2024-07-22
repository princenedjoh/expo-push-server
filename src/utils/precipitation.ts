import axios from 'axios';
import { responseType } from './@types';

export const getPrecipitation = async (): Promise<responseType> => {
    let z = 6
    let x = 13
    let y =24
    try {
        const response = await axios.get(`https://maps.openweathermap.org/maps/2.0/radar/${z}/${x}/${y}`, {
            params : {
                tm : 1600781400,
                appid : '12d9154b1f1c1178b34d1b238de0b6f4'
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}