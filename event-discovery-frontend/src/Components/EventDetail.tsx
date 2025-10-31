import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../api/eventApi";

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getEventById(id)
        .then(setEvent)
        .catch((error) => {
          alert("Failed to load event details: " + (error.response?.data?.message || error.message));
        });
    }
  }, [id]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="container">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><b>Location:</b> {event.location}</p>
      <p><b>Date:</b> {new Date(event.date).toLocaleDateString()}</p>
      <p>
        <b>Participants:</b> {event.currentParticipants}/{event.maxParticipants}
      </p>
    </div>
  );
};

export default EventDetail;
