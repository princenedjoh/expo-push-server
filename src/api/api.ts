import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

export interface apiResponseType {
  response? : any,
  error? : {
    message : string,
    detail? : string
  }
}

class api {
    baseURL
    constructor(baseURL: string) {
      if (!baseURL) {
        throw new Error('baseURL is required!');
      }
      this.baseURL = baseURL;
    }
  
    get = async (url: string, params?: any) : Promise<apiResponseType> => {
      try {
        const response = await axios.get(`${this.baseURL}${url}`, { params });
        return {response : response.data}
      } catch (error : any) {
          console.log(error.message)
          return {error : {message : 'failed', detail : error.message}}
      }
    };
  
    post = async (url: string, body?: any, params? : any) : Promise<apiResponseType> => {
      try {
        const response = await axios.post(`${this.baseURL}${url}`, body, {params});
        return {response : response.data}
      } catch (error : any) {
          console.log(error.message)
          return {error : {message : 'failed', detail : error.message}}
      }
    };
  }

export const API = new api(process.env.projectURL as string)