import React from 'react'
import { useAuth } from './Client/auth'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
  const auth = useAuth()
  return auth.user ? children : <Navigate to={"/signIn"}/>
}

export default ProtectedRoute;
