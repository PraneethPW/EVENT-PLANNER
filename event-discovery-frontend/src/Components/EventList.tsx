import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/eventApi";
import toast from "react-hot-toast";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState("");
  const [radiusKm, setRadiusKm] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Build query string
      let query = "";
      if (locationFilter) query += `location=${locationFilter}&`;
      if (lat && lng && radiusKm) query += `lat=${lat}&lng=${lng}&radiusKm=${radiusKm}&`;
      const url = query ? `/api/events?${query}` : `/api/events`;
      const data = await getEvents(url); // update getEvents to allow param
      setEvents(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error loading events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="container">
      <h2>Upcoming Events</h2>
      <form onSubmit={handleFilter} style={{ marginBottom: "1em" }}>
        <input
          type="text"
          placeholder="Search by location"
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Your Latitude"
          value={lat}
          onChange={e => setLat(e.target.value)}
        />
        <input
          type="number"
          placeholder="Your Longitude"
          value={lng}
          onChange={e => setLng(e.target.value)}
        />
        <input
          type="number"
          placeholder="Radius (km)"
          value={radiusKm}
          onChange={e => setRadiusKm(e.target.value)}
        />
        <button type="submit">Filter</button>
      </form>
      {events.map((e) => (
        <div className="event-card" key={e._id}>
          <h3>{e.title}</h3>
          <p>{e.description}</p>
          <p><b>Location:</b> {e.location}</p>
          <p><b>Date:</b> {new Date(e.date).toLocaleDateString()}</p>
          <Link to={`/event/${e._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default EventList;
