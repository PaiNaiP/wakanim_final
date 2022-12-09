import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Input, InputGroup, PinInput, PinInputField } from '@chakra-ui/react'
import { addDays, addMonths } from 'date-fns'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import supabase from '../../Api/supabaseClient'
import { useAuth } from './auth'

export const SubscribePage = () => {
    const [promocode, setPromocode] = useState(false)
    const [valuePromocode, setValuePromocode] = useState('')
    const [error, setError] = useState('')
    const auth = useAuth()
    const navigation = useNavigate()
    const handleCheckedPromocode = (e) =>{
        setValuePromocode(e.target.value)
        if(e.target.value === "ThreeMonth")
            setPromocode(true)
        else
            setPromocode(false)
    }
    const handlePayload = async() =>{
        if(promocode){
            const year = addMonths(new Date(), 3).getFullYear()
            const month = addMonths(new Date(), 3).getMonth()
            const day = addDays(new Date(), 3).getDay()
            await supabase
            .from('subscriptions')
            .insert([
                { clients_id: auth.user.id, subscriptions_end_date:  year+'-'+month+'-'+day},
            ]).then(async()=>{
                await supabase
                .from('subscriptions')
                .select("*")
                .eq('clients_id', auth.user.id).then(async(data)=>{
                    await supabase
                    .from('checks')
                    .insert([
                        { date_of_buy: dayjs(new Date()).format('YYYY-MM-DD'), 
                        sum: 0,
                        workers_id: null,
                        send: false,
                        subscriptions_id: data.data[0].id_subscriptions},
                    ]).then(()=>{
                        navigation('/')
                    })
                })
            })
        }
        else
        setError('Карта не действительна')
    }
  return (
    <div style={{background:'#161617', width:'100%', height:'100%', display:'flex'}}>
        <div style={{margin:'0 auto', marginTop:'1.9%'}}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" style={{width:'20rem', marginLeft:'2.3rem'}}/>
            <div style={{margin:'0 auto', background:'#19191B', marginBottom:'26.25%', padding:'40px', width:'25rem', borderRadius:'15px', marginTop:'2rem'}} className="themeSignIn">
            <h1 style={{color:'#FFFFFF', textAlign:'center', fontSize:'40px', fontWeight:'500'}}>Подписка</h1>
            {error&&(
                        <Alert status='error' style={{color:'black', borderRadius:'0.5rem', marginBottom:'1rem', marginTop:'1rem'}} bg='#F47F6A'>
                        <AlertIcon />
                        <AlertTitle>Оплата не прошла</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
            <InputGroup style={{marginTop:'2rem'}}>
                        <Input placeholder='1234 1234 1234 1234' type="number" max="16" style={{color:'white'}}/>
                    </InputGroup>
                    <InputGroup style={{marginTop:'1rem', marginBottom:'1rem'}}>
                        <Input type="month" style={{color:'white'}}/>
                    </InputGroup>
                    <div style={{display:'flex'}}>
                    <div style={{marginRight:'1rem', marginTop:'8px', color:'white'}}>CVC:</div>
                    <PinInput>
                        <PinInputField style={{color:'white'}}/>
                        <PinInputField style={{marginLeft:'1rem', color:'white'}}/>
                        <PinInputField style={{marginLeft:'1rem', color:'white'}}/>
                    </PinInput>
                    </div>
                    {!promocode&&(
                        <div>
                            <InputGroup style={{marginTop:'1rem', marginBottom:'1rem'}}>
                                <Input type="text" value={valuePromocode} style={{color:'white'}} onChange={(e)=>handleCheckedPromocode(e)} placeholder='Промокод'/>
                            </InputGroup>
                            <h1 style={{fontWeight:'500', fontSize:'24px', color:'white'}}>300 ₽ / мес</h1>
                        </div>
                    )}
                    {promocode&&(
                        <div>
                            <InputGroup style={{marginTop:'1rem', marginBottom:'1rem'}}>
                                <Input type="text" value={valuePromocode} style={{color:'white', borderColor:"green"}} onChange={(e)=>handleCheckedPromocode(e)} placeholder='Промокод'/>
                            </InputGroup>
                            <h1 style={{fontWeight:'500', fontSize:'24px', textDecoration: 'line-through', color:'white'}}>300 ₽ / мес</h1>
                            <div style={{display:'flex', color:'white'}}>
                            <h1 style={{fontWeight:'500', fontSize:'35px'}}>0 ₽ </h1>
                            <h1 style={{fontWeight:'500', fontSize:'24px', marginTop:'0.6rem', marginLeft:'5px'}}>/ 3 мес</h1>
                            </div>
                        </div>
                    )}
            <div style={{width:'100%', display:'flex', marginTop:'30px'}}>
        <div style={{wordWrap:'break-word', margin:'0 auto', width:'100%', display:'flex'}}>
        <Button onClick={handlePayload} style={{margin:'0 auto', background:'#202022', color:'white', width:'12rem', marginLeft:'3.5rem'}}>Оплатить подписку</Button>
        </div>
        </div>
        </div>
    </div>
    </div>
  )
}
