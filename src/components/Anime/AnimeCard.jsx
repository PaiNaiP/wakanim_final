import React from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import supabase from '../../Api/supabaseClient';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import {FaRegEdit} from 'react-icons/fa'
import {AiOutlineDelete} from 'react-icons/ai'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { GenresCards } from './GenresCards';
import { KeywordsCards } from './KeywordsCards';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../Api/firebase';

export const AnimeCard = (animes) => {
    //console.log(animes.animes)
    const [genres, setGenres] = useState([])
    const [keywords, setKeywords] = useState([])
    const [deleteModule, setDeleteModule]= useState(false)
    const [editModule, setEditModule] = useState(false)
    const [infoModule, setInfoModule] = useState(false)
    const [anime_title, setAnime_title] = useState('')
    const [anime_description, setAnime_description] = useState('')
    const [age_limit, setAge_limit] = useState('')
    const [release_date, setRelease_date] = useState('')
    const [original_name, setOriginal_name] = useState('')
    const [copyright, setCopyright] = useState('')
    const [studia, setStudia] = useState('')
    const [direct, setDirect] = useState('')
    const [link_to_poster, setLink_to_poster] = useState('')
    const [thisDate, setThisDate] = useState('')
    const [error, setError] = useState('')
    const [genresById, setGenresById] =useState([])
    const [keywordsById, setKeywordsById] =useState([])

//TODO:Date now
    useEffect(() => {
        handleViewGenres()
        setAnime_title(animes.animes.anime_title)
        setAnime_description(animes.animes.anime_description)
        setAge_limit(animes.animes.age_limit)
        setRelease_date(animes.animes.release_date)
        setOriginal_name(animes.animes.original_name)
        setCopyright(animes.animes.copyright)
        setStudia(animes.animes.studia)
        setDirect(animes.animes.direct)
        setLink_to_poster(animes.animes.link_to_poster)
        handleViewKeywords()
        handleViewKeyword()
        handleViewGenre()
    }, [])
    
    const handleDelete = (e)=>setDeleteModule(true)
    const handleEdit = (e)=>setEditModule(true)
    const handleClose = () => {
        setDeleteModule(false);
        setEditModule(false)
        setInfoModule(false)
    }
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

    const handleViewGenres= async()=>{
        let { data: animegenres } = await supabase
        .from('animegenres')
        .select("genres_id")
        .eq('anime_id', animes.animes.id_anime) 
        setGenresById(animegenres)
    }
    const handleViewKeywords = async()=>{
        let { data: animekeywords } = await supabase
        .from('animekeywords')
        .select("keywords_id")
        .eq('anime_id', animes.animes.id_anime)
        setKeywordsById(animekeywords) 
    }

    const handleViewKeyword = async() => {
        let {data} = await supabase
        .from('keywords')
        .select('*')
        setKeywords(data)
    }


    const handleViewGenre = async()=>{
        let { data} = await supabase
        .from('genres')
        .select('*')
        setGenres(data)
    }

    const handleUpdateAnime = async()=>{
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
        .update([
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
        ]).eq('id_anime', animes.animes.id_anime)
        .then(async()=>{
            await supabase
            .from('animegenres')
            .delete()
            .eq('anime_id', animes.animes.id_anime)
            await supabase
            .from('animekeywords')
            .delete()
            .eq('anime_id', animes.animes.id_anime)
                for(const gen of m)
                {
                    const { error } = await supabase
                    .from('animegenres')
                    .insert([
                        { genres_id: gen, anime_id: animes.animes.id_anime },
                    ])
                    console.log(error)
                }
                for(const key of n)
                {
                    const { error } = await supabase
                    .from('animekeywords')
                    .insert([
                        { keywords_id: key, anime_id: animes.animes.id_anime },
                    ])
                    console.log(error)
                }
                window.location.reload();
                setEditModule(false)
    })
        })
})
    }
}
    
const handleDeleteAnime = async()=>{
    await supabase
            .from('animegenres')
            .delete()
            .eq('anime_id', animes.animes.id_anime)
            await supabase
            .from('animekeywords')
            .delete()
            .eq('anime_id', animes.animes.id_anime)
            await supabase
            .from('anime')
            .delete()
            .eq('id_anime', animes.animes.id_anime)
        window.location.reload();
        setDeleteModule(false)
}

const handleViewAnime = () =>setInfoModule(true)
  return (
        <>
        <Card style={{ width: '18rem' }}>
        <Card.Img onClick={handleViewAnime} variant="top"  src={animes.animes.link_to_poster} />
        <Card.Body>
            <Card.Title>{animes.animes.anime_title}</Card.Title>
            <Card.Text style={{whiteSpace:'nowrap', overflow:'hidden',
        textOverflow:'ellipsis'}}>{animes.animes.anime_description}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
            <ListGroup.Item>{animes.animes.age_limit}+</ListGroup.Item>
            <ListGroup.Item style={{display:'flex'}}>
                <GenresCards style={{display:'flex', margin:'0'}} genres={genresById}/>
            </ListGroup.Item>
            <ListGroup.Item style={{display:'flex'}}>
            <div style={{display:'flex', maxWidth:'300px',flexWrap: 'wrap', margin:'0 auto'}}>
            <KeywordsCards style={{display:'flex',  margin:'0', width:'200px'}} keywords={keywordsById}/>
            </div>
            </ListGroup.Item>
        </ListGroup>
        <Card.Body>
            <div style={{marginTop:'-10px', marginBottom:'-10px'}}>
            <Button style={{background:'transparent', borderColor:'transparent'}} onClick={(e)=>{handleDelete(e)}}><AiOutlineDelete style={{color:'#0D6EFD', fontSize:'27px'}}/></Button>
            <Button style={{background:'transparent', borderColor:'transparent'}} variant="primary" className='changeBtn' onClick={(e)=>{handleEdit(e)}}><FaRegEdit style={{color:'#0D6EFD', fontSize:'25px', marginLeft:'55px'}}/></Button>
            </div>
        </Card.Body>
        </Card>
        <Modal show={editModule} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Изменение информации</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                            </div>
                        </Form.Group>
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
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
            <Button variant="primary" onClick={handleUpdateAnime}>
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
        <Modal size="lg" show={infoModule} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Изменение информации</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div style={{display:'flex'}}>
            <img src={'https://eldtvxgjdhenbivgrzhz.supabase.co/storage/v1/object/public/posteranime/'+animes.animes.link_to_poster} style={{width:'350px', maxHeight:'500px'}} alt="" />
            <div style={{margin:'10px'}}>
            <h1>{anime_title}</h1>
            <div>{anime_description}</div>
            <br/>
            <p>Возрастное ограничение: {age_limit}+</p>
            <p>Дата выхода: {release_date}</p>
            <p>Оргигинальное название: {original_name}</p>
            <p>Авторские права: {copyright}</p>
            <p>Студия: {studia}</p>
            <p>Режиссёр: {direct}</p>
            <p>Жанры:</p>
            <div style={{display:'flex', maxWidth:'500px',flexWrap: 'wrap', margin:'0 auto'}}>
            <GenresCards style={{display:'flex', margin:'0'}} genres={genresById}/>
            </div>
            <p>Ключевые слова:</p>
            <div style={{display:'flex', maxWidth:'500px',flexWrap: 'wrap', margin:'0 auto'}}>
            <KeywordsCards  keywords={keywordsById}/>
            </div>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
        </>
  )
}
