import { Card, CardBody } from '@chakra-ui/card'
import { Grid, GridItem, Heading, Icon, Image, Stack, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BsBookmarkFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import supabase from '../../Api/supabaseClient'
import { useAuth } from './auth'

export const FavoriteAnimeCard = ({anime}) => {
    const auth = useAuth()
    const navigation = useNavigate()
    const [favorite, setFavorite] = useState([])
    useEffect(() => {
        handleCheckFavorites()
    }, [])

    const handleCardAnime=()=>{
        navigation(`/anime/${anime.anime_title}`)
    }
    const handleCheckFavorites = async() =>{
        await supabase
        .from('favorites_anime')
        .select("*")
        .eq('clients_id', auth.user.id)
        .eq('anime_id', anime.id_anime).then((data)=>{
            if(data.data.length!==0)
                setFavorite(true)
        })
    }

    const handleChangeFavorites = () =>{
        if(favorite)
            handleDeleteFromFavorites()
        else
            handleAddToFavorites()
    }

    const handleAddToFavorites = async()=>{
        const now = dayjs(new Date()).format('YYYY-MM-DD')
        await supabase
        .from('favorites_anime')
        .insert([
            { date_to_add: now, 
            clients_id: auth.user.id,
            anime_id: anime.id_anime},
        ]).then(()=>{
            setFavorite(true)
            window.location.reload()
        })
    }
    const handleDeleteFromFavorites = async()=>{
        await supabase
        .from('favorites_anime')
        .delete()
        .eq('clients_id', auth.user.id)
        .eq('anime_id', anime.id_anime)
        .then(()=>{
            setFavorite(false)
            window.location.reload()
        })
    }
  return (
    <Card maxW='20rem' style={{marginLeft:'4rem', background:'#323235'}} borderRadius='lg'>
    <CardBody>
    <Image style={{width:'20rem', borderRadius:'10px 10px 0 0'}}
    src={anime.link_to_poster}
    alt='Green double couch with wooden legs'
    onClick={handleCardAnime}
    />
    <Stack mt='6' spacing='3' height="6rem">
    <Grid gap={2} display='flex'>
    <GridItem colSpan={2} marginLeft="1rem" h='10' w="60">
    <Heading size='md' color="white" onClick={handleCardAnime}>{anime.anime_title}</Heading>
    
    <Text color="white" marginTop="0.2rem">
        {anime.release_date}
    </Text>
    <Text color="white" fontSize='2xl'>
        {anime.age_limit}+
    </Text>
    </GridItem>
    <GridItem colSpan={2} h='10' marginLeft="1rem">
    {favorite&&(
        <Icon as={BsBookmarkFill} style={{color:'EE2E30', fontSize:'25px', marginTop:'0.5rem'}} onClick={handleChangeFavorites}/>
    )}
    {!favorite&&(
        <Icon as={BsBookmarkFill} style={{color:'white', fontSize:'25px', marginTop:'0.5rem'}} onClick={handleChangeFavorites}/>
    )}
    </GridItem>
    </Grid>
    </Stack>
</CardBody>
</Card>
  )
}
