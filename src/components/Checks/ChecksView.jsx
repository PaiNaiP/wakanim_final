import React from 'react'
import { ChecksCards } from './ChecksCards'

export const ChecksView = ({checks}) => {
  return (checks.map((check)=>(
    <ChecksCards key={check.ID} checks={check}/>
  ))
  )
}
