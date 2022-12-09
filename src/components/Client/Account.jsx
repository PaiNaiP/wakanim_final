import React, { useRef } from 'react'
import { Layout } from '../Layout'
import { Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Square, Input, RadioGroup, Stack, Radio, Button, Skeleton, SkeletonCircle, InputGroup, PinInput, PinInputField, Alert, AlertIcon, AlertTitle, AlertDescription, Heading, Text } from '@chakra-ui/react'
import { Avatar, Wrap, WrapItem } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import supabase from '../../Api/supabaseClient'
import { useState } from 'react'
import { Footer } from './Footer'
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { storage } from '../../Api/firebase'
import { useAuth } from './auth'
import { useNavigate } from 'react-router-dom'
import addMonths from 'date-fns/addMonths'
import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card'
import dayjs from 'dayjs'
import { addDays } from 'date-fns'

export const Account = () => {
    const [clients, setClients] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [date_of_birth, setDate_of_birth] = useState('')
    const [gender, setGender] = useState('')
    const [dis, setDis] = useState(true)
    const [avatar, setAvatar] = useState([])
    const [modal, setModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modalSubscribe, setModalSubscribe] = useState(false)
    const [promocode, setPromocode] = useState(false)
    const [valuePromocode, setValuePromocode] = useState('')
    const [error, setError] = useState(null)
    const [subscribeInfo, setSubscribeInfo] = useState(false)
    const [info, setInfo] = useState([])
    const [canceled, setCenceled] = useState(0)
    const [alertCancel, setAlertCencel] = useState(false)
    const id = useParams()
    const auth = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        handleClientInfo()
    }, [])

    setTimeout(() => {
        setLoading(false)
    }, 1000);
    
    const handleClose = () => {
        setModal(false)
        setModalSubscribe(false)
        setSubscribeInfo(false)
    }

    const handleClientInfo = async() =>{
        let { data } = await supabase
        .from('clients')
        .select("*")
        .eq('id_clients', id.id)
        data.map((client)=>{
            setClients(client)
            setName(client.name)
            setEmail(client.email)
            setDate_of_birth(client.date_of_birth)
            setGender(client.gender)
        })
    }

    const handleCancel = async() =>{
        if(canceled===0){
            setAlertCencel(true)
            setCenceled(canceled+1)
        }
        else if(canceled===1)
        {
            await supabase
                .from('subscriptions')
                .select("*")
                .eq('clients_id', auth.user.id).then(async(data)=>{
                    await supabase
                    .from('checks')
                    .delete()
                    .eq('subscriptions_id', data.data[0].id_subscriptions).then(async()=>{
                        await supabase
                        .from('subscriptions')
                        .delete()
                        .eq('clients_id', auth.user.id).then(()=>{
                            setCenceled(0)
                            setSubscribeInfo(false)
                        })
                    })
                })
        }
    }

    const handleResetPassword = async() =>{
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/password',
        })
        console.log(data, error)
        setModal(true)
    }   
    const handleLogout = () =>{
        auth.Logout()
        navigate('/signin')
    } 
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
            ]).then(async(t)=>{
                console.log(t.error)
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
                        setModalSubscribe(false)
                    })
                })
            })
        }
        else
        setError('Карта не действительна')
    }
    
    const handleSubsribeModal = async() => {
        await supabase
        .from('subscriptions')
        .select("*")
        .eq('clients_id', auth.user.id).then((subscrib)=>{
            if(subscrib.data.length===0){
                setModalSubscribe(true)
            }
            else
            {
                setInfo(subscrib.data[0].subscriptions_end_date)
                setSubscribeInfo(true)

            }
        })
        //setModalSubscribe(true)
    }

    const handleChangeAccount = async() =>{
        if(dis)
            setDis(false)
        else{
        if(avatar.length!==0){
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
                        await supabase
                        .from('clients')
                        .update({ name: name,
                        email: email,
                        password: clients.password,
                        date_of_birth: date_of_birth,
                        gender: gender,
                        avatar:downloadURL})
                        .eq('id_clients', id.id).then(()=>{
                            setDis(true)
                            window.location.reload()
                        })
                    })
                })
            }
            else{
                        await supabase
                        .from('clients')
                        .update({ name: name,
                        email: email,
                        password: clients.password,
                        date_of_birth: date_of_birth,
                        gender: gender,
                        avatar:clients.avatar})
                        .eq('id_clients', id.id).then(()=>{
                            setDis(true)
                            window.location.reload()
                        })
            }
        }
    }
  return (
    <Layout>
        <div style={{background:'#1F1F21'}}>
        <Flex paddingBottom="20px">
        <Square size='200px' style={{wordWrap:'break-word', clear: 'both', flexWrap: 'wrap', marginLeft:'14%'}}>
            <div style={{marginLeft:'25rem', marginTop:'7rem'}}>
            <Button bg="darkgrey" style={{marginTop:'20px', width:'10.5rem'}} onClick={handleSubsribeModal}>Подписки</Button>
            <Button bg="darkgray" style={{marginTop:'20px', width:'10.5rem'}} onClick={handleResetPassword}>Сброс пароля</Button>
            <Button bg="darkgrey" style={{marginTop:'20px'}} onClick={handleChangeAccount}>Изменить аккаунт</Button>
            </div>
        </Square>
        <Box flex='1'>
            {loading&&(
                <Stack style={{marginLeft:'22.5%', marginTop:'8%'}}>
                    <SkeletonCircle style={{marginLeft:'4.3rem'}} width="8.5rem" height="8.5rem" />
                    <Skeleton width="17rem" height="2.4rem" style={{borderRadius:'3px', marginTop:'15px'}}/>
                    <Skeleton width="17rem" height="2.4rem" style={{borderRadius:'3px', marginTop:'15px'}}/>
                    <Skeleton width="17rem" height="2.4rem" style={{borderRadius:'3px', marginTop:'15px'}}/>
                    <Skeleton width="17rem" height="2.4rem" style={{borderRadius:'3px', marginTop:'15px'}}/>
                </Stack>
            )}
            {!loading&&(
                <div style={{marginLeft:'22.5%', marginTop:'8%'}}>
                <Wrap style={{marginLeft:'4.3rem'}}>
                <WrapItem>
                    <Avatar size='2xl' name={clients.name} src={clients.avatar} />
                </WrapItem>
                </Wrap>
                <div style={{marginTop:'20px'}}>
                <Input type="text" placeholder='Никнейм' className='inputAccount' disabled={dis} value={name} onChange={e=>setName(e.target.value)} style={{width:'17rem', background:'#2A2A2D', borderColor:'#202022', color:'white'}}/>
                </div>
                <div style={{marginTop:'20px'}}>
                <Input type="email" placeholder='email' className='inputAccount' disabled={dis} value={email} onChange={e=>setEmail(e.target.value)} style={{width:'17rem', background:'#2A2A2D', borderColor:'#202022', color:'white'}}/>
                </div>
                <div style={{marginTop:'20px'}}>
                <Input type="date" placeholder='Дата рождения' className='inputAccount' disabled={dis} value={date_of_birth} onChange={e=>setDate_of_birth(e.target.value)} style={{width:'17rem', background:'#2A2A2D', borderColor:'#202022', color:'white'}}/>
                </div>
                {dis&&(
                    <div style={{marginTop:'20px'}}>
                    <Input type="text" placeholder='Пол' className='inputAccount' disabled={dis} value={gender} style={{width:'17rem', background:'#2A2A2D', borderColor:'#202022', color:'white'}}/>
                    </div>
                )}
                {!  dis&&(
                    <>
                    <RadioGroup onChange={setGender} style={{color:'white', marginTop:'2rem'}} value={gender}>
                    <Stack direction='row'>
                        <Radio value='Мужской'>Мужской</Radio>
                        <Radio value='Женский' defaultChecked style={{marginLeft:'5rem'}}>Женский</Radio>
                    </Stack>
                    </RadioGroup>
                    <div style={{display:'flex', marginLeft:'-1rem', marginTop:'1rem'}}>
                    <label className="custom-file-upload">
                    <input type="file" onChange={e=>setAvatar(e.target.files[0])}/>
                    Выберите аватар
                    </label>
                    <div style={{color:'white', maxWidth:'160px', marginLeft:'1.5rem'}}>{avatar.name}</div>
                    </div>
                    </>
                )}
                </div>
            )}
                <Button bg="darkgrey" style={{marginTop:'20px', marginLeft:'27%'}} onClick={handleLogout}>Выйти из аккаунта</Button>
            <Modal isOpen={modal} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blackAlpha.900" color="white">Сброс пароля</ModalHeader>
                <ModalCloseButton color="white"/>
                <ModalBody bg="blackAlpha.900" color="white">
                    На вашу почту было отправлено письмо для сброса пароля
                </ModalBody>

                <ModalFooter bg="blackAlpha.900" color="white">
                    <Button colorScheme='whiteAlpha' mr={3} onClick={handleClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={subscribeInfo} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blackAlpha.900" color="white">Подписки</ModalHeader>
                <ModalCloseButton color="white"/>
                <ModalBody bg="blackAlpha.900" color="white">
                <Card align='center'>
                <CardBody>
                    <Text>Ваша подписка действует до: {info}</Text>
                    {alertCancel&&(
                        <Alert status='warning' style={{color:'black'}}>
                        <AlertIcon />
                        При отключении подписки, вы не сможете смотреть контент
                        </Alert>
                    )}
                </CardBody>
                </Card>
                </ModalBody>

                <ModalFooter bg="blackAlpha.900" color="white">
                <Button colorScheme="red" mr={3} onClick={handleCancel}>
                    Отменить подписку
                    </Button>
                    <Button colorScheme='whiteAlpha' mr={3} onClick={handleClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={modalSubscribe} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blackAlpha.900" color="white">Оплата подписки</ModalHeader>
                <ModalCloseButton color="white"/>
                <ModalBody bg="blackAlpha.900" color="white">
                    {error&&(
                        <Alert status='error' style={{color:'black', borderRadius:'0.5rem', marginBottom:'1rem'}} bg='#F47F6A'>
                        <AlertIcon />
                        <AlertTitle>Оплата не прошла</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <InputGroup>
                        <Input placeholder='1234 1234 1234 1234' type="number" max="16" style={{color:'white'}}/>
                    </InputGroup>
                    <InputGroup style={{marginTop:'1rem', marginBottom:'1rem'}}>
                        <Input type="month" style={{color:'white'}}/>
                    </InputGroup>
                    <div style={{display:'flex'}}>
                    <div style={{marginRight:'1rem', marginTop:'8px'}}>CVC:</div>
                    <PinInput>
                        <PinInputField />
                        <PinInputField style={{marginLeft:'1rem'}}/>
                        <PinInputField style={{marginLeft:'1rem'}}/>
                    </PinInput>
                    </div>
                    {!promocode&&(
                        <div>
                            <InputGroup style={{marginTop:'1rem', marginBottom:'1rem'}}>
                                <Input type="text" value={valuePromocode} style={{color:'white'}} onChange={(e)=>handleCheckedPromocode(e)} placeholder='Промокод'/>
                            </InputGroup>
                            <h1 style={{fontWeight:'500', fontSize:'24px'}}>300 ₽ / мес</h1>
                        </div>
                    )}
                    {promocode&&(
                        <div>
                            <InputGroup style={{marginTop:'1rem', marginBottom:'1rem'}}>
                                <Input type="text" value={valuePromocode} style={{color:'white', borderColor:"green"}} onChange={(e)=>handleCheckedPromocode(e)} placeholder='Промокод'/>
                            </InputGroup>
                            <h1 style={{fontWeight:'500', fontSize:'24px', textDecoration: 'line-through'}}>300 ₽ / мес</h1>
                            <div style={{display:'flex'}}>
                            <h1 style={{fontWeight:'500', fontSize:'35px'}}>0 ₽ </h1>
                            <h1 style={{fontWeight:'500', fontSize:'24px', marginTop:'0.6rem', marginLeft:'5px'}}>/ 3 мес</h1>
                            </div>
                        </div>
                    )}
                </ModalBody>

                <ModalFooter bg="blackAlpha.900" color="white">
                <Button colorScheme='whiteAlpha' mr={3} onClick={handlePayload}>
                    Оплатить
                    </Button>
                    <Button bg="#100f0f" mr={3} onClick={handleClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
        </Flex>
        <Footer/>
        </div>
    </Layout>
  )
}
