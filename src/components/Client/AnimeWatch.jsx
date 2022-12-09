import { Spinner } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import {DefaultPlayer as Video} from 'react-html5video'
import 'react-html5video/dist/styles.css'
import { useNavigate, useParams } from 'react-router-dom'
import supabase from '../../Api/supabaseClient'
import { Layout } from '../Layout'
import { useAuth } from './auth'
import { Footer } from './Footer'
export const AnimeWatch = () => {
    const navigate = useNavigate()
    const id = useParams()
    const [videoLink, setVideoLink] = useState('')
    const [loading, setLoading] = useState(true)
    const [video, setVideo] = useState('')

    const auth = useAuth()
    useEffect(() => {
        handleViewSeries()
        handleCheckSubscribtion()
        if(!auth.user)
            navigate('/signin')
    }, [])

    setTimeout(()=>{
        setLoading(false)
    },1000)

    const handleCheckSubscribtion = async() =>{
        await supabase
        .from('subscriptions')
        .select("*")
        .eq('clients_id', auth.user.id).then((data)=>{
            if(data.data.length===0)
                navigate('/subscribe')
        })
    }
    const handleViewSeries = async()=>{
        await supabase
        .from('series')
        .select('*')
        .eq('series_code', id.id).then((data)=>{
            setVideoLink(data.data[0].link_to_the_video)
            setVideo(data.data[0])
        })
    }

    const handleStopVideo = async()=>{
        await supabase
        .from('watched_anime')
        .select("*")
        .eq('anime_id', video.anime_id)
        .eq('clients_id', auth.user.id)
        .then(async(data)=>{
            if(data.data.length!==0){
                await supabase
                .from('watched_anime')
                .delete()
                .eq('anime_id', video.anime_id)
            }
                await supabase
                .from('watched_anime')
                .insert([
                    { season_stop: video.season, 
                    series_stop: video.number_of_series,
                    clients_id: auth.user.id,
                    anime_id: video.anime_id},
                ])
        
            })
        }
  return (
    <div>
        {loading&&(
            <Layout>
                <div>
                    <div style={{paddingLeft:'46.7%', background:'#242426', paddingTop:'15%', paddingBottom:'20%', marginBottom:'-5%'}}>
                    <Spinner style={{color:'white'}}/>
                    </div>
                    <Footer/>
                </div>
            </Layout>
        )}
        {!loading&&(
            <div onClick={handleStopVideo}>
            <Video loop >
            <source src={videoLink} type='video/mp4' />
            </Video>
            </div>
        )}
    </div>
  )
}
