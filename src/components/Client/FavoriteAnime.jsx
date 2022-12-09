import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import supabase from '../../Api/supabaseClient'
import { FavoriteAnimeCards } from './FavoriteAnimeCards'
export const FavoriteAnime = ({anime}) => {
    const [animeList, setAnimeList] = useState([])
  
    useEffect(() => {
        handleViewAnime()
    }, [])

    const handleViewAnime = async()=>{
        await supabase
        .from('anime')
        .select("*")
        .eq('id_anime', anime.anime_id).then((data)=>setAnimeList(data.data))
        console.log(animeList)
        }
        
  return (
   <div style={{paddingBottom:'5rem', paddingTop:'2rem', marginBottom:'-5%', display:'flex'}}>
        <FavoriteAnimeCards anime={animeList} />
   </div>
  )
}
