import React, { Component } from 'react'
import Header from '../Header'
import '../App.css'
import ViewGenres from './ViewGenres'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import supabase  from '../../Api/supabaseClient'
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from 'react-router';

class Genres extends Component {
  constructor(props){
    super (props) 
    this.state = {choise: '', loading:false};
    this.state={genres_title: ''};
    this.state={genres_discription: ''}
    this.state={error: ''}
    this.state={data:''}
  }

  componentDidMount(){
    if(localStorage.getItem('role')!=="Отдел контента")
    this.props.navigate('/signin')
  }
  handleClose(e){
    e.preventDefault();
    this.setState({choise: ''})
  }

  handleAddModule(e){
    e.preventDefault();
    this.setState({choise: 'add'})
  }

  async handleAddGenres(e){
    e.preventDefault()
    this.setState({loading:true})
    const { error } = await supabase
        .from('genres')
        .insert([
            { genres_title: this.state.genres_title, genres_description: this.state.genres_discription },
        ])
        if(error){
            this.setState({data:error.message})
        }
        else{
          window.location.reload();
          this.setState({choise: ''})
        }
        this.setState({loading:false})
  }

render() {
  return(
        <div>
          <Header/>
          <Container style={{marginTop:'40px'}}>
            <Row>
              <Col sm={2}>
                <Button onClick={(e)=>this.handleAddModule(e)}>Добавить жанр</Button>
              </Col>
              <Col sm={10} style={{marginLeft:'-40px'}}>
                <ViewGenres/>
              </Col>
            </Row>
          </Container>
          {this.state.choise&&(
            <Modal show={this.state.choise}>
              <Modal.Header>
                <Modal.Title>Добавление жанра</Modal.Title>
              </Modal.Header>
              {this.state.loading&&(
                <Spinner animation="border" variant="primary" style={{marginLeft:'47%', marginTop:'10%', marginBottom:'10%'}}/>
              )}
              {!this.state.loading&&(
                <Modal.Body style={{display:'flex'}}>
                  <Form style={{margin:'0 auto'}}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Название жанра</Form.Label>
                      <Form.Control type="text" placeholder="Введите название жанра" style={{width:'300px'}} onChange={(e) => {this.setState({genres_title: e.target.value})}} value={this.state.genres_title}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Описание жанра</Form.Label>
                      <Form.Control type="text" placeholder="Введите описание жанра" style={{width:'300px'}} onChange={(e) => {this.setState({genres_discription: e.target.value})}} value={this.state.genres_discription}/>
                    </Form.Group>
                    <div>{this.state.data&& (
                      <Alert variant="danger">
                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                        <p>{this.state.data}</p>
                      </Alert>
                    )}</div>
                    <div>
                      {this.state.error&&(
                        <Alert variant="success">
                          <Alert.Heading>Привет как жизнь?</Alert.Heading>
                          <p>Твоя запись добавлена</p>
                        </Alert>
                      )}</div>
                    </Form>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button variant="secondary" onClick={(e)=>this.handleClose(e)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={(e)=>this.handleAddGenres(e)}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
        </div>
      )
    }
  }

  export function GenresWithRouter(props){
    const navigate = useNavigate()
    return(<Genres navigate={navigate}></Genres>)
  }

  export default Genres
