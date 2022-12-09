import React from 'react'
import { FavoriteAnimeCard } from './FavoriteAnimeCard'

export const FavoriteAnimeCards = ({anime}) => {
  return ( anime.map((an)=>(
    <FavoriteAnimeCard key={an.ID} anime={an}/>
  ))
  )
}
