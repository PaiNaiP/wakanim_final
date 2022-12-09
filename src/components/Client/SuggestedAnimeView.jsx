import React from 'react'
import { SuggestedAnime } from './SuggestedAnime'


export const SuggestedAnimeView = ({recomendation}) => {
  return (recomendation.map((rec)=>(
    <SuggestedAnime key={rec.ID} recomendation={rec}/>
  ))
  )
}
