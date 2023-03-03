import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import CreateEvent from "./events/CreateEvent";
import Events from "./events/Events";
import MyEvents from "./events/MyEvents";

import CreateForum from "./forums/CreateForum";
import Forum from "./forums/Forum";
import Forums from "./forums/Forums";
import MyForums from "./forums/MyForums";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import UpdateCredentials from "./auth/UpdateCredentials";
import ForgotPassword from "./auth/ForgotPassword";
import PrivateRoute from "./auth/PrivateRoute";

import Dashboard from "./Dashboard";
import ProfileDashboard from "./users/ProfileDashboard";
import UpdateStatus from "./users/UpdateStatus";
import UserSettings from "./users/UserSettings";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              {/* Landing Page */}
              <PrivateRoute exact path="/" component={Dashboard} />

              {/* Authentication Pages */}
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />

              {/* Settings Page */}
              <PrivateRoute path="/user-settings" component={UserSettings} />
              <PrivateRoute path="/update-credentials" component={UpdateCredentials} />
              <PrivateRoute path="/update-status" component={UpdateStatus} />
              <PrivateRoute path="/my-profile" component={ProfileDashboard} />

              {/* Event Pages */}
              <PrivateRoute path="/events" component={Events} />
              <PrivateRoute path="/create-event" component={CreateEvent} />
              <PrivateRoute path="/my-events" component={MyEvents} />

              {/* Forum Pages */}
              <PrivateRoute path="/create-forum" component={CreateForum} />
              <PrivateRoute path="/forums" component={Forums} />
              <PrivateRoute path="/my-forums" component={MyForums} />
              <PrivateRoute path="/forum/:forumID" component={Forum} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App