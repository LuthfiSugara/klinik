import axios from "axios";
import { baseUrl } from "../global";

export const API = axios.create({
    baseURL: baseUrl + '/api/',
});
