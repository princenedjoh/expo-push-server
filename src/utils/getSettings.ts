import { API, apiResponseType } from '../api/api';

export const getSettings = async () : Promise<apiResponseType> => {
    const {response, error} = await API.get('/settings/search/')
    console.log(response, error)
    if(response)
        return {response}
    if(error)
        return {error}
}