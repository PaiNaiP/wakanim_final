import React, { useState } from 'react'
import supabase from '../../Api/supabaseClient'
import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import {Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
import { storage } from '../../Api/firebase'
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import bcrypt from 'bcryptjs';

export const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [resetPassword, setResetPassword] = useState("")
    const [message, setMessage] = useState("")
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [open, setOpen] = useState(false)
    const [avatar, setAvatar] = useState([])

    const navigate = useNavigate()
    const handleClose = () => {
        setOpen(false)
        navigate('/SignIn')
    }

    const handleSignIn = async(e)=>{
        e.preventDefault()
        if(password===resetPassword){
            if(email===""||name===""||gender===""||dateOfBirth==="")
                setMessage('Заполните все поля')
            else{
                const storageRef = ref(storage, 'avatar/'+avatar.name);

                const uploadTask = uploadBytesResumable(storageRef, avatar);
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
                        let { data: clients } = await supabase
                        .from('clients')
                        .select("email")
                        .eq(email, email)
                        if(!clients){
                        await supabase.auth.signUp({
                            email: email,
                            password: password,
                        }).then(async(data, err)=>{
                            if(err)
                            setMessage(err)
                            else{
                                const hashedPassword = bcrypt.hashSync(password, 10);
                                const { error } = await supabase
                                .from('clients')
                                .insert([
                                    { 
                                    id_clients: data.data.user.id,
                                    name: name, 
                                    email: email,
                                    password: hashedPassword,
                                    date_of_birth: dateOfBirth,
                                    gender:gender,
                                    avatar: downloadURL
                                    },
                                ])
                                if(error)
                                    setMessage(error)
                                else
                                    setOpen(true)
                            }
                        })
                    
                    }
                    else
                    setMessage('Такая почта уже используется')
                    })
                })
            
        }
        }
        else
            setMessage('Пароли не совпадают')
    }
  return (
    <div style={{background:'#161617', width:'100%', height:'100%', display:'flex'}}>
    <div style={{margin:'0 auto', marginTop:'2%', marginBottom:'0', paddingBottom:'7px'}}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" style={{width:'20rem', marginLeft:'3.5rem'}}/>
    <div style={{margin:'0 auto', background:'#19191B', marginBottom:'49px', padding:'40px', borderRadius:'15px', marginTop:'2rem'}} className="themeSignIn">
    <h1 style={{color:'#FFFFFF', textAlign:'center', fontSize:'40px', fontWeight:'500'}}>Регистрация</h1>
    {message&&(
        <Alert status='error' style={{marginTop:'20px', marginBotton:'-20px'}}>
            <AlertIcon />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )}
    <div style={{margin:'15px', marginTop:'40px'}}>
        <Input type="email" placeholder='email' className='inputSign' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'21.5rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
    </div>
    <div style={{margin:'15px', marginTop:'20px'}}>
        <Input type="text" placeholder='никнейм' className='inputSign' value={name} onChange={e=>setName(e.target.value)} style={{width:'10rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
        <Input type="date" placeholder='дата рождения'  value={dateOfBirth} onChange={e=>setDateOfBirth(e.target.value)} style={{width:'10rem', marginLeft:'1.5rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
    </div>
    <RadioGroup onChange={setGender} style={{color:'white', marginLeft:'1rem'}} value={gender}>
      <Stack direction='row'>
        <Radio value='Мужской'>Мужской</Radio>
        <Radio value='Женский' defaultChecked style={{marginLeft:'9.5rem'}}>Женский</Radio>
      </Stack>
    </RadioGroup>
    <div style={{display:'flex'}}>
    <div style={{margin:'15px', marginTop:'20px'}}>
        <Input type="password" placeholder='пароль'  value={password} onChange={e=>setPassword(e.target.value)} style={{width:'10rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
    </div>
    <div style={{margin:'15px', marginTop:'20.5px', marginLeft:'14px'}}>
        <Input type="password" placeholder='повторите пароль'  value={resetPassword} onChange={e=>setResetPassword(e.target.value)} style={{width:'10rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
    </div>
    </div>
    <div style={{display:'flex'}}>
    <label className="custom-file-upload">
    <input type="file" onChange={e=>setAvatar(e.target.files[0])}/>
    Выберите аватар
    </label>
    <div style={{color:'white', maxWidth:'160px', marginLeft:'2.5rem'}}>{avatar.name}</div>
    </div>
    <div style={{width:'100%', display:'flex', marginTop:'30px'}}>
    <div style={{wordWrap:'break-word', margin:'0 auto', width:'100%'}}>
    <Button style={{margin:'0 auto', background:'#202022', color:'white', width:'12rem', marginLeft:'5.5rem'}} onClick={handleSignIn}>Зарегиcтрироваться</Button>
    <br/>
    <div style={{marginLeft:'7.5rem', marginTop:'1rem'}}>
    <Link to="/signin" style={{color:'#6E6E71'}}>Авторизироваться</Link>
    </div>
    </div>
    </div>
    </div>
    </div>
    <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader bg="blackAlpha.900" color="white">Регистрация</ModalHeader>
            <ModalCloseButton color="white"/>
            <ModalBody bg="blackAlpha.900" color="white">
                Для продолжения подтвердите регистрацию, отправленную на вашу почту
            </ModalBody>

            <ModalFooter bg="blackAlpha.900" color="white">
                <Button colorScheme='whiteAlpha' mr={3} onClick={handleClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
      </Modal>
</div>
  )
}
