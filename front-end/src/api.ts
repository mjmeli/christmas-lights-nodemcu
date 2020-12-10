import { LightsState } from "./types";

const API_URL = "http://192.168.86.161";

const buildUrl = (path: string) => {
    return !path.startsWith('/')
        ? `${API_URL}/${path}`
        : `${API_URL}${path}`;
};

const LIGHTS_URL = buildUrl("/lights");
const PERSISTENCE_URL = buildUrl("/persistence");

export const getLightsState = async () => {
    const res = await fetch(LIGHTS_URL);
    return await (res.json() as Promise<LightsState>);
};

export const setLightsState = async (data: LightsState) => {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data)
    };
    const response = await fetch(LIGHTS_URL, requestOptions);
    return await (response.json() as Promise<LightsState>);
};

export const getPersistence = async () => {
    const res = await fetch(PERSISTENCE_URL);
    return await res.text();
};

export const deletePersistence = async () => {
    const requestOptions = {
        method: 'DELETE'
    };
    const response = await fetch(PERSISTENCE_URL, requestOptions);
    return response.ok;
};