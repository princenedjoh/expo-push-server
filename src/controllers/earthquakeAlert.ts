import { responseType } from '../../src/utils/@types';
import { sendMessage } from '../../src/utils/push';
import { API, apiResponseType } from '../api/api';
import { getBackendEarthquake, getEarthquake } from '../utils/getEarthquake';
import { getSettings } from '../utils/getSettings';

const message = async ({
    title,
    body,
    data
} : {
    title? : string,
    body? : string,
    data? : string
})=>{
    const tokens = ['ExponentPushToken[IDkakXEPDXCy-NU-SmBs13]', 'ExponentPushToken[_ednsVAJQk7JnpfF3wTlxC]']
    for(let token of tokens){
        const {response, error} = await sendMessage([
            {
                to: token,
                sound: 'default',
                title : title ?? 'Earthquake (forecast)',
                body: body,
                data: data
            }
        ])
        console.log(response)
    }
}

const constructDescription = ({
    mag, 
    place, 
    time, 
    sig,
    depth,
} : {
    mag? : number, 
    place? : string, 
    time? : Date, 
    sig? : string,
    depth? : number
}) => {
    return `${mag && `An earthquake with a magnitude of ${mag} occurred`} ${place && `at ${place}.`} ${time && `The event took place on ${new Date(time)}.`} ${depth && `The depth of the earthquake was ${depth} km.`} ${sig && `A significance of ${sig}`}`
}

const earthquakeAlert = async () : Promise<responseType> => {
    let data = {}

    const {response : earthquakeData, error : earthquakeError} = await getEarthquake()
    const {response : backendEarthquakeResponse, error : backendEarthquakeError} = await getBackendEarthquake()
    console.log({backendEarthquakeResponse, backendEarthquakeError})
    
    if(earthquakeData){
        //loop through each user to filter settings
        const {response : users, error : getUserError} = await API.get('/users/search')
        if(users){
            for(let user of users){
                const {response : settings, error} = await API.get('/settings/search/', {params : {id : user.id}})
                if(error)
                    return {error}
                if(!settings)
                    return {error : {message : 'no settings available'}}
                for(let feature of earthquakeData.features){
                    const {mag, place, time, sig, title, mmi} = feature.properties
                    const {coordinates} = feature.geometry
                    const messageOBJ = {
                        title : 'Earthquake Alert (forecast)',
                        description : constructDescription({
                            mag,
                            place,
                            time,
                            sig
                        }),
                        severity : "critical",
                        category : "earthquake",
                        data: JSON.stringify({mag, place, time, sig, title, mmi, coordinates})
                    }
                    const {response : getUserResponse, error : getUserError} = await API.post(`/alert/add/${user.id}/`, messageOBJ)
                    if(getUserResponse){
                        await message({
                            body : messageOBJ.description,
                            data : JSON.parse(messageOBJ.data)
                        })
                    } if(getUserError) return {error : getUserError}
                }
            }
            return {response : 'completed'}
        } if (getUserError) return {error : getUserError}
    }
    if(earthquakeError)
        return {error : earthquakeError}
}

export default earthquakeAlert