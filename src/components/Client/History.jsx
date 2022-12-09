import React from 'react'
import { HistoryAnime } from './HistoryAnime'

export const History = ({watchedAnime}) => {
  return (
    watchedAnime.map((watched)=>(
        <HistoryAnime key={watched.ID} anime={watched} />
    ))
  )
}
