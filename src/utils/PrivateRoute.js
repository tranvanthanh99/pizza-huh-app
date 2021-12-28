import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
// import LayoutDefault from "../template/layout";

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => authed === true
          ? <Component {...props} />
          : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
      />
    )
  }

  PrivateRoute.propTypes = {
//   component: PropTypes.func.isRequired,
  authed: PropTypes.bool,
};


export default PrivateRoute;
