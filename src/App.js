import React from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

//Route Imports
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path="/home" component={Home} />
        <Route path="/client/:client" component={Home} />
        <Route path="/login" component={Login} />
      </Switch>
    </>
  );
}

export default App;
