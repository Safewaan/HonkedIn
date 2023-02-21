import React from "react";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UserSettings from "./UserSettings";
import UpdateCredentials from "./UpdateCredentials";
import UpdateStatus from "./UpdateStatus";
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import MyEvents from "./MyEvents";
import React from "react"
import Signup from "./Signup"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import Events from "./Events"
import CreateEvent from "./CreateEvent"
import CreateForum from "./CreateForum"

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

              {/* Settings Page */}
              <PrivateRoute path="/user-settings" component={UserSettings}/>
              <PrivateRoute path="/update-credentials" component={UpdateCredentials} />
              <PrivateRoute path="/update-status" component={UpdateStatus} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />

              <Route path="/create-forum" component={CreateForum} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App
