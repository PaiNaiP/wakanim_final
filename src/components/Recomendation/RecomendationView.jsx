import React from 'react'
import { RecomendationCard } from './RecomendationCard'

export const RecomendationView = ({recomendation}) => {
  return (
    recomendation.map((rec)=>(
        <RecomendationCard key={rec.ID} recomendation={rec}/>
    ))
  )
}
