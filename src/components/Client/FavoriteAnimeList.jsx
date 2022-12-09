import React from 'react'
import { FavoriteAnime } from './FavoriteAnime'

export const FavoriteAnimeList = ({animeList}) => {
  return (animeList.map((anime)=>(
    <FavoriteAnime anime={anime}/>
  ))
  )
}
