import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import supabase from '../../Api/supabaseClient'

export const RecomendationCard = ({recomendation}) => {
    const [client, setClient] = useState('')
    const [anime, setAnime] = useState('')
    const [worker, setWorker] = useState('')

    useEffect(() => {
        handleViewRecomendationClient()
        handleViewRecomendationAnime()
        handleViewRecomendationWorker()
    }, [])
    
    const handleViewRecomendationClient = async() =>{
        await supabase
        .from('clients')
        .select("name")
        .eq('id_clients', recomendation.clients_id).then((data)=>{
            setClient(data.data[0].name)
        })
    }

    const handleViewRecomendationAnime = async()=>{
        await supabase
        .from('anime')
        .select("anime_title")
        .eq('id_anime', recomendation.anime_id).then((data)=>{
            setAnime(data.data[0].anime_title)
        })
    }

    const handleViewRecomendationWorker = async() =>{
        await supabase
        .from('workers')
        .select("*")
        .eq('id_workers', recomendation.workers_id).then((data)=>{
            var fullFIO = data.data[0].surname+' '+data.data[0].name+' '+data.data[0].lastname;
            var t = fullFIO.split (' ');
            var shortFIO = t [0] + ' ' + t [1].charAt (0) + '. ' + t [2].charAt (0) + '.';
            setWorker(shortFIO)
        })
    }

    const handleDeleteRecomendation = async()=>{
        await supabase
        .from('suggested_anime')
        .delete()
        .eq('id_suggested_anime', recomendation.id_suggested_anime).then(()=>{
            window.location.reload()
        })
    }

  return (
    <tbody>
    <tr key={recomendation.id_suggested_anime}>
        <td>{recomendation.id_suggested_anime}</td>
        <td>{client}</td>
        <td>{anime}</td>
        <td>{worker}</td>
        <td><Button variant="primary" onClick={handleDeleteRecomendation}>Удалить</Button></td>
    </tr>
    </tbody>
  )
}
