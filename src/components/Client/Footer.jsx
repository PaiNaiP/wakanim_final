import React from 'react'
import { Grid, GridItem } from '@chakra-ui/react'
import {AiFillGithub} from 'react-icons/ai'
import {SiTelegram, SiGmail} from 'react-icons/si'

export const Footer = () => {
  return (
    <div style={{background:'#161617', marginTop:'4rem'}}>
        <Grid templateColumns='repeat(5, 1fr)' gap={4}>
        <GridItem colSpan={2} style={{height:'15rem', marginLeft:'3rem'}} marginTop="20px">
        <div style={{display:'flex', padding:'20px'}}>
        <h1 style={{fontSize:'36px', color:'white', fontWeight:'500'}}>WAKANIM</h1>
        <p style={{fontSize:'18px', color:'white', marginLeft:'20px'}}> - французская развлекательная компания,
        <br/> международный поставщик аниме-сериалов
        <br/> на основе потокового мультимедиа</p>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" width="150px" style={{marginLeft:'20px', paddingBottom:'30px'}} alt="wakanim" />
        </GridItem>
        <GridItem colStart={5} colEnd={6} h='10' >
            <div style={{fontSize:'35px', display:'flex', color:'white', marginTop:'60px'}}>
            <div style={{marginLeft:'15px'}}>
            <a href="https://github.com/PaiNaiP" marginLeft="1rem"><AiFillGithub marginLeft="1rem"/></a>
            </div>
            <div style={{marginLeft:'15px'}}>
            <a href="https://t.me/rbwitch" marginLeft="1rem"><SiTelegram marginLeft="1rem"/></a>
            </div>
            <div style={{marginLeft:'15px'}}>
            <a href="mailto:isip_e.i.batygina@mpt.ru" marginLeft="1rem"><SiGmail marginLeft="1rem"/></a>
            </div>
            </div>
        </GridItem>
        </Grid>
    </div>
  )
}
