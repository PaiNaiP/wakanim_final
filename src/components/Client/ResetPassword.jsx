import React, { useState } from 'react'
import { Alert, AlertIcon, AlertTitle, AlertDescription, Input, Button } from '@chakra-ui/react'
import bcrypt from 'bcryptjs';
import supabase from '../../Api/supabaseClient';
import { useNavigate } from 'react-router';
export const ResetPassword = () => {
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [passwordTwo, setPasswordTwo] = useState("")
    const navigation = useNavigate()
    const handleResetPassword = async() =>{
        if(password===passwordTwo){
            await supabase.auth
            .updateUser({ password: password }).then(async(us)=>{
                if(us.error)
                    setMessage(us.error)
                await supabase
                .from('clients')
                .select("*")
                .eq('id_clients', us.data.user.id).then(async(clients)=>{
                    clients.data.map(async(client)=>{
                        const hashedPassword = bcrypt.hashSync(password, 10);
                        await supabase
                        .from('clients')
                        .update({ name: client.name,
                        email: client.email,
                        password: hashedPassword,
                        date_of_birth: client.date_of_birth,
                        gender: client.gender,
                        avatar:client.avatar
                    }).eq('id_clients', us.data.user.id).then(()=>{
                        navigation('/signin')
                    })
                })
                })
            })
        }
        else
            setMessage('Пароли не совпадают')
    }
  return (
    <div style={{background:'#161617', width:'100%', height:'100%', display:'flex', paddingBottom:'1rem'}}>
    <div style={{margin:'0 auto', marginTop:'4.8%', marginBottom:'2%', padding:'20px'}}>
    <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" style={{width:'20rem', marginLeft:'20px'}}/>
    <div style={{margin:'0 auto', background:'#19191B', marginBottom:'26.25%', padding:'40px', borderRadius:'15px', marginTop:'2rem'}} className="themeSignIn">
    <h1 style={{color:'#FFFFFF', textAlign:'center', fontSize:'40px', fontWeight:'500'}}>Смена пароля</h1>
    {message&&(
    <Alert status='error' style={{marginTop:'20px', marginBotton:'-20px'}}>
        <AlertIcon />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
    )}
    <div style={{margin:'15px', marginTop:'40px'}}>
        <Input type="password" placeholder='пароль' className='inputSign' value={password} onChange={e=>setPassword(e.target.value)} style={{width:'17rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
    </div>
    <div style={{margin:'15px', marginTop:'40px'}}>
        <Input type="password" placeholder='повторите пароль' className='inputSign' value={passwordTwo} onChange={e=>setPasswordTwo(e.target.value)} style={{width:'17rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
    </div>
    <div style={{width:'100%', display:'flex', marginTop:'30px'}}>
    <div style={{wordWrap:'break-word', margin:'0 auto', width:'100%', display:'flex'}}>
    <Button style={{margin:'0 auto', background:'#202022', color:'white', width:'12rem', marginLeft:'3.5rem'}} onClick={handleResetPassword}>Сменить пароль</Button>
    </div>
    </div>
    </div>
    </div>
</div>
  )
}
