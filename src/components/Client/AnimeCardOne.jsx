import React from 'react'
import { Button, Grid, GridItem } from '@chakra-ui/react'
import { Layout } from '../Layout'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import supabase from '../../Api/supabaseClient'
import { useState } from 'react'
import { Spinner } from '@chakra-ui/react'
import { Series } from './Series'
import { Footer } from './Footer'
import { async } from '@firebase/util'
import { Genres } from './Genres'
import { Keywords } from './Keywords'
import { useAuth } from './auth'

export const AnimeCardOne = () => {
    const id = useParams()
    const [anime, setAnime] = useState([])
    const [series, setSeries] = useState([])
    const [season, setSeason] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectionSeason, setSelectionSeason] = useState('1')
    const [genres, setGenres] = useState([])
    const [keywords, setKeywords] = useState([])
    const auth = useAuth()
    useEffect(() => {
        handleViewAnime()
    }, [])

    const handleCheckSubscribe = async() =>{
        let { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select("*")
        .eq('clients_id', auth.user.id)
    }

    setTimeout(()=>{
        setLoading(false)
    },5000)
    const handleViewAnime = async() =>{
        const m = []
        const p =[]
        const k = []
        await supabase
        .from('anime')
        .select("*")
        .eq('anime_title', id.id).then(async(data)=>{
            setAnime(data.data[0])
            await supabase
            .from('series')
            .select("*")
            .eq('anime_id', data.data[0].id_anime)
            .then((data)=>{
                data.data.map((seas)=>{
                    if(!m.includes(seas.season))
                        m.push(seas.season)
                    setSeason(m)
                    //setLoading(false)
                })
            })
            await supabase
            .from('series')
            .select("*")
            .eq('anime_id', data.data[0].id_anime)
            .eq('season', selectionSeason).then((ser)=>{
                setSeries(ser)
            })
            await supabase
            .from('animegenres')
            .select("genres_id")
            .eq('anime_id', data.data[0].id_anime).then((data)=>{
                setGenres(data.data)
            })
            await supabase
            .from('animekeywords')
            .select("keywords_id")
            .eq('anime_id', data.data[0].id_anime).then((data)=>{
                setKeywords(data.data)
            })
        })
    }

    const handleChangeSeason = (e) =>{
        setSelectionSeason(e.target.value)
        handleViewAnime()
    }


  return (
    <Layout>
        <div style={{background:'#1F1F21'}}>
        {loading&&(
            <div style={{paddingBottom:'20%', marginBottom:'-5%'}}>
            <Spinner style={{color:'white', marginLeft:'46.7%', marginTop:'15%'}}/>
            </div>
        )}
        {!loading&&(
            <div>
            <div style={{display:'flex'}}>
                <div style={{margin:'2%', marginLeft:'10%', width:'80rem'}}><img src={anime.link_to_poster} alt={anime.anime_title} /></div>
                <div style={{color:'white', marginTop:'2%'}}>
                    <h1 style={{fontSize:'40px', fontWeight:'500'}}>{anime.anime_title}</h1>
                    <div style={{marginTop:'3%'}}>
                        <p style={{maxWidth:'80%'}}>{anime.anime_description}</p>
                        <p style={{marginTop:'20px', fontSize:'17px', color:'#878587'}}>Возрастное ограничение: {anime.age_limit}+</p>
                        <p style={{marginTop:'5px', fontSize:'17px', color:'#878587'}}>Дата выхода: {anime.release_date}</p>
                        <p style={{marginTop:'5px', fontSize:'17px', color:'#878587'}}>Оригинальное название: {anime.original_name}</p>
                        <p style={{marginTop:'5px', fontSize:'17px', color:'#878587'}}>Авторские права: {anime.copyright}</p>
                        <p style={{marginTop:'5px', fontSize:'17px', color:'#878587'}}>Студия: {anime.studia}</p>
                        <p style={{marginTop:'5px', fontSize:'17px', color:'#878587'}}>Режиссёр: {anime.direct}</p>
                        <div style={{display:'flex',  marginLeft:'-5px'}}>
                            <Genres genres={genres}/>
                        </div>
                        <div style={{display:'flex', marginLeft:'-10px', marginTop:'8px'}}>
                            <Keywords keywords={keywords}/>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{color:'white', marginLeft:'9%'}}>
            {season.map((seas)=>(
                <Button style={{background:'#1A1A1B', border:'3px solid #EE2E30', width:'2rem', marginLeft:'15px'}} value={seas} onClick={(e)=>handleChangeSeason(e)}>{seas}</Button>
            ))}
        </div>
        <div style={{display:'flex', marginLeft:'7%', marginTop:'2%', paddingBottom:'3%', marginBottom:'-5%'}}>
            <Series series={series.data}/>
        </div>
        </div>
        )}
        </div>
        <Footer/>
    </Layout>
  )
}
