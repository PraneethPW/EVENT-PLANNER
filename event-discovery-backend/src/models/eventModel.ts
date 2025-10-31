import mongoose, { Schema, Document } from "mongoose";

export interface EventItem extends Document {
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  latitude?: number;
  longitude?: number;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  currentParticipants: { type: Number, required: true },
  latitude: { type: Number },
  longitude: { type: Number }
});

export default mongoose.model<EventItem>("Event", EventSchema);
