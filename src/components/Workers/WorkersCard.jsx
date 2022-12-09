import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import supabase from '../../Api/supabaseClient';
import Spinner from 'react-bootstrap/Spinner';
import {FaRegEdit} from 'react-icons/fa'
import {AiOutlineDelete} from 'react-icons/ai'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs';

class WorkersCard extends Component {
    constructor(props){
        super (props) 
        this.state = {name:'', surname:'', lastname:'',
        email:'', password:'', phone_number:'',
        login:'', role:'', roles:''};
        this.state = {errors: [], data:[]};
        this.state = {loading: true}
    }
    componentDidMount(){
        this.handleRoleId()
        this.setState({name:this.props.worker.name})
        this.setState({surname:this.props.worker.surname})
        this.setState({lastname:this.props.worker.lastname})
        this.setState({email:this.props.worker.email})
        this.setState({password:this.props.worker.password})
        this.setState({phone_number:this.props.worker.phone_number})
        this.setState({login:this.props.worker.login})
        this.setState({roles:this.props.worker.roles_id})
        console.log(this.props.worker.roles_id)
    }

    async handleRoleId(){
        let { data: roles} = await supabase
        .from('roles')
        .select("*")
        .eq('id_roles', this.props.worker.roles_id)
        this.setState({roles: roles[0].name_of_role})
        this.setState({loading:false, change:false})
    }
    handleChange(e){
        e.preventDefault();
        this.navigation();
    }

    async navigation(){
        this.setState({loading:true})  
        let { data: roles } = await supabase
        .from('roles')
        .select('*')
        this.setState({role:roles})
        this.setState({loading:false})
        this.setState({change:true})   
    }

    handleDeleteModule(){
        this.setState({delete: true})
    }

    handleClose(e){
        e.preventDefault();
        this.setState({change:false})
        this.setState({delete: false})
    }

    async handleDelete(e){
        e.preventDefault();
        const { data, error } = await supabase
        .from('workers')
        .delete()
        .eq('id_workers', this.props.worker.id_workers)
        console.log(data, error)
        this.setState({delete: false})
        window.location.reload();
    }
    
    async handleEdit(e){
        e.preventDefault();
        if(this.state.name===""||this.state.surname===""||
            this.state.lastname===""||this.state.email===""||
            this.state.password===""||this.state.phone_number===""||
            this.state.login===""||this.state.roles_id===""){
            this.setState({data:'Заполните все поля'})
        }
        else{
                let ph_nm = this.state.phone_number.split('')
                let phone = '+7('+ph_nm[1]+ph_nm[2]+ph_nm[3]+')'+ph_nm[4]+ph_nm[5]+ph_nm[6]+'-'+ph_nm[7]+ph_nm[8]+'-'+ph_nm[9]+ph_nm[10]
                if(ph_nm[0]==="+")
                phone=this.state.phone_number
                console.log(phone)
                const hashedPassword = bcrypt.hashSync(this.state.password, 10);
                const { error } = await supabase
                .from('workers')
                .update({ 
                    name: this.state.name, 
                    surname: this.state.surname,
                    lastname: this.state.lastname,
                    email:this.state.email,
                    password:hashedPassword,
                    phone_number: phone,
                    login: this.state.login,
                    roles_id:this.state.roles_id
                })
                .eq('id_workers',this.props.worker.id_workers)
                if(error){
                    this.setState({data:error.message})
                }
                else{
                    this.setState({error:'Гуд'})
                    this.setState({change:false})
                    window.location.reload();
                }
        }
    }
    render() {
        return (
            <>
                <Card style={{ width: '18rem' }}>
                    {this.state.loading&&(
                        <Spinner animation="border" variant="primary" style={{marginLeft:'48%', marginTop:'10%', marginBottom:'10%'}}/>
                    )}
                    {!this.state.loading&&(
                        <ListGroup variant="flush">
                            <ListGroup.Item>{this.props.worker.name}</ListGroup.Item>
                            <ListGroup.Item>{this.props.worker.surname}</ListGroup.Item>
                            <ListGroup.Item>{this.props.worker.lastname}</ListGroup.Item>
                            <ListGroup.Item>{this.props.worker.email}</ListGroup.Item>
                            <ListGroup.Item>{this.props.worker.phone_number}</ListGroup.Item>
                            <ListGroup.Item>{this.props.worker.login}</ListGroup.Item>
                            {this.state.loading&&(
                                <Spinner animation="border" variant="primary" style={{marginLeft:'45%', marginTop:'7%'}}/>
                            )}
                            {!this.state.loading&&(
                                <ListGroup.Item>{this.state.roles}</ListGroup.Item>
                            )}
                            <div className="cont-buttons-card">
                                <div style={{alignItems:'end', display:'flex', bottom:0, position: 'absolute'}}>
                                    <Button style={{background:'transparent', borderColor:'transparent'}} onClick={(e)=>this.handleDeleteModule(e)}><AiOutlineDelete style={{color:'#0D6EFD', fontSize:'25px'}}/></Button>
                                    <div>
                                        {this.state.delete&&(
                                            <Modal show={this.state.delete}>
                                                <Modal.Header>
                                                    <Modal.Title>Удаление информации</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>Уверены, что хотите удалить?</Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={(e)=>this.handleClose(e)}>
                                                        Close
                                                    </Button>
                                                    <Button variant="danger" onClick={(e)=>this.handleDelete(e)}>
                                                        Delete
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        )}
                                    </div>
                                <Button style={{background:'transparent', borderColor:'transparent'}} variant="primary" className='changeBtn' onClick={(e)=>this.handleChange(e)}><FaRegEdit style={{color:'#0D6EFD', fontSize:'25px', marginLeft:'80px'}}/></Button>
                            </div>
                            {this.state.change&&(
                                <Modal show={this.state.change}>
                                    <Modal.Header>
                                        <Modal.Title>Изменение информации</Modal.Title>
                                    </Modal.Header>
                                        <Modal.Body>
                                            <div style={{display:'flex'}}>
                                                {this.state.loading&&(
                                                    <Spinner animation="border" variant="primary" style={{marginLeft:'45%', marginTop:'7%'}}/>
                                                )}
                                                {!this.state.loading&&(
                                                    <Form style={{margin:'0 auto'}}>
                                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                                            <Form.Label>Имя</Form.Label>
                                                            <Form.Control type="text" placeholder="Введите имя сотрудника" style={{width:'400px'}} onChange={(e) => {this.setState({name: e.target.value})}} value={this.state.name}/>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Фамилия</Form.Label>
                                                            <Form.Control type="text" placeholder="Введите фамилию сотрудника" style={{width:'400px'}} onChange={(e) => {this.setState({surname: e.target.value})}} value={this.state.surname}/>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Отчество</Form.Label>
                                                            <Form.Control type="text" placeholder="Введите отчество сотрудника" style={{width:'400px'}} onChange={(e) => {this.setState({lastname: e.target.value})}} value={this.state.lastname}/>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control type="email" placeholder="Введите email сотрудника" style={{width:'400px'}} onChange={(e) => {this.setState({email: e.target.value})}} value={this.state.email}/>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Пароль</Form.Label>
                                                            <Form.Control type="text" placeholder="Введите пароль сотрудника" style={{width:'400px'}} onChange={(e) => {this.setState({password: e.target.value})}} value={this.state.password}/>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Номер телефона</Form.Label>
                                                            <PhoneInput
                                                            countryCodeEditable='true'
                                                            style={{width:'300px'}}
                                                            country={'ru'}
                                                            value={this.state.phone_number}
                                                            onChange={phone_number => this.setState({ phone_number })}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Логин</Form.Label>
                                                            <Form.Control type="text" placeholder="Введите логин сотрудника" style={{width:'400px'}} onChange={(e) => {this.setState({login: e.target.value})}} value={this.state.login}/>
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                                            <Form.Label>Роль</Form.Label>
                                                            <Form.Select onChange={(e)=>this.setState({roles_id:(e.target.value)})} style={{width:'400px'}}>
                                                                {this.state.role.map(roless=>
                                                                    <option key={roless.id_roles} value={roless.id_roles}>{roless.name_of_role}</option>
                                                                )}
                                                            </Form.Select>
                                                        </Form.Group>
                                                        <div>
                                                            {this.state.data&& (
                                                                <Alert variant="danger">
                                                                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                                                                    <p>{this.state.data}</p>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                    </Form>
                                                )}
                                            </div>
                                        </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={(e)=>this.handleClose(e)}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit" onClick={(e)=>this.handleEdit(e)}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )}
                        </div>
                    </ListGroup>
                )}
            </Card>
        </>
        );
    }
}

export default WorkersCard;