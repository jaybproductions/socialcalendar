import React, { useState, useEffect } from "react";
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

const AddEventModal = ({
  handleClose,
  time,
  handleFileRead,
  open,
  client,
  image,
  getEvents,
}) => {
  const [hashtags, setHashtags] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [textValue, setTextValue] = useState("");
  const [updateEvents, setUpdateEvents] = useState(false);

  useEffect(() => {
    if (updateEvents) {
      getEvents();
      console.log("getting events");
    }
  }, [updateEvents]);

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
      description: description,
    };

    addFormData.append("post", JSON.stringify(newPost));
    axios.put(
      `https://socialcalendar123.herokuapp.com/add/${client}` ||
        `http://localhost:85/add/${client}`,
      addFormData,
      {}
    );

    setTextValue("");

    setTimeout(() => {
      setUpdateEvents(true);
    }, 1000);

    setTimeout(() => {
      setUpdateEvents(false);
    }, 5000);
  };

  return (
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
            label="Post Title"
            type="text"
            fullWidth
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Post Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={platform}
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
    </div>
  );
};

export default AddEventModal;
