import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Modal, Row, Spinner, Form, Table } from 'react-bootstrap'
import supabase from '../../Api/supabaseClient';
import { useAuth } from '../Client/auth';
import Header from '../Header'
import { RecomendationView } from './RecomendationView';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useNavigate } from 'react-router';

const Recomendation = () => {
    const auth = useAuth()
    const [anime, setAnime] = useState([])
    const [anime_id, setAnime_id] = useState('')
    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState([])
    const [client_id, setClient_id] = useState('')
    const [recomendation, setRecomendation] = useState('')
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const tableRef = useRef(null);
    const navigate = useNavigate()
    useEffect(() => {
        handleViewAnime()
        handleViewClients()
        handleViewRecomendation()
        if(localStorage.getItem('role')!=="Отдел рекламы")
                navigate('/signin')
    }, [])
    
    const handleViewAnime = async() =>{
        await supabase
        .from('anime')
        .select('*').then((data)=>{
            setAnime(data.data)
        })
    }

    const handleViewRecomendation = async() =>{
        await supabase
        .from('suggested_anime')
        .select('*').then(async(data)=>{
            setRecomendation(data.data)
            setLoading(false)
        })
    }

    const handleViewClients = async()=>{
        await supabase
        .from('clients')
        .select("*").then((data)=>{
            setClients(data.data)
        })
    }

    const handleAddRecommendation = async()=>{
        await supabase
        .from('suggested_anime')
        .insert([
            { clients_id: client_id, anime_id: anime_id, workers_id:  auth.user.id },
        ]).then((data)=>{
            setShow(false)
            window.location.reload()
        })
    }

  return (
    <div>
        <Header />
        <Container style={{marginTop:'40px'}}>
            <Row>
                <Col sm={2}>
                    <Button onClick={handleShow}>Добавить рекомендации</Button>
                    <DownloadTableExcel
                        filename="recomedation table"
                        sheet="recomendation"
                        currentTableRef={tableRef.current}
                    >

                    <Button style={{marginTop:'1rem', width:"12.2rem"}}> Export excel </Button>

                    </DownloadTableExcel>
                </Col>
                <Col sm={10}>
                {loading&&(
                    <Spinner animation="border" role="status" style={{marginLeft:'27rem',marginTop:'2rem'}}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                )}
                {!loading&&(
                    <Table ref={tableRef} striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Клиент</th>
                        <th>Рекомендованное аниме</th>
                        <th>Специалист</th>
                        </tr>
                    </thead>
                        <RecomendationView recomendation={recomendation}/>
                    </Table>
                )}
                </Col>
            </Row>
        </Container>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Добавление рекомендации</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Аниме</Form.Label>
                    <Form.Select onChange={(e)=>setAnime_id(e.target.value)}>
                        {anime.map(an=>
                            <option key={an.id_anime} value={an.id_anime}>{an.anime_title}</option>
                        )}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пользователь</Form.Label>
                    <Form.Select onChange={(e)=>setClient_id(e.target.value)}>
                        {clients.map(client=>
                            <option key={client.id_clients} value={client.id_clients}>{client.name}</option>
                        )}
                    </Form.Select>
                </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleAddRecommendation}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Recomendation;