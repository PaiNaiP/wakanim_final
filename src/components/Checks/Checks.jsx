import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { Button, Col, Container, Row, Spinner, Table } from 'react-bootstrap'
import { DownloadTableExcel } from 'react-export-table-to-excel'
import supabase from '../../Api/supabaseClient'
import Header from '../Header'
import { ChecksView } from './ChecksView'
import { VictoryBar, VictoryChart } from 'victory';
import { useNavigate } from 'react-router'

export const Checks = () => {
    const tableRef = useRef(null);
    const navigate = useNavigate()
    const [checks, setChecks] =useState([])
    const [loading, setLoading] = useState(true)
    const [diagram, setDiagram] = useState([])
    const data = [
        {quarter: '2022-12-08', earnings: 15},
        {quarter: '2022-09-08', earnings: 13},
        ];
    


    useEffect(() => {
        handleViewChecks()
        if(localStorage.getItem('role')!=="Отдел продаж")
                navigate('/signin')
    }, [])
    

    setTimeout(() => {
        setLoading(false)
    }, 5000);

    const handleViewChecks = async()=>{
        const m =[]
        await supabase
        .from('checks')
        .select('*').then((chc)=>{
            chc.data.map(async(dat)=>{
                await supabase
                .from('checks')
                .select("*")
                .eq('date_of_buy', dat.date_of_buy).then((date)=>{
                    m.push({quarter:'2022-12-03', earnings:13})
                    m.push({quarter:'2022-12-04', earnings:11})
                    m.push({quarter: date.data[0].date_of_buy, earnings: date.data.length})
                })
            })
            setChecks(chc.data)
            })
            .then(()=>{
                setDiagram(m)
                console.log(diagram)
                console.log(data)
            })
    }
  return (
    <div>
        <Header/>
        <Container style={{marginTop:'40px'}}>
            <Row>
                <Col sm={2}>
                    <DownloadTableExcel
                        filename="subscribe table"
                        sheet="subscribe"
                        currentTableRef={tableRef.current}
                    >
                    <Button style={{marginTop:'1rem', width:"12.2rem"}}> Export excel </Button>
                    </DownloadTableExcel>
                </Col>
                <Col sm={10}>
                {loading&&(
                    <Spinner animation="border" role="status" style={{marginLeft:'27rem',marginTop:'2rem'}}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                )}
                {!loading&&(
                    <>
                    <Table ref={tableRef} striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Дата оплаты</th>
                        <th>Сумма</th>
                        <th>Дата окончания подписки</th>
                        <th>Почта клиента</th>
                        <th>Работник</th>
                        </tr>
                    </thead>
                    <ChecksView checks={checks}/>
                    </Table>
                    <VictoryChart>
                        <VictoryBar
                        data={diagram}
                        x="quarter"
                        style={{ data: { fill: "#c43a31" } }}
                        y="earnings"
                        />
                    </VictoryChart>
                    </>
                )}
                </Col>
                </Row>
                </Container>
    </div>
  )
}
