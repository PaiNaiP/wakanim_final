import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './Client/auth'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { Footer } from './Client/Footer'
import supabase from '../Api/supabaseClient'

export const Layout = ({children}) => {
    const [anime, setAnime] = useState([])
    const [search, setSearch] = useState('')
    const [result, setResult] = useState('')
    const auth = useAuth()
    const navigation = useNavigate()
    const navigateToHome = () => navigation('/')

    useEffect(() => {
        handleViewAllAnime()
    }, [])
    
    const handleViewAllAnime = async() =>{
        const m =[]
        await supabase
        .from('anime')
        .select("anime_title").then((data)=>{
            data.data.map((dat)=>{
                m.push(dat.anime_title)
            })
            setAnime(m)
        })
    }

    const handleSearchResult = (e) => console.log(e)

    const filteredAnime = anime.filter(an=>{
        return an.toLowerCase().includes(search.toLowerCase())
    })
  return (
    <div>
        <header style={{display:'flex', background:'#161617', padding:'10px'}}>
            <ul style={{display:'flex', margin:'0 auto', textDecoration:'none', color:'white'}}>
            <li style={{listStyleType: 'none'}} onClick={navigateToHome}><img style={{width:'13rem'}} src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" /></li>
            <li style={{listStyleType: 'none', marginLeft:'15rem'}}>
            <InputGroup style={{borderColor:'#6E6E71'}}>
                <div>
                <Input type='search' placeholder='Поиск' onChange={(e)=>setSearch(e.target.value)} style={{width:'20rem', borderColor:'#6E6E71'}}/>
                {search&&(
                    <div style={{position:'absolute', zIndex: 100, backgroundColor:'#161617', width:'100%', borderRadius:'0 0 5px 5px'}}>
                    {filteredAnime.map((fil)=>(
                        <div style={{padding:'5px'}} className="findBack">
                        <Link to={`/anime/${fil}`}>{fil}</Link>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </InputGroup>
            </li>
            {auth.user ?
            <div style={{display: 'flex', marginTop:'0.5rem', marginLeft:'8.5rem'}}>
                <li style={{listStyleType: 'none', marginLeft:'2rem'}}><Link to="/favorite">Избранное</Link></li>
                <li style={{listStyleType: 'none', marginLeft:'2rem'}}><Link to={`/account/${auth.user.id}`}>Аккаунт</Link></li>
                <li style={{listStyleType: 'none', marginLeft:'2rem'}}><button onClick={auth.Logout}>Выйти из аккаунта</button></li>
            </div>
                :
            <div style={{display: 'flex', marginTop:'0.5rem', marginLeft:'10rem'}}>
                <li style={{listStyleType: 'none', marginLeft:'2rem'}}><Link to="/signup">Зарегистрироваться</Link></li>
                <li style={{listStyleType: 'none', marginLeft:'5rem'}}><Link to="/signin">Авторизоваться</Link></li>
            </div>
            }
            </ul>
        </header>
        <main>
            {children}
        </main>
    </div>
  )
}
