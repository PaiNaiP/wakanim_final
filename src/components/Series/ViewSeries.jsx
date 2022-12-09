import React from 'react'
import {SeriesCards} from './SeriesCards'

const ViewSeries = ({series}) => {
  return (series.map((serie)=>(
    <SeriesCards key={serie.ID} series={serie}/>
  ))
  )
}

export default ViewSeries