import axios from 'axios';
import { responseType } from './@types';

export const getRiverDicharge = async (): Promise<responseType> => {
    try {
        const response = await axios.get(`https://flood-api.open-meteo.com/v1/flood`, {
            params : {
                latitude : 59.1,
                longitude : 10.75,
                daily : 'river_discharge'
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}