import axios from "axios";
const API_BASE = "http://localhost:4000/api/events";

export const getEvents = async (customPath?: string) => (
  await axios.get(customPath ? API_BASE + customPath.replace("/api/events", "") : API_BASE)
).data;
export const getEventById = async (id: string) => (await axios.get(`${API_BASE}/${id}`)).data;
export const createEvent = async (eventData: any) => (await axios.post(API_BASE, eventData)).data;
