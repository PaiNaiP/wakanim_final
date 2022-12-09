import React from 'react'
import { Genre } from './Genre'

export const Genres = ({genres}) => {
  return (
    genres.map((genre)=>(
        <Genre key={genre.ID} genres={genre} />
    ))
  )
}
