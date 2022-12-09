import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import {FaRegEdit} from 'react-icons/fa'
import {AiOutlineDelete, AiFillFile, AiOutlineClose} from 'react-icons/ai'
import { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import {DefaultPlayer as Video} from 'react-html5video'
import 'react-html5video/dist/styles.css'
import supabase from '../../Api/supabaseClient';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { storage } from '../../Api/firebase';
import Alert from 'react-bootstrap/Alert';
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';


export const SeriesCards = ({series}) => {
    const [selectedAnime, setSelectesAnime] = useState('')
    const [series_code, setSeries_code] = useState('')
    const [name_of_series, setName_of_series] = useState('')
    const [season, setSeason] = useState('')
    const [number_of_series, setNumber_of_series] = useState('')
    const [series_description, setSeries_description] = useState('')
    const [link_to_the_video, setLink_to_the_video] = useState('')
    const [link_to_the_poster, setLink_to_the_poster] = useState('')
    const [anime_id, setAnime_id] = useState('')
    const [viewModule, setViewModule] = useState(false)
    const [editModule, setEditModule] = useState(false) 
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState('')
    const [progress_photo, setProgress_photo] = useState('')
    const [animeList, setAnimeList] = useState([])
    const [error, setError] = useState('')
    const [anime, setAnime] = useState([])
    const [deleteModule, setDeleteModule] = useState(false)
    useEffect(() => {
        handleViewInfo()
        handleViewAnimes()
        handleViewAnimeList()
    }, [])
    
    const handleViewAnimeList = async() =>{
        let { data: anime } = await supabase
        .from('anime')
        .select('*')
        setAnimeList(anime)
        setAnime(anime)
        //console.log(anime)
    }

    const handleViewInfo = () =>{
        setSeries_code(series.series_code)
        setName_of_series(series.name_of_series)
        setSeason(series.season)
        setNumber_of_series(series.number_of_series)
        setSeries_description(series.series_description)
        setLink_to_the_video(series.link_to_the_video)
        setLink_to_the_poster(series.link_to_the_poster)
    }

    const handleViewAnimes = async()=>{
        await supabase
        .from('anime')
        .select("anime_title")
        .eq('id_anime', series.anime_id)
        .then((data)=>{
            data.data.map((animes)=>{
                setAnime_id(animes.anime_title)
            })
        })
    }
    const handleViewImage = () => setViewModule(true)
    const handleEditModule = () => setEditModule(true)

    const handleClose = ()=>{
        setViewModule(false)
        setEditModule(false)
        setDeleteModule(false)
        setLink_to_the_poster(series.link_to_the_poster)
        setLink_to_the_video(series.link_to_the_video)
    }

        const handleEdit = async()=>{
                if(name_of_series===""||season===""||number_of_series===""||
        series_description===""||link_to_the_video===""||link_to_the_poster===""||
        anime_id==="")
        setError("Какое-то поле не заполнено")
    else{
        const t = []
        anime.map((an)=>{
        if(an.id_anime.toString()===selectedAnime)
            t.push(an.anime_title)
        })
        console.log(t)
    const storageRef = ref(storage, 'video/'+link_to_the_video.name);
    
    const uploadTask = uploadBytesResumable(storageRef, link_to_the_video);
    uploadTask.on('state_changed', 
    (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setProgress(progress)
    }, 
    (error) => {
        console.log(error)
    }, 
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        const storageReff = ref(storage, 'poster_series/'+link_to_the_poster.name);
    
        const uploadTaskk = uploadBytesResumable(storageReff, link_to_the_poster);
        uploadTaskk.on('state_changed', 
        (snapshot) => {
        const progressss = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress_photo(progressss)
        }, 
        (error) => {
            console.log(error)
        }, 
        () => {
            getDownloadURL(uploadTaskk.snapshot.ref).then(async(downloadURLphoto) => {
            setLoading(true)
            setSeries_code(t+season+'x'+number_of_series)
            const { dataa, error } = await supabase
            .from('series')
            .update(
                { series_code: series_code,
                name_of_series: name_of_series,
                season:season,
                number_of_series: number_of_series,
                series_description: series_description,
                link_to_the_video: downloadURL,
                link_to_the_poster: downloadURLphoto,
                anime_id: selectedAnime},
            ).eq('series_code', series_code)
            if(error)
                setError(error.message)
            
            setLoading(false)
            window.location.reload();
            setEditModule(false)
            })
        })
        })
    })
    }
}

const handleDelete = () => setDeleteModule(true)

const handleDeleteAnime = async() =>{
    const { data, error } = await supabase
    .from('series')
    .delete()
    .eq('series_code', series_code)
    window.location.reload();
    setDeleteModule(false)
}

  return (
        <>
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={series.link_to_the_poster} onClick={handleViewImage}/>
        <Card.Body>
            <Card.Title>{series.name_of_series}</Card.Title>
            <Card.Text>{series.series_description}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
        <ListGroup.Item>Сезон: {series.season}</ListGroup.Item>
        <ListGroup.Item>Cерия: {series.number_of_series}</ListGroup.Item>
        <ListGroup.Item>Аниме: {anime_id}</ListGroup.Item>
        </ListGroup>
        <Card.Body>
            <div style={{marginTop:'-10px', marginBottom:'-10px'}}>
            <Button style={{background:'transparent', borderColor:'transparent'}} onClick={handleDelete}><AiOutlineDelete style={{color:'#0D6EFD', fontSize:'27px'}}/></Button>
            <Button style={{background:'transparent', borderColor:'transparent'}} onClick={handleEditModule} variant="primary" className='changeBtn'><FaRegEdit style={{color:'#0D6EFD', fontSize:'25px', marginLeft:'55px'}}/></Button>
            </div>
        </Card.Body>
            <Modal show={viewModule} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Предпросмотр</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Video autoPlay loop>
                    <source src={series.link_to_the_video} type='video/mp4'/>
                </Video>
                </Modal.Body>
            </Modal>
            <Modal show={editModule} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Изменение информации</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {loading&&(
                <Spinner animation="border" variant="primary" style={{marginLeft:'47%', marginTop:'10%', marginBottom:'10%'}}/>
                )}
                {!loading&&(
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Наименование серии</Form.Label>
                    <Form.Control type="text" placeholder="Введите наименование серии" onChange={(e)=>setName_of_series(e.target.value)} value={name_of_series}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Сезон</Form.Label>
                    <Form.Control type="number" placeholder="Введите номер сезона" onChange={(e)=>setSeason(e.target.value)} value={season}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Серия</Form.Label>
                    <Form.Control type="number" placeholder="Введите номер серии" onChange={(e)=>setNumber_of_series(e.target.value)} value={number_of_series}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Описание серии</Form.Label>
                    <Form.Control type="text" placeholder="Введите описание серии" onChange={(e)=>setSeries_description(e.target.value)} value={series_description}/>
                </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Label>Ссылка на видео</Form.Label>
                    {!progress&&(
                    <Form.Control type="file" placeholder="Введите ссылку на серию" onChange={(e)=>setLink_to_the_video(e.target.files[0])} />
                    )}
                    {progress&&(
                    <ProgressBar now={progress}/>
                    )}
                    </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Ссылка на постер</Form.Label>
                    {!progress_photo&&(
                    <Form.Control type="file" placeholder="Введите ссылку на постер" onChange={(e)=>setLink_to_the_poster(e.target.files[0])} />
                    )}
                    {progress_photo&&(
                    <ProgressBar now={progress}/>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                        <Form.Label>Аниме</Form.Label>
                        <Form.Select onChange={(e)=>setSelectesAnime(e.target.value)}>
                            {animeList.map(anime=>
                                <option key={anime.id_anime} value={anime.id_anime}>{anime.anime_title}</option>
                            )}
                        </Form.Select>
                </Form.Group>
                <div>{error&& (
                <Alert variant="danger">
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>{error}</p>
                </Alert>
                )}</div>
                </Form>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleEdit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={deleteModule} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Удаление информации</Modal.Title>
            </Modal.Header>
            <Modal.Body>Уверены, что хотите удалить?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="danger" onClick={handleDeleteAnime}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
        </Card>
        </>
  )
}
