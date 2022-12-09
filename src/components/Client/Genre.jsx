import { Box, Tag, Tooltip } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import supabase from '../../Api/supabaseClient'
const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
    <Box p='1'>
        <Tag ref={ref} {...rest}>
        {children}
        </Tag>
    </Box>
    ))
export const Genre = ({genres}) => {
    const [genresTitle, setGenresTitle]=useState([])
    const [genresDescription, setGenresDescription] = useState([])
    useEffect(() => {
        handleViewGenres()
    }, [])
    
    const handleViewGenres = async()=>{
        let { data } = await supabase
        .from('genres')
        .select("*")
        .eq('id_genres', genres.genres_id)
        setGenresTitle(data[0].genres_title)
        setGenresDescription(data[0].genres_description)
        console.log(genresDescription)
    }
  return (
    <Tooltip label={genresDescription}>
    <CustomCard>{genresTitle}</CustomCard>
    </Tooltip>
  )
}
