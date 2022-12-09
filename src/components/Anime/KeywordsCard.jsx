import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import supabase from '../../Api/supabaseClient'

export const KeywordsCard = ({keyw}) => {
    const [keywordsTitle, setKeywordsTitle] = useState([])

    useEffect(() => {
        handleViewKeywords()
    }, [])
    

    const handleViewKeywords = async()=>{
        let { data: keywords, error } = await supabase
        .from('keywords')
        .select("name_of_keywords")
        .eq('id_keywords', keyw.keywords_id)
        setKeywordsTitle(...keywords)
    }
  return (
    <div style={{margin:'0 auto', background:'#0d6efd', color:'white', margin:'5px', borderRadius:'15px', padding:'4px', width:'190px', textAlign:'center'}}>{keywordsTitle.name_of_keywords}</div>
  )
}
