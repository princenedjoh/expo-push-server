import { responseType } from '../utils/@types';
import { API, apiResponseType } from '../api/api';
import { getRiverDicharge } from '../utils/getRiverDischarge';
import util from 'util'
import notify from '../utils/message';
import { getAirPollutionCurrent } from '../utils/getAirPollution';

type AirqualityData = {
    main : {
        aqi: number
    },
    components: {
        co: number,
        no: number,
        no2: number,
        o3: number,
        so2: number,
        pm2_5: number,
        pm10: number,
        nh3: number
    },
    date: number,
    coordinates: {
		lon: number,
		lat: number
	},
};

const constructAirQualityDescription = ({
    main,
    components,
    date,
    coordinates,
}: AirqualityData) => {
    const newDate = new Date(date * 1000); // Convert Unix timestamp to JavaScript Date
    return `${main.aqi && `The air quality index is ${main.aqi}.`} ${components.co && `CO level is ${components.co} μg/m³.`} ${components.no && `NO level is ${components.no} μg/m³.`} ${components.no2 && `NO2 level is ${components.no2} μg/m³.`} ${components.o3 && `O3 level is ${components.o3} μg/m³.`} ${components.so2 && `SO2 level is ${components.so2} μg/m³.`} ${components.pm2_5 && `PM2.5 level is ${components.pm2_5} μg/m³.`} ${components.pm10 && `PM10 level is ${components.pm10} μg/m³.`} ${components.nh3 && `NH3 level is ${components.nh3} μg/m³.`} ${newDate && `Data recorded on ${date}.`} ${coordinates && `Location coordinates are (lon: ${coordinates.lon}, lat: ${coordinates.lat}).`}`.trim();
};

const airQualityAlert = async () : Promise<responseType> => {
    const {response : users, error : getUserError} = await API.get('/users/search')
    const {response : airquality, error : aqerror} = await getAirPollutionCurrent()
    if(airquality){
        const {
            coord,
            list
        } = airquality

        if(!users)
            return {error : "No users available"}

        for(let user of users){
            const {response : settings, error} = await API.get('/settings/search/', {params : {id : user.id}})
            if(error)
                return {error}
            if(!settings)
                return {error : {message : 'no settings available'}}
            
            const messageOBJ = {
                title : 'Air Quality (forecast)',
                description : constructAirQualityDescription({
                    main : list[0].main,
                    components : list[0].components,
                    date : list[0].dt,
                    coordinates : coord
                }),
                severity : "severe",
                category : "atmosphere",
                data: JSON.stringify({
                    coordinates : [coord.lon, coord.lat],
                    main : list[0].main,
                    components : list[0].components,
                    date : list[0].dt,
                })
            }
            const {response : addAlertResponse, error : addAlertError} = await API.post(`/alert/add/${user.id}/`, messageOBJ)
            if(addAlertResponse){
                await notify({
                    title : 'Air Quality',
                    body : messageOBJ.description,
                    data : JSON.parse(messageOBJ.data)
                })
            } if(getUserError) return {error : getUserError}
        }

        return {response : 'completed'}
    } 
    if(aqerror)
        return {error : aqerror}
    return {response : 'No air quality data available'}
}

export default airQualityAlert