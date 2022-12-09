import React from 'react'
import { Serie } from './Serie'

export const Series = ({series}) => {
  return (
    series.map((serie)=>(
        <Serie key={serie.ID} series={serie} />
    ))
  )
}
