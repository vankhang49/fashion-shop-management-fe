import React from 'react';
import { Navigate } from 'react-router-dom';

export const isAuthenticated = () =>{
    return !!localStorage.getItem('isAuthenticated');
}

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;