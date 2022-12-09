import React from 'react'
import { useEffect } from 'react'
import { Layout } from '../Layout'
import { Animes } from './Animes'
import { Banner } from './Banner'
import supabase from '../../Api/supabaseClient'
import { useState } from 'react'
import { Footer } from './Footer'
import { History } from './History'
import { useAuth } from './auth'
import { Spinner } from '@chakra-ui/react'
import { SuggestedAnime } from './SuggestedAnime'
import { SuggestedAnimeView } from './SuggestedAnimeView'

export const Home = () => {
    const auth = useAuth()
    const [anime, setAnime] = useState([])
    const [watchedAnime, setWatchedAnime] = useState([])
    const [loading, setLoading] = useState(true)
    const [watchedAnimeLength, setWatchedAnimeLength] = useState(0)
    const [suggested_anime, setSuggested_anime] = useState([])
    const [suggested_anime_lenght, setSuggested_anime_lenght] = useState(0)
    useEffect(() => {
        ViewAnime()
    }, [])

    window.setTimeout(()=>{
        setLoading(false)
        handleViewHistory()
        handleViewSuggestedAnime()
    }, 3000)
    const ViewAnime = async() =>{
        let { data } = await supabase
        .from('anime')
        .select('*')
        setAnime(data)
    }

    const handleViewHistory = async()=>{
        if(watchedAnimeLength===0){
            await supabase
        .from('watched_anime')
        .select("*")
        .eq('clients_id', auth.user.id).then((data)=>{
            setWatchedAnime(data.data)
            setWatchedAnimeLength(data.data.length)
        })
        }
    }

    const handleViewSuggestedAnime = async() =>{
        if(suggested_anime_lenght===0){
            await supabase
            .from('suggested_anime')
            .select('*')
            .eq('clients_id', auth.user.id).then((data)=>{
                setSuggested_anime(data.data)
                setSuggested_anime_lenght(data.data.length)
            })
        }
    }
    return (
    <Layout>
        <div style={{background:'#1F1F21'}}>
            <Banner/>
            {loading&&(
                <Spinner style={{color:'white', marginLeft:'49.2%', marginTop:'5rem'}}/>
            )}
            {!loading&&(
                <>
                {watchedAnimeLength!==0&&(
                <div>
                    <h1 style={{margin:'40PX', color:'white', fontSize:'40px', fontWeight:'500', marginLeft:'60px'}}>Продолжить просмотр</h1>
                    <div style={{display:'flex', marginLeft:'50px'}}>
                    <History watchedAnime={watchedAnime}/>
                    </div>
                </div>
            )}
            {suggested_anime_lenght!==0&&(
                <div>
                    <h1 style={{margin:'40PX', color:'white', fontSize:'40px', fontWeight:'500', marginLeft:'60px'}}>Рекомендованные</h1>
                    <div style={{display:'flex', marginLeft:'0px'}}>
                    <SuggestedAnimeView recomendation={suggested_anime}/>
                    </div>
                </div>
            )}
            <h1 style={{margin:'40PX', color:'white', fontSize:'40px', fontWeight:'500', marginLeft:'60px'}}>Новинки аниме</h1>
            <div style={{display: 'flex'}}>
            <Animes anime={anime}/>
            </div>
                </>
            )}
            <Footer/>
        </div>
    </Layout>
  )
}