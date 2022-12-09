import React from 'react'
import { useState } from 'react'
import { useAuth } from './auth'
import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {Alert, AlertIcon, AlertTitle, AlertDescription, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
ModalBody, ModalFooter } from '@chakra-ui/react'
import supabase from '../../Api/supabaseClient'

export const SignIn = () => {
    const navigate = useNavigate();
    const auth = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const handleSignIn = async(e)=>{
        e.preventDefault()
        await auth.Login(email, password).then(async(SignIn)=>{
            if(SignIn===null){
                await supabase
                .from('workers')
                .select("*")
                .eq('email', email).then(async(data)=>{
                    try {
                        await supabase
                        .from('roles')
                        .select("*")
                        .eq('id_roles', data.data[0].roles_id).then((role)=>{
                            if(role.data[0].name_of_role==='Отдел кадров'){
                                navigate('/workers')
                            }
                            else if(role.data[0].name_of_role==='Отдел контента'){
                                navigate('/anime')
                            }
                            else if(role.data[0].name_of_role==='Отдел рекламы'){
                                navigate('/recomendation')
                            }
                            else if(role.data[0].name_of_role==='Отдел продаж'){
                                navigate('/checks')
                            }
                            else if(role.data[0].name_of_role==='Админ бд'){
                                navigate('/workers')
                            }
                        }).catch(()=>{
                            navigate('/')
                        })
                    } catch (error) {
                        navigate('/')
                    }
                })
            }
            else{
                setMessage(SignIn.message)
            }
            setEmail("")
        })
        
    }
  return (
    <div style={{background:'#161617', width:'100%', height:'100%', display:'flex'}}>
        <div style={{margin:'0 auto', marginTop:'6%', marginBottom:'2%', paddingBottom:'0px'}}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" style={{width:'20rem', marginLeft:'20px'}}/>
        <div style={{margin:'0 auto', background:'#19191B', marginBottom:'26.25%', padding:'29px', borderRadius:'15px', marginTop:'2rem'}} className="themeSignIn">
        <h1 style={{color:'#FFFFFF', textAlign:'center', fontSize:'40px', fontWeight:'500'}}>Авторизация</h1>
        {message&&(
        <Alert status='error' style={{marginTop:'20px', marginBotton:'-20px'}}>
            <AlertIcon />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
        )}
        <div style={{margin:'15px', marginTop:'40px'}}>
            <Input type="email" placeholder='email' className='inputSign' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'17rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
        </div>
        <div style={{margin:'15px', marginTop:'40px'}}>
            <Input type="password" placeholder='пароль' className='inputSign' value={password} onChange={e=>setPassword(e.target.value)} style={{width:'17rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
        </div>
        <div style={{width:'100%', display:'flex', marginTop:'30px'}}>
        <div style={{wordWrap:'break-word', margin:'0 auto', width:'100%'}}>
        <Button style={{margin:'0 auto', background:'#202022', color:'white', width:'12rem', marginLeft:'3rem'}} onClick={handleSignIn}>Войти</Button>
        <br/>
        <div style={{marginLeft:'1.1rem', marginTop:'1rem'}}>
        <Link to="/signup" style={{color:'#6E6E71'}}>Зарегистрироватся</Link>
        <br/>
        <Link style={{color:'#6E6E71', textAlign:'right'}} to="/reset_password">Сброс пароля</Link>
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
  )
}
