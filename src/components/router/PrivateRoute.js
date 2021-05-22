import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const user = useSelector(state => state.auth.user)
  const currentSetup = useSelector(state => state.data.currentSetup)
  const currentPath = rest.path.substr(1)
  const welcomePaths = ['setups/new', 'account']
  const allowedOnWelcome = welcomePaths.includes(currentPath)
  
  if (user == null) return (
    <Redirect to={'/'} />
  )

  if (currentSetup == null && !allowedOnWelcome) return (
    <Redirect to={'/setups/new'} />
  )

  return (
    <Route {...rest} render={(routeProps) => <RouteComponent {...routeProps} />} />
  )
}

export default PrivateRoute