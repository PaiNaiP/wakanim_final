import React from 'react'
import { Anime } from './Anime'

export const Animes = ({anime}) => {
  return ( anime.map((anim)=>(
    <Anime key={anim.ID} anime={anim} />
  ))
  )
}
