import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import EventModal from "../components/EventModal";
import AddEventModal from "../components/AddEventModal";
import Login from "../Auth/Login";
import UserContext from "../contexts/UserContext";
import firebase from "../firebase";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const Home = (props) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState([]);

  const [eventsArray, setEventsArray] = useState([]);
  const [image, setImage] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [openEvent, setOpenEvent] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  let params = useParams();
  let client = params.client;

  useEffect(() => {
    getEvents();
  }, [client]);

  useEffect(() => {
    if (eventDetails !== null) {
      setOpenEvent(true);
    }
  }, [eventDetails]);

  const getEvents = () => {
    axios
      .get(
        `https://socialcalendar123.herokuapp.com/${client}/posts` ||
          `http://localhost:85/${client}/posts`
      )
      .then((response) => {
        let events = response.data[0].posts;
        events.forEach((event) => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });

        setEventsArray(events);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEvent(false);
    setOpenLogin(false);
  };
  const events = eventsArray;
  const localizer = momentLocalizer(moment);

  const handleSelect = (date) => {
    const results = Object.values(date.slots).toString();
    setOpen(true);
    setTime(results);
  };

  const handleEventSelect = async (event) => {
    setEventDetails([event]);
  };

  const handleOpenLogin = async (event) => {
    setOpenLogin(true);
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];

    setImage(file);
  };

  async function LogoutUser() {
    try {
      await firebase.logout();
      props.history.push(`/client/${client}`);
      console.log("youve logged out");
    } catch (err) {
      console.error("Unable to log out", err);
    }
  }

  return (
    <div className="home">
      {!user ? (
        <IconButton onClick={handleOpenLogin}>
          <AccountCircleIcon style={{ color: "green" }}></AccountCircleIcon>
          Login
        </IconButton>
      ) : (
        <IconButton onClick={LogoutUser}>
          <AccountCircleIcon style={{ color: "red" }}></AccountCircleIcon>
          Logout
        </IconButton>
      )}
      <div className="dialog">
        {user && (
          <AddEventModal
            open={open}
            time={time}
            handleFileRead={handleFileRead}
            handleClose={handleClose}
            client={client}
            image={image}
            getEvents={getEvents}
          />
        )}

        <EventModal
          eventDetails={eventDetails}
          openEvent={openEvent}
          handleClose={handleClose}
        />
        <Login
          setOpenLogin={setOpenLogin}
          openLogin={openLogin}
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
          eventPropGetter={(event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "lightgrey",
              color: "black",
              borderRadius: "0px",
              border: "none",
            };

            if (event.platform == "Facebook") {
              newStyle.backgroundColor = "#3b5998";
              newStyle.color = "white";
            } else if (event.platform == "Instagram") {
              newStyle.backgroundColor = "#F56040";
            } else if (event.platform == "LinkedIn") {
              newStyle.backgroundColor = "#0e76a8";
            } else if (event.platform == "Twitter") {
              newStyle.backgroundColor = "#00acee";
            }

            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </div>
    </div>
  );
};

export default Home;
