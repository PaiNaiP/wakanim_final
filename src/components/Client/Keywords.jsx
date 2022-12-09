import React from 'react'
import { Keyword } from './Keyword'

export const Keywords = ({keywords}) => {
  return (
    keywords.map((keyword)=>(
        <Keyword key={keyword.ID} keywords={keyword} />
    ))
  )
}
