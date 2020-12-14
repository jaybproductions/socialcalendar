import React from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

//Route Imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import useAuth from "./hooks/useAuth";
import UserContext from "./contexts/UserContext";

function App() {
  const [user, setUser] = useAuth();
  return (
    <>
      {" "}
      <UserContext.Provider value={{ user, setUser }}>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/client/:client" component={Home} />
          <Route path="/login" component={Login} />
        </Switch>
      </UserContext.Provider>
    </>
  );
}

export default App;
