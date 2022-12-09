import React, { useEffect, useState } from 'react'
import supabase from '../../Api/supabaseClient'
import Header from '../Header'
import '../App.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import ViewWorkers from './ViewWorkers';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs';
import { useAuth } from '../Client/auth';
import { useNavigate } from 'react-router';

const WorkersPage = () => {
    const auth= useAuth()
    const [id, setID] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone_number, setPhone_Number] = useState('')
    const [login, setLogin] = useState('')
    const [roles_id, setRoles_id] = useState('')
    const [error, setError] = useState('')
    const [data, setData] = useState('')
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [choise, setChoise] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        handleViewRoles()
        if(localStorage.getItem('role')!=="Отдел кадров")
                navigate('/signin')
    }, [])
    
    const handleViewRoles = async()=>{
        let { data: roles } = await supabase
        .from('roles')
        .select('*')
        setRoles(roles)
        setLoading(false)
    }
    
    const handleAdd=async(e)=>{
        e.preventDefault();
        setLoading(true)
        let ph_nm = phone_number.split('')
        let phone = '+7('+ph_nm[1]+ph_nm[2]+ph_nm[3]+')'+ph_nm[4]+ph_nm[5]+ph_nm[6]+'-'+ph_nm[7]+ph_nm[8]+'-'+ph_nm[9]+ph_nm[10]
        const hashedPassword = bcrypt.hashSync(password, 10);
        await supabase.auth.signUp({
                email: email,
                password: password,
        }).then(async(data)=>{
            const { error } = await supabase
        .from('workers')
        .insert([
            {
            id_workers: data.data.user.id,
            name: name, 
            surname: surname,
            lastname: lastname,
            email:  email,
            password:hashedPassword,
            phone_number: phone,
            login: login,
            roles_id: roles_id},
        ])
        if(error){
            setData(error.message)
        }
        else{
            
            setData(null)    
            setError('done')
            setChoise('')
            window.location.reload();
        }
        setLoading(false)
        })
        }
      
        const handleAddModule = async(e)=>{
        e.preventDefault()
        setChoise('add')
        }
      
        const handleClose= async(e)=>{
        e.preventDefault()
        setChoise('')
    }
  return (
        <div>
            <Header/>
            <Container style={{marginTop:'40px'}}>
                <Row>
                <Col sm={2}>
                    <Button onClick={(e)=>handleAddModule(e)}>Добавить работника</Button>
                </Col>
                <Col sm={10}>
                    <ViewWorkers/>
                </Col>
                </Row>
            </Container>
            {choise&&(
                <Modal show={choise}>
                <Modal.Header>
                <Modal.Title>Добавление работника</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display:'flex'}}>
                {loading&&(
                <Spinner animation="border" variant="primary" style={{marginLeft:'48%', marginTop:'10%', marginBottom:'10%'}}/>
                )}
                {!loading&&(
                <Form style={{margin:'0 auto'}}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control type="text" placeholder="Введите имя сотрудника" style={{width:'400px'}} onChange={(e) => {setName(e.target.value)}} value={name}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control type="text" placeholder="Введите фамилию сотрудника" style={{width:'400px'}} onChange={(e) => {setSurname(e.target.value)}} value={surname}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Отчество</Form.Label>
                        <Form.Control type="text" placeholder="Введите отчество сотрудника" style={{width:'400px'}} onChange={(e) => setLastname(e.target.value)} value={lastname}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Введите email сотрудника" style={{width:'400px'}} onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="text" placeholder="Введите пароль сотрудника" style={{width:'400px'}} onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Номер телефона</Form.Label>
                        <PhoneInput
                        countryCodeEditable='true'
                        style={{width:'400px'}}
                        country={'ru'}
                        value={phone_number}
                        onChange={e => setPhone_Number(e)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Логин</Form.Label>
                        <Form.Control type="text" placeholder="Введите логин сотрудника" style={{width:'400px'}} onChange={(e) => setLogin(e.target.value)} value={login}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Роль</Form.Label>
                    <Form.Select onChange={(e)=>setRoles_id(e.target.value)} style={{width:'400px'}}>
                        {roles.map(role=>
                            <option key={role.id_roles} value={role.id_roles}>{role.name_of_role}</option>
                        )}
                    </Form.Select>
                    </Form.Group>
                    <div>{data&& (
                    <Alert variant="danger">
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>{data}</p>
                    </Alert>
                    )}</div>
                    <div>{error&&(
                        <Alert variant="success">
                        <Alert.Heading>Привет как жизнь?</Alert.Heading>
                        <p>
                        Твоя запись добавлена
                        </p>
                    </Alert>
                    )}</div>
                    </Form>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={(e)=>handleClose(e)}>
                    Close
                </Button>
                <Button variant="primary" onClick={(e)=>handleAdd(e)}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
            )}
        </div>
  )
}

export default WorkersPage;