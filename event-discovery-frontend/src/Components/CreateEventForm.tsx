import React, { useState } from "react";
import { createEvent } from "../api/eventApi";
import toast from "react-hot-toast";

const CreateEventForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: 0,
    latitude: "",
    longitude: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     
      const eventData = { ...formData, latitude: Number(formData.latitude), longitude: Number(formData.longitude), maxParticipants: Number(formData.maxParticipants) };
      await createEvent(eventData);
      toast.success("Event created successfully!");
      setFormData({ title: "", description: "", location: "", date: "", maxParticipants: 0, latitude: "", longitude: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error creating event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>Create New Event</h2>
      <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="number" name="maxParticipants" placeholder="Max Participants" value={formData.maxParticipants} onChange={handleChange} required />
      <input type="number" name="latitude" placeholder="Latitude (optional)" value={formData.latitude} onChange={handleChange} />
      <input type="number" name="longitude" placeholder="Longitude (optional)" value={formData.longitude} onChange={handleChange} />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateEventForm;
