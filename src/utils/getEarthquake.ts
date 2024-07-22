import axios from 'axios';
import { responseType } from './@types';
import { backendURL } from './constants';

export const getEarthquake = async (magnitude? : number) : Promise<responseType> => {
    const date = new Date()
    const today = `${date.getFullYear()}-${date.getMonth() }-${date.getDate()}`
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
                minmagnitude : magnitude ?? 5,
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}

export const getBackendEarthquake = async (depth? : number) : Promise<responseType> => {
    try {
        const response = await axios.get(`${backendURL}ai/earthquake/get`, {
            params : {
                latitude : 6.674830897524358,
                longitude : -1.5718617131554429,
                depth : 19
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}