import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PublicRoute = ({ component: RouteComponent, ...rest }) => {
  const user = useSelector(state => state.auth.user)

  return (
    <Route {...rest} render={(routeProps) => 
      user ? <Redirect to={'/home'} /> : <RouteComponent {...routeProps} />
    } />
  )
}

export default PublicRoute