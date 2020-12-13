import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [eventsArray, setEventsArray] = useState([]);
  const [image, setImage] = useState("");
  const [eventDetails, setEventDetails] = useState(null);
  const [openEvent, setOpenEvent] = useState(false);
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState("");
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
        let formattedEvents = events.forEach((event) => {
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

  const handleAddEvent = () => {
    console.log(textValue);
    let addFormData = new FormData();
    addFormData.append("file", image);
    let newPost = {
      id: textValue,
      platform: platform,
      hashtags: hashtags,
      imageUrl: "",
      start: new Date(time),
      end: new Date(time),
      title: textValue,
    };

    addFormData.append("post", JSON.stringify(newPost));
    axios.put(
      `https://socialcalendar123.herokuapp.com/add/${client}` ||
        "http://localhost:85/add/btwebgroup",
      addFormData,
      {}
    );
    setEventsArray([
      ...eventsArray,

      {
        start: new Date(time),
        end: new Date(time),
        title: textValue,
      },
    ]);

    console.log(eventsArray);
    setTextValue("");
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];

    setImage(file);
  };

  return (
    <div className="home">
      <div className="dialog">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Post</DialogTitle>
          <DialogContent>
            <DialogContentText>{time}</DialogContentText>

            <IconButton>
              <AddAPhotoIcon className="material-icons">
                add_a_photo
              </AddAPhotoIcon>
            </IconButton>
            <input type="file" name="file" onChange={handleFileRead} />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Post Description"
              type="text"
              fullWidth
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="hashtags"
              label="Hashtags"
              type="text"
              fullWidth
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="platform"
              label="Platform"
              type="text"
              fullWidth
              value={hashtags}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddEvent} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEvent}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">View Post</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {eventDetails &&
                Object.values(eventDetails).map((item, index) => (
                  <>
                    <center>
                      <img width="50%" src={item.imageUrl} />
                      <br />
                      Post Description: {item.title}
                      <br />
                      Hashtags: {item.hashtags}
                    </center>
                  </>
                ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
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
