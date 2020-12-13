import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import EventModal from "../components/EventModal";
import AddEventModal from "../components/AddEventModal";

const Home = (props) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState([]);

  const [eventsArray, setEventsArray] = useState([]);
  const [image, setImage] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [openEvent, setOpenEvent] = useState(false);

  let params = useParams();
  let client = params.client;

  useEffect(() => {
    getEvents();
  }, [client]);

  useEffect(() => {
    if (eventDetails !== null) {
      setOpenEvent(true);
      console.log("this is running");
    }
  }, [eventDetails]);

  const getEvents = () => {
    axios
      .get(
        `https://socialcalendar123.herokuapp.com/${client}/posts` ||
          `http://localhost:85/${client}/posts`
      )
      .then((response) => {
        console.log(response.data[0].posts);
        let events = response.data[0].posts;
        events.forEach((event) => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });

        setEventsArray(events);

        //setEventsArray(formattedEvents);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEvent(false);
  };
  const events = eventsArray;
  const localizer = momentLocalizer(moment);

  const handleSelect = (date) => {
    console.log(date);
    const results = Object.values(date.slots).toString();
    setOpen(true);
    setTime(results);
  };

  const handleEventSelect = async (event) => {
    console.log(event);
    setEventDetails([event]);
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];

    setImage(file);
  };

  return (
    <div className="home">
      <div className="dialog">
        <AddEventModal
          open={open}
          time={time}
          handleFileRead={handleFileRead}
          handleClose={handleClose}
          client={client}
          image={image}
          getEvents={getEvents}
        />

        <EventModal
          eventDetails={eventDetails}
          openEvent={openEvent}
          handleClose={handleClose}
        />
      </div>
      <div className="calendar">
        <Calendar
          selectable={true}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100vh" }}
          onSelectSlot={handleSelect}
          onSelectEvent={handleEventSelect}
        />
      </div>
    </div>
  );
};

export default Home;
