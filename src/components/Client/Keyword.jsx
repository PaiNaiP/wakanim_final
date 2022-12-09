import { Badge } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import supabase from '../../Api/supabaseClient'

export const Keyword = ({keywords}) => {
    const [keywordsTitle, setKeywordsTitle] = useState([])

    useEffect(() => {
        handleViewKeywords()
    }, [])
    

    const handleViewKeywords = async()=>{
        await supabase
        .from('keywords')
        .select("name_of_keywords")
        .eq('id_keywords', keywords.keywords_id).then((data)=>{
            setKeywordsTitle(data.data[0].name_of_keywords)
        })
    }
  return (
    <Badge style={{marginLeft:'10px'}}>{keywordsTitle}</Badge>
  )
}
