import axios from 'axios';
import { responseType } from './@types';

export const getRiverDicharge = async (): Promise<responseType> => {
    try {
        const response = await axios.get(`https://flood-api.open-meteo.com/v1/flood`, {
            params : {
                latitude : 6.564404889755423,
                longitude : 0.017944966136847748,
                daily : 'river_discharge',
                forecast_days : 10
            }
        })
        return {response : response?.data}
    } catch (error) {
        return {error}
    }
}