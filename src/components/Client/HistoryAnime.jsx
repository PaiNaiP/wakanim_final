import { Card, CardBody } from '@chakra-ui/card'
import { Button, CloseButton, Heading, Image, Skeleton, Spinner, Text } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../Api/supabaseClient'
import {IoMdClose} from 'react-icons/io'
import { useAuth } from './auth'

export const HistoryAnime = ({anime}) => {
    const [animeList, setAnimeList] = useState([])
    const navigation = useNavigate()
    const [series, setSeries] = useState([])
    const [loading, setLoading] = useState(true)
    const auth = useAuth()
    useEffect(() => {
        handleViewAnimeTitle()
        console.log(anime)
    }, [])

    setTimeout(()=>{
        setLoading(false)
    },1000)

    const handleViewAnimeTitle = async() =>{
        await supabase
        .from('anime')
        .select("anime_title")
        .eq('id_anime', anime.anime_id).then(async(data)=>{
            setAnimeList(data.data[0].anime_title)
            await supabase
            .from('series')
            .select("link_to_the_poster")
            .eq('series_code', data.data[0].anime_title+anime.season_stop+'x'+anime.series_stop).then((datar)=>{
                setSeries(datar.data[0])
            })
        })
    }

    const handleViesAnime = ()=>{
        navigation(`/watch/${animeList+anime.season_stop+'x'+anime.series_stop}`)
    }

    const handleDeleteAnime = async() =>{
        await supabase
        .from('watched_anime')
        .delete()
        .eq('anime_id', anime.anime_id)
        .eq('clients_id', auth.user.id).then(()=>window.location.reload())
    }
  return (
    <>
    {loading&&(
        <Spinner/>
    )}
    {!loading&&(
        <>
        <Card style={{background:'#323235', borderRadius:'10px', marginLeft:'15px'}}>
        <CardBody style={{color:'white', background:'#323235', borderRadius:'10px'}}>
        <Image
        src={series.link_to_the_poster}
        alt='Green double couch with wooden legs'
        borderRadius='lg'
        style={{width:'28rem', borderRadius:'10px 10px 0 0'}}
        onClick={handleViesAnime}
        />
        <div style={{display:'flex', width:'100%'}}>
            <div style={{width:'25rem'}}>
            <div style={{margin:'10px', marginLeft:'15px'}}>
            <Heading size='md'>{animeList}</Heading>
            <div style={{display:'flex', color:'#878587'}}>
            <Text>Сезон: {anime.season_stop}</Text>
            <Text style={{marginLeft:'5px'}}>Серия: {anime.series_stop}</Text>
            </div>
            </div>
            </div>
            <CloseButton size='lg' style={{marginTop:'13px'}} onClick={handleDeleteAnime}/>
        </div>
        </CardBody>
        </Card>
        </> 
    )}
    </>
    
  )
}
