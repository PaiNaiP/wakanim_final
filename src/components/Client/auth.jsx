import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { createContext } from 'react'
import supabase from '../../Api/supabaseClient';
const authContext = createContext();

export const AuthProvider = ({children}) =>{
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}


function useProvideAuth(){
    const [user, setUser] = useState(null)
    const Login = async(email, password) =>{
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        return error
    }

    const Logout = async()=>{
        const { error } = await supabase.auth.signOut()
        console.log(error)
    }

    const handleAddUser = async() =>{
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    useEffect(() => {
        handleAddUser()
        const auth = supabase.auth.onAuthStateChange((event, session)=>{
            if(event === 'SIGNED_IN'){
                setUser(session.user)
            }
            if(event === 'SIGNED_OUT'){
                setUser(null)
            }
        })
        return () => auth
    }, [])
    return{
        user, 
        Login,
        Logout
    }
}