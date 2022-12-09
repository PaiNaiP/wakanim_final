import React from 'react'
import { useState } from 'react'
import Header from '../Header';
import '../App.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import supabase  from '../../Api/supabaseClient'
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import ViewAnime from './ViewAnime';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../Api/firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
const Animes = () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading]=useState(false)
    const [anime_title, setAnime_title] = useState('')
    const [anime_description, setAnime_description] = useState('')
    const [age_limit, setAge_limit] = useState('')
    const [release_date, setRelease_date] = useState('')
    const [original_name, setOriginal_name] = useState('')
    const [copyright, setCopyright] = useState('')
    const [studia, setStudia] = useState('')
    const [direct, setDirect] = useState('')
    const [link_to_poster, setLink_to_poster] = useState('')
    const [genres, setGenres] = useState([])
    const [keywords, setKeywords] = useState([])
    const [thisDate, setThisDate] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()
    useEffect(() => {
        handleViewKeywords()
        handleViewGenres()
        handleMaxDate()
            if(localStorage.getItem('role')!=="Отдел контента")
                navigate('/signin')
    },[])
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const m = []
    const n =[]
    const handleAddGenres = (e) =>{
        if(m.includes(e.target.value)){
            const index = m.indexOf(e.target.value)
            if(index !== -1)
                m.splice(index, 1)
        }
        else
        m.push(e.target.value)

        console.log(m)
    }
    const handleAddKeywords = (e) =>{
        if(n.includes(e.target.value)){
            const index = n.indexOf(e.target.value)
            if(index !== -1)
                n.splice(index, 1)
        }
        else
        n.push(e.target.value)

        console.log(n)
    }

    const handleMaxDate = () =>{
        const today = new Date();
        const dd = today.getDate()
        var mm = today.getMonth() + 1; 
        var yyyy = today.getFullYear();
        setThisDate(yyyy+"-"+mm+"-"+dd)
    }

    const handleViewKeywords = async() => {
        let {data} = await supabase
        .from('keywords')
        .select('*')
        setKeywords(data)
    }

    const handleViewGenres = async()=>{
        let { data} = await supabase
        .from('genres')
        .select('*')
        setGenres(data)
    }

    const handleAddAnime = async()=>{
        setLoading(true)
        if(anime_title===""||anime_description===""||age_limit===""||
        release_date===""||original_name===""||copyright===""||studia===""||
        direct===""||link_to_poster===""||m===""||n==="")
            setError("Какое-то поле не заполнено")
        else{
            const storageRef = ref(storage, 'poster/'+link_to_poster.name);
  
            const uploadTask = uploadBytesResumable(storageRef, link_to_poster);
            uploadTask.on('state_changed', 
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress)
            }, 
            (error) => {
                console.log(error)
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                await supabase
                .from('anime')
                .insert([
            {   anime_title: anime_title, 
                anime_description: anime_description,
                age_limit: age_limit,
                release_date: release_date,
                original_name: original_name,
                copyright:copyright,
                studia:studia,
                direct: direct,
                link_to_poster:downloadURL
            },
        ]).then(async(data)=>{
            let { data: anime } = await supabase
            .from('anime')
            .select("id_anime")
            .eq('anime_title', anime_title)
            let animes= anime[0].id_anime
                for(const gen of m)
                {
                    const {error } = await supabase
                    .from('animegenres')
                    .insert([
                        { genres_id: gen, anime_id: animes },
                    ])
                    console.log(error)
                }
                for(const key of n)
                {
                    const { error } = await supabase
                    .from('animekeywords')
                    .insert([
                        { keywords_id: key, anime_id: animes },
                    ])
                    console.log(error)
                }
                if (data)
                    setError(data)
                })
                window.location.reload();
                setLoading(false)
                setShow(false)
                })
            })
        }
}


    return (
        <div>
        <Header/>
        <Container style={{marginTop:'40px'}}>
            <Row>
                <Col sm={2}>
                    <Button onClick={handleShow}>Добавить аниме</Button>
                </Col>
                <Col sm={10}>
                    <ViewAnime/>
                </Col>
            </Row>
        </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление аниме</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading&&(
                        <Spinner animation="border" variant="primary" style={{marginLeft:'47%', marginTop:'10%', marginBottom:'10%'}}/>
                    )}
                    {!loading&&(
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Наименование аниме</Form.Label>
                        <Form.Control type="text" placeholder="Добавить название аниме" onChange={(e)=>{setAnime_title(e.target.value)}} value={anime_title}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Описание аниме</Form.Label>
                            <Form.Control type="text" placeholder="Введите описание аниме" onChange={(e) => {setAnime_description(e.target.value)}} value={anime_description}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Возрастное ограничение</Form.Label>
                            <Form.Select aria-label="Default select example" onChange={(e) => {setAge_limit(e.target.value)}} value={age_limit}>
                                <option value="0">0+</option>
                                <option value="6">6+</option>
                                <option value="12" selected>12+</option>
                                <option value="16">16+</option>
                                <option value="18">18+</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Дата выхода аниме</Form.Label>
                            <Form.Control min='2018-11-02' max={thisDate} type="date" placeholder="Введите дату выхода аниме" onChange={(e) => {setRelease_date(e.target.value)}} value={release_date}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Оригинальное название</Form.Label>
                            <Form.Control type="text" placeholder="Введите оригинальное название аниме" onChange={(e) => {setOriginal_name(e.target.value)}} value={original_name}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Авторские права</Form.Label>
                            <Form.Control type="text" placeholder="Введите авторские права" onChange={(e) => {setCopyright(e.target.value)}} value={copyright}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Студия</Form.Label>
                            <Form.Control type="text" placeholder="Введите студию" onChange={(e) => {setStudia(e.target.value)}} value={studia}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Режиссёр</Form.Label>
                            <Form.Control type="text" placeholder="Введите режиссёра" onChange={(e) => {setDirect(e.target.value)}} value={direct}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Постер</Form.Label>
                            <div style={{display:'flex', marginLeft:'-15px'}}>
                            <label className="custom-file-upload" style={{background:'#0d6efd', borderColor:'#0d6efd'}}>
                            <input type="file" onChange={e=>setLink_to_poster(e.target.files[0])}/>
                            Выберите постер
                            </label>
                            <div style={{color:'black', maxWidth:'160px', marginLeft:'2.5rem'}}>{link_to_poster.name}</div>
                        </div>                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Жанры</Form.Label>
                            {genres.map(genre=>
                                <Form.Check type="checkbox" value={genre.id_genres} label={genre.genres_title} onChange={(e)=>{handleAddGenres(e)}}/> 
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Ключевые слова</Form.Label>
                            {keywords.map(keyword=>
                                <Form.Check type="checkbox" value={keyword.id_keywords} label={keyword.name_of_keywords} onChange={(e)=>{handleAddKeywords(e)}}/> 
                            )}
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
                    <Button variant="primary" onClick={handleAddAnime}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default Animes;