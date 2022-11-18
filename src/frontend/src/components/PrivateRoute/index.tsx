import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isLoginSelector } from '../../store/reducers/user'

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
    const isLogin = useSelector(isLoginSelector)
    // if an unauthenticated person access this route, redirect to login page
    return isLogin === true ? children : <Navigate to="/login" />
}

export default PrivateRoute
