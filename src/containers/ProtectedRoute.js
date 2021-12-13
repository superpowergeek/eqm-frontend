import React from 'react';
import { Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import * as Selectors from 'selectors';

const ProtectedRoute = ({ component: Comp, ...rest }) => {
  const isAuthenticated = useSelector(Selectors.selectUserIsAuthenticated);
  return (
    <Route
      {...rest}
      render={({ location, ...others }) =>
        {
          return isAuthenticated ? (<Comp {...location} {...location} {...others} />) : (<Redirect to={{
            pathname: "/login",
            state: { from: location }
          }} />);
        }
      }
    />
  );
}

export default ProtectedRoute;
