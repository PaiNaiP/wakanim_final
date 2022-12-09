import React from 'react'
import { GenresCard } from './GenresCard'

export const GenresCards = ({genres}) => {
  return ( genres.map((genre)=>(
    <GenresCard key={genre.ID} genr={genre}/>
  ))
  )
}
