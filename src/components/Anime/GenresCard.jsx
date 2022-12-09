import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import supabase from '../../Api/supabaseClient'
export const GenresCard = ({genr}) => {
    const [genresTitle, setGenresTitle]=useState([])
    useEffect(() => {
        handleViewGenres()
    }, [])
    
    const handleViewGenres = async()=>{
        let { data: genres, error } = await supabase
        .from('genres')
        .select("genres_title")
        .eq('id_genres', genr.genres_id)
        setGenresTitle(...genres)
    }
  return (
    <div style={{margin:'0 auto', background:'#0d6efd', color:'white', margin:'5px', borderRadius:'15px', padding:'4px', width:'190px', textAlign:'center'}}>{genresTitle.genres_title}</div>
  )
}
