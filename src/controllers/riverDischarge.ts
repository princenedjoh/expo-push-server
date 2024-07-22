import { responseType } from '../../src/utils/@types';
import { API, apiResponseType } from '../api/api';
import { getRiverDicharge } from '../utils/getRiverDischarge';
import util from 'util'
import notify from '../utils/message';

type RiverDischargeData = {
    latitude?: number,
    longitude?: number,
    generationtime_ms?: number,
    utc_offset_seconds?: number,
    timezone?: string,
    timezone_abbreviation?: string,
    daily_units?: {
        time: string,
        river_discharge: string,
    },
    daily?: {
        time: string[],
        river_discharge: number[],
    },
    river_discharge? : number
};

const constructRiverDischargeDescription = ({
    latitude,
    longitude,
    generationtime_ms,
    utc_offset_seconds,
    timezone,
    timezone_abbreviation,
    daily_units,
    river_discharge,
    daily,
}: RiverDischargeData) => {
    const latestTime = daily?.time[daily.time.length - 1];
    const latestDischarge = daily?.river_discharge[daily.river_discharge.length - 1];

    return `
        ${river_discharge !== undefined && `River discharge of ${river_discharge} m³/s occured on ${latestTime}.`}
        ${latitude !== undefined && longitude !== undefined && `The river discharge data is recorded at latitude ${latitude} and longitude ${longitude}.`}
        ${timezone && `The data is reported in the ${timezone} timezone (${timezone_abbreviation}).`}
        ${generationtime_ms !== undefined && `The data generation time was ${generationtime_ms} milliseconds.`}
        ${daily_units && `The time units are in ${daily_units.time} and the river discharge units are in ${daily_units.river_discharge}.`}
    `.trim().replace(/\s+/g, ' ');
};

const riverDischargeAlert = async () : Promise<responseType> => {
    const {response : users, error : getUserError} = await API.get('/users/search')
    const {response : riverDischarge, error : riverDischargeError} = await getRiverDicharge()
    console.log(riverDischarge)
    if(riverDischarge){
        const {
            latitude,
            longitude,
            generationtime_ms,
            utc_offset_seconds,
            timezone,
            timezone_abbreviation,
            daily_units,
            daily,
        } = riverDischarge
        if(users){
            const userSettings = []
            for(let user of users){
                const {response : settings, error} = await API.get('/settings/search/', {params : {id : user.id}})
                if(error)
                    return {error}
                if(!settings)
                    return {error : {message : 'no settings available'}}
                userSettings.push(settings)

                const {river_discharge} = riverDischarge.daily
                const {time} = riverDischarge.daily
                for(let i in river_discharge){
                    if(river_discharge[i] > 1060){
                        const messageOBJ = {
                            title : 'River Discharge',
                            description : constructRiverDischargeDescription({...riverDischarge, river_discharge : river_discharge[i]}),
                            severity : "normal",
                            category : "water",
                            data: JSON.stringify({
                                coordinates : [longitude, latitude],
                                generationtime_ms,
                                utc_offset_seconds,
                                timezone,
                                time : time[i],
                                timezone_abbreviation,
                                river_discharge : river_discharge[i]
                            })
                        }
                        const {response : addAlertResponse, error : addAlertError} = await API.post(`/alert/add/${user.id}/`, messageOBJ)
                        if(addAlertResponse){
                            await notify({
                                title : 'River Discharge',
                                body : messageOBJ.description,
                                data : JSON.parse(messageOBJ.data)
                            })
                        } if(getUserError) return {error : getUserError}
                    }
                }
            }
        }
        return {response : 'completed'}
    } else {
        return {error : riverDischargeError}
    }
}

export default riverDischargeAlert