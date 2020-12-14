import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import MuiAlert from "@material-ui/lab/Alert";
import validateLogin from "../validators/validateLogin";
import useForm from "../hooks/useForm";
import firebase from "../firebase";
import { toast } from "../helpers/toast";

const INITIAL_STATE = {
  email: "",
  password: "",
};

const Login = ({ handleClose, openLogin, setOpenLogin }) => {
  const { handleSubmit, handleChange, values, isSubmitting } = useForm(
    INITIAL_STATE,
    validateLogin,
    authenticateUser
  );

  const [busy, setBusy] = useState(false);

  async function authenticateUser() {
    setBusy(true);
    const { email, password } = values;

    try {
      await firebase.login(email, password);
      console.log("you are logged in");
    } catch (err) {
      console.error("authentication error", err);
    }
    setBusy(false);
    setOpenLogin(false);
  }

  return (
    <div className="dialog">
      <Dialog
        open={openLogin}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Post</DialogTitle>
        <DialogContent>
          <DialogContentText>Login Now</DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="text"
            fullWidth
            value={values.email}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={values.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
