import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import supabase from '../../Api/supabaseClient';
import {FaRegEdit} from 'react-icons/fa'
import {AiOutlineDelete} from 'react-icons/ai'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

class KeywordsCards extends Component {
    constructor(){
        super()
        this.navigation=this.navigation.bind(this);
        this.state={change:false, delete: false}
        this.state = {genres: []};
        this.state = {errors: [], error:'', data:''};
        this.state = {name_of_keywords: '', id: ''}
    }

    componentDidMount(){
        this.setState({name_of_keywords:this.props.keyword.name_of_keywords})
    }

    handleChange(e){
        e.preventDefault();
        this.navigation();
    }

    navigation(){
        this.setState({change:true})
        console.log(this.props.keyword.id_keywords)
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
        .from('keywords')
        .delete()
        .eq('id_keywords', this.props.keyword.id_keywords)
        console.log(data, error)
        this.setState({delete: false})
        window.location.reload();
    }
    
    async handleEdit(e){
        e.preventDefault();
        if(this.state.name_of_keywords===""){
            this.setState({data:'Заполните все поля'})
        }
        else{
            const { error } = await supabase
                .from('keywords')
                .update({ name_of_keywords: this.state.name_of_keywords})
                .eq('id_keywords',this.props.keyword.id_keywords)
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
                <Card style={{ width: '18rem' }} className='card'>
                    <ListGroup variant="flush">
                        <ListGroup.Item>{this.props.keyword.name_of_keywords}</ListGroup.Item>
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
                                        <div>
                                            <Form style={{marginLeft:'20px'}}>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Название жанра</Form.Label>
                                                    <Form.Control type="text" placeholder="Введите название ключевого слова" style={{width:'300px'}} onChange={(e) => {this.setState({name_of_keywords: e.target.value})}} value={this.state.name_of_keywords}/>
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
        </Card>
        );
    }
}

export default KeywordsCards;