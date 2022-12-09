import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import supabase from '../../Api/supabaseClient'

export const EmailPage = () => {
    const [email, setEmail] = useState('')
    const [modal, setModal] = useState(false)

    const handleClose = () => setModal(false)

    const handleResetPassword = async() =>{
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: '/password',
        })
        console.log(error, data)
        setModal(true)
    }
  return (
    <div style={{background:'#161617', width:'100%', height:'100%', display:'flex', paddingBottom:'1rem'}}>
        <div style={{margin:'0 auto', marginTop:'9%', marginBottom:'2%', paddingBottom:'3.4rem'}}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" style={{width:'20rem', marginLeft:'20px'}}/>
            <div style={{margin:'0 auto', background:'#19191B', marginBottom:'26.25%', padding:'40px', borderRadius:'15px', marginTop:'2rem'}} className="themeSignIn">
            <h1 style={{color:'#FFFFFF', textAlign:'center', fontSize:'40px', fontWeight:'500'}}>Смена пароля</h1>
                <div style={{margin:'15px', marginTop:'40px'}}>
                    <Input type="email" placeholder='Почта' className='inputSign' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'17rem', background:'#202022', borderColor:'#202022', color:'white'}}/>
                </div>
            <div style={{width:'100%', display:'flex', marginTop:'30px'}}>
        <div style={{wordWrap:'break-word', margin:'0 auto', width:'100%', display:'flex'}}>
        <Button style={{margin:'0 auto', background:'#202022', color:'white', width:'12rem', marginLeft:'3.5rem'}} onClick={handleResetPassword}>Сменить пароль</Button>
        </div>
        </div>
        </div>
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
    </div>
</div>
  )
}
