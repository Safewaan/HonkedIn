import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

import {
  LOGIN_PAGE
} from "../constants/Routes";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to={LOGIN_PAGE} />
      }}
    ></Route>
  )
}
