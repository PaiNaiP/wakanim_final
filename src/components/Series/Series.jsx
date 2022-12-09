import React, { useState } from 'react'
import Header from '../Header'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ViewSeries from './ViewSeries';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import supabase from '../../Api/supabaseClient';
import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {storage} from '../../Api/firebase'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const Series = () => {
  const [show, setShow] = useState(false);
  const [name_of_series, setName_of_series] = useState('')
  const [season, setSeason] = useState('')
  const [number_of_series, setNumber_of_series] = useState('')
  const [series_description, setSeries_description] = useState('')
  const [link_to_the_video, setLink_to_the_video] = useState('')
  const [link_to_the_poster, setLink_to_the_poster] = useState('')
  const [anime_id, setAnime_id] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [anime, setAnime] = useState([])
  const [selectedAnime, setSelectesAnime] = useState('')
  const [progress, setProgress] = useState(null)
  const [progress_photo, setProgress_photo] = useState(null)
  const [animeList, setAnimeList] = useState([])

  const navigate = useNavigate()
  useEffect(() => {
    handleViewAnime()
    if(localStorage.getItem('role')!=="Отдел контента")
      navigate('/signin')
      handleKeywordsInfo()
  }, [])

  const handleFilter = async(e) =>{
    if(e.target.value==='-'){
      await supabase
      .from('series')
      .select('*').then((data)=>{
        setAnimeList(data.data)
        setLoading(false)
      })
    }
    else{
      await supabase
      .from('series')
      .select("*")
      .eq('anime_id', e.target.value).then((data)=>{
        setAnimeList(data.data)
      })
    }
  }
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleViewAnime=async()=>{
    let { data: anime } = await supabase
    .from('anime')
    .select('*')
    setAnime_id(anime)
    setAnime(anime)
  }
  const AddSeries = async()=>{
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
  //let link = link_to_the_video.split(/(\\|\/)/g).pop()
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
          const { dataa, error } = await supabase
          .from('series')
          .insert([
            { series_code: t+season+'x'+number_of_series, 
            name_of_series: name_of_series,
            season:season,
            number_of_series: number_of_series,
            series_description: series_description,
            link_to_the_video: downloadURL,
            link_to_the_poster: downloadURLphoto,
            anime_id: selectedAnime},
          ])
          if(error)
            setError(error.message)
          setLoading(false)
          window.location.reload();
          setShow(false)
        })
      })
    })
  })
  }
  }

  const handleKeywordsInfo = async()=>{ 
    await supabase
    .from('series')
    .select('*').then((data)=>{
      setAnimeList(data.data)
      setLoading(false)
    })
}
  return (
    <div>
      <Header/>
        <Container style={{marginTop:'40px'}}>
            <Row>
                <Col sm={2}>
                    <Button onClick={handleShow}>Добавить серию</Button>
                    <Form.Group className="mb-3" style={{marginTop:'15px'}}>
                        <Form.Select onChange={(e)=>handleFilter(e)}>
                          <option value="-">-</option>
                            {anime_id.map(anime=>
                                <option key={anime.id_anime} value={anime.id_anime}>{anime.anime_title}</option>
                            )}
                        </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={10}>
                  {loading&&(
                    <Spinner animation="border" variant="primary" style={{marginLeft:'38%', marginTop:'10%'}}/>
                )}
                {!loading&&(
                  <div style={{display:'flex', flexWrap:'wrap'}}>
                    <ViewSeries series={animeList}/>
                  </div>
                )}
                </Col>
            </Row>
        </Container>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавление серии</Modal.Title>
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
              <div style={{display:'flex', marginLeft:'-15px'}}>
              <label className="custom-file-upload" style={{background:'#0d6efd', borderColor:'#0d6efd'}}>
              <input type="file" onChange={e=>setLink_to_the_video(e.target.files[0])}/>
              Выберите видео
              </label>
              <div style={{color:'black', maxWidth:'160px', marginLeft:'2.5rem'}}>{link_to_the_video.name}</div>
            </div>
            )}
            {progress&&(
              <ProgressBar now={progress}/>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ссылка на постер</Form.Label>
            {!progress_photo&&(
                <div style={{display:'flex', marginLeft:'-15px'}}>
                <label className="custom-file-upload" style={{background:'#0d6efd', borderColor:'#0d6efd'}}>
                <input type="file" onChange={e=>setLink_to_the_poster(e.target.files[0])}/>
                Выберите постер
                </label>
                <div style={{color:'black', maxWidth:'160px', marginLeft:'2.5rem'}}>{link_to_the_poster.name}</div>
              </div>
            )}
            {progress_photo&&(
              <ProgressBar now={progress}/>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
                <Form.Label>Аниме</Form.Label>
                <Form.Select onChange={(e)=>setSelectesAnime(e.target.value)}>
                    {anime_id.map(anime=>
                        <option key={anime.id_anime} value={anime.id_anime}>{anime.anime_title}</option>
                    )}
                </Form.Select>
          </Form.Group>
        </Form>
        )}
        <div>{error&& (
          <Alert variant="danger">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={AddSeries}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Series;
