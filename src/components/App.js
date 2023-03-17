import React from "react";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

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

import Network from "./userNetwork/Network";
import NetworkProfile from "./userNetwork/NetworkProfile";

import CreateResource from "./resources/CreateResource";
import Resources from "./resources/Resources";

import {
  HOME_PAGE,
  FORGOT_PASSWORD_PAGE,
  LOGIN_PAGE,
  SIGNUP_PAGE,
  UPDATE_CREDENTIALS_PAGE,
  EVENTS_PAGE,
  CREATE_EVENT_PAGE,
  MY_EVENTS_PAGE,
  CREATE_FORUM_PAGE,
  FORUMS_PAGE,
  MY_FORUMS_PAGE,
  FORUM_PAGE,
  MY_PROFILE_PAGE,
  UPDATE_STATUS_PAGE,
  USER_SETTINGS_PAGE,
  CREATE_RESOURCE_PAGE,
  RESOURCES_PAGE,
  NETWORK_PAGE,
  NETWORK_PROFILE_PAGE
} from "./constants/Routes";

function App() {
  return (
    <ChakraProvider
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              {/* Landing Page */}
              <PrivateRoute exact path={HOME_PAGE} component={Dashboard} />

              {/* Authentication Pages */}
              <Route path={SIGNUP_PAGE} component={Signup} />
              <Route path={LOGIN_PAGE} component={Login} />
              <Route path={FORGOT_PASSWORD_PAGE} component={ForgotPassword} />

              {/* Settings Page */}
              <PrivateRoute path={USER_SETTINGS_PAGE} component={UserSettings} />
              <PrivateRoute path={UPDATE_CREDENTIALS_PAGE} component={UpdateCredentials} />
              <PrivateRoute path={UPDATE_STATUS_PAGE} component={UpdateStatus} />
              <PrivateRoute path={MY_PROFILE_PAGE} component={ProfileDashboard} />

              {/* Event Pages */}
              <PrivateRoute path={EVENTS_PAGE} component={Events} />
              <PrivateRoute path={CREATE_EVENT_PAGE} component={CreateEvent} />
              <PrivateRoute path={MY_EVENTS_PAGE} component={MyEvents} />

              {/* Forum Pages */}
              <PrivateRoute path={CREATE_FORUM_PAGE} component={CreateForum} />
              <PrivateRoute path={FORUMS_PAGE} component={Forums} />
              <PrivateRoute path={MY_FORUMS_PAGE} component={MyForums} />
              <PrivateRoute path={FORUM_PAGE} component={Forum} />

              {/* User Network Pages */}
              <PrivateRoute path={NETWORK_PAGE} component={Network} /> 
              <PrivateRoute path={NETWORK_PROFILE_PAGE} component={NetworkProfile} /> 
              
              {/* Resources Pages */}
              <PrivateRoute path={CREATE_RESOURCE_PAGE} component={CreateResource} />
              <PrivateRoute path={RESOURCES_PAGE} component={Resources} />


            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </ChakraProvider>
  )
}

export default App;