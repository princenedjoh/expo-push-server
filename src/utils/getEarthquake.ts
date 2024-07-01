import axios from 'axios';
import { responseType } from './@types';

export const getEarthquake = async () : Promise<responseType> => {
    const date = new Date()
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const tomorrowDate = new Date(today);
    tomorrowDate.setDate(date.getDate() + 1);
    const tomorrow = `${tomorrowDate.getFullYear()}-${tomorrowDate.getMonth() + 1}-${tomorrowDate.getDate()}`
    console.log({today, tomorrow})

    try {
        const response = await axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query`, {
            params : {
                format : 'geojson',
                starttime : today,
                endtime : tomorrow,
                minmagnitude : 5
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}