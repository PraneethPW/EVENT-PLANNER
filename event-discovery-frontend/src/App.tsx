import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EventList from "./Components/EventList";
import EventDetail from "./Components/EventDetail";
import CreateEventForm from "./Components/CreateEventForm";
import "./App.css";
import { Toaster } from "react-hot-toast";


const App: React.FC = () => (
  <>
    <Toaster position="top-right" reverseOrder={false} />
    <Router>
      <div className="navbar">
        <Link to="/">Events</Link>
        <Link to="/create">Create Event</Link>
      </div>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/create" element={<CreateEventForm />} />
      </Routes>
    </Router>
  </>
);

export default App;
