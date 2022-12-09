import { Spinner } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import supabase from '../../Api/supabaseClient'
import { Layout } from '../Layout'
import { useAuth } from './auth'
import { FavoriteAnimeList } from './FavoriteAnimeList'
import { Footer } from './Footer'

export const FavoritePage = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const [anime, setAnime] = useState([])
    const [loading, setLoading] = useState(true)
    const [nothing, setNothing] = useState(false)

    useEffect(() => {
        if(!auth.user)
            navigate('/signin')
    }, [])
    
    
    setTimeout(() => {
        handleViewAnimeList()
    }, 1000);

    const handleViewAnimeList = async() =>{
        if(anime.length===0){
            await supabase
            .from('favorites_anime')
            .select("*")
            .eq('clients_id', auth.user.id).then((data)=>{
                setAnime(data.data)
                setLoading(false)
            })
        }
    }
  return (
    <Layout>
        <div style={{background:'#1f1f21'}}>
            {loading&&(
                <div style={{color:'white', marginLeft:'46.7%', paddingTop:'15%', paddingBottom:'17%', marginBottom:'-5rem'}}>
                <Spinner />
                </div>
            )}
            {!loading&&(
                <div>
                {anime.length===0&&(
                    <div style={{paddingTop:'12%', paddingBottom:'20%', marginBottom:'-5rem'}}>
                        <h1 style={{color:'white', fontSize:'50px', fontWeight:'500', marginLeft:'20%'}}>Тут пусто, добавьте аниме в избранное</h1>
                    </div>
                )}
                {anime.length!==0&&(
                    <div style={{display:'flex', paddingBottom:'5rem', marginBottom:'-5%'}}>
                    <FavoriteAnimeList animeList={anime}/>
                    </div>
                )}
                </div>
            )}
        </div>
        <Footer/>
    </Layout>
  )
}
