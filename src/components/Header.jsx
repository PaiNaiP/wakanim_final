import React, { useEffect } from 'react'
import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import supabase from '../Api/supabaseClient'
import { useAuth } from './Client/auth'

const Header = () => {
  const auth = useAuth()
  const [roles, setRoles] = useState('')
  const [rolesStorage, setRolesStorage] = useState('')

  useEffect(() => {
    handleViewRole()
    setRolesStorage(localStorage.getItem('role'))
    console.log(rolesStorage)
  }, [])
  
  const handleViewRole = async()=>{
    await supabase
      .from('workers')
      .select("*")
      .eq('id_workers', auth.user.id).then(async(data)=>{
        await supabase
        .from('roles')
        .select("*")
        .eq('id_roles', data.data[0].roles_id).then((role)=>{
          setRoles(role.data[0].name_of_role)
          localStorage.setItem('user', auth.user.id);
          localStorage.setItem('role',role.data[0].name_of_role)
          })
      })
  }


  return (
    <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/signin"><img style={{width:'13rem'}} src="https://upload.wikimedia.org/wikipedia/commons/7/75/Logo_Wakanim.png" alt="wakanim" /></Navbar.Brand>
          <Nav className="me-auto">
            {rolesStorage==="Отдел кадров"&&(
              <Nav.Link href="/workers">Сотрудники</Nav.Link>
            )}
            {rolesStorage==="Отдел контента"&&(
              <>
              <Nav.Link href="/genres">Жанры</Nav.Link>
              <Nav.Link href="/keywords">Ключевые слова</Nav.Link>
              <Nav.Link href="/anime">Аниме</Nav.Link>
              <Nav.Link href='/series'>Серии</Nav.Link>
              </>
            )}
            {rolesStorage==="Отдел рекламы"&&(
              <Nav.Link href='/recomendation'>Рекомендации</Nav.Link>
            )}
            {rolesStorage==="Отдел продаж"&&(
              <Nav.Link href='/checks'>Платежи</Nav.Link>
            )}
            {rolesStorage==="Админ бд"&&(
              <>
              <Nav.Link href="/workers">Сотрудники</Nav.Link>
              <Nav.Link href="/genres">Жанры</Nav.Link>
              <Nav.Link href="/keywords">Ключевые слова</Nav.Link>
              <Nav.Link href="/anime">Аниме</Nav.Link>
              <Nav.Link href='/series'>Серии</Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
  )
}
export default Header