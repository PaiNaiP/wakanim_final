import React from 'react'
import { KeywordsCard } from './KeywordsCard'

export const KeywordsCards = ({keywords}) => {
  return (keywords.map((keyword)=>(
    <KeywordsCard key={keyword.ID} keyw={keyword}/>
  ))
  )
}
