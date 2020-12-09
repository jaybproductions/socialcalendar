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
  let params = useParams();
  let client = params.client;

  useEffect(() => {
    getEvents();
  }, [client]);

  const getEvents = () => {
    axios
      .get(
        `https://socialcalendar123.herokuapp.com/${client}/posts` ||
          `http://localhost:85/${client}/posts`
      )
      .then((response) => {
        console.log(response.data[0].posts);
        setEventsArray(response.data[0].posts);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const events = eventsArray;
  const localizer = momentLocalizer(moment);

  const handleSelect = (date) => {
    console.log(date);
    const results = Object.values(date.slots).toString();
    setOpen(true);
    setTime(results);
  };

  const handleEventSelect = (event) => {
    console.log(event);
    console.log("This is an event!");
  };

  const handleAddEvent = () => {
    axios.put(
      `https://socialcalendar123.herokuapp.com/add/${client}` ||
        "http://localhost:85/add/btwebgroup",
      {
        id: textValue,
        imageUrl: "",
        start: new Date(time),
        end: new Date(time),
        title: textValue,
      }
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

  const handleFileUpload = async (event) => {
    const filename = "testingfile4352";
    let formData = new FormData();
    formData.append("file", image);
    axios
      .post(
        `https://socialcalendar123.herokuapp.com/btwebgroup/uploadimage` ||
          `http://localhost:85/${client}/uploadimage`,

        formData,
        {}
      )
      .then(() => {
        console.log("image uploaded");
      });
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
            <img
              src="gs://social-media-calendar-84d06.appspot.com/btwebgroup/testingfile2.jpg"
              alt=""
            />
            <button onClick={() => handleFileUpload()}>Upload</button>
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
