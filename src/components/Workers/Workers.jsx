import React, { Component } from 'react';
import Header from '../Header'
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
import ViewWorkers from './ViewWorkers';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs';

class Workers extends Component {
  constructor(props){
    super (props) 
    this.state = {choise: ''};
    this.state={id: '', name:'', surname:'', lastname:'', 
        email:'', password:'', phone_number:'', login:'', roles_id:''};
    this.state={error: ''}
    this.state={data:''}
    this.state={roles:{}}
    this.state = {loading: true}
}
componentDidMount(){
  this.handleViewRoles()
}

async handleViewRoles(){
  let { data: roles } = await supabase
  .from('roles')
  .select('*')
  this.setState({roles:roles})
  this.setState({loading:false})
  console.log(this.state.roles)
}

async handleAdd(e){
  e.preventDefault();
  this.setState({loading:true})
  let ph_nm = this.state.phone_number.split('')
  let phone = '+7('+ph_nm[1]+ph_nm[2]+ph_nm[3]+')'+ph_nm[4]+ph_nm[5]+ph_nm[6]+'-'+ph_nm[7]+ph_nm[8]+'-'+ph_nm[9]+ph_nm[10]
  const hashedPassword = bcrypt.hashSync(this.state.password, 10);
  const { error } = await supabase
  .from('workers')
  .insert([
      { name: this.state.name, 
      surname: this.state.surname,
      lastname: this.state.lastname,
      email:this.state.email,
      password:hashedPassword,
      phone_number: phone,
      login: this.state.login,
      roles_id:this.state.roles_id},
  ])
  if(error){
      this.setState({data:error.message})
  }
  else{
    await supabase.auth.signUp({
      email: this.state.email,
      password: this.state.password,
  })
      this.setState({data:null})
      this.setState({error: 'done'})
      this.setState({choise:''})
      window.location.reload();
  }
// }

this.setState({loading:false})
}

handleAddModule(e){
  e.preventDefault()
  this.setState({choise:'add'})
}

handleClose(e){
  e.preventDefault()
  this.setState({choise:''})
}
  render() {
    return (
        <div>
          <Header/>
          <Container style={{marginTop:'40px'}}>
            <Row>
              <Col sm={2}>
                <Button onClick={(e)=>this.handleAddModule(e)}>Добавить работника</Button>
              </Col>
              <Col sm={10}>
                <ViewWorkers/>
              </Col>
            </Row>
          </Container>
          {this.state.choise&&(
            <Modal show={this.state.choise}>
            <Modal.Header>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{display:'flex'}}>
            {this.state.loading&&(
              <Spinner animation="border" variant="primary" style={{marginLeft:'48%', marginTop:'10%', marginBottom:'10%'}}/>
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
                    style={{width:'400px'}}
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
                    {this.state.roles.map(role=>
                        <option key={role.id_roles} value={role.id_roles}>{role.name_of_role}</option>
                    )}
                </Form.Select>
                </Form.Group>
                <div>{this.state.data&& (
                <Alert variant="danger">
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>{this.state.data}</p>
                </Alert>
                )}</div>
                <div>{this.state.error&&(
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
              <Button variant="secondary" onClick={(e)=>this.handleClose(e)}>
                Close
              </Button>
              <Button variant="primary" onClick={(e)=>this.handleAdd(e)}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          )}
        </div>
    )
  }
}


export default Workers;