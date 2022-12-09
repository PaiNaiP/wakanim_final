import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import supabase from '../../Api/supabaseClient'
import emailjs from '@emailjs/browser';
import { useAuth } from '../Client/auth';
import dayjs from 'dayjs';
import { Spinner } from '@chakra-ui/react';


export const ChecksCards = ({checks}) => {
    const [subscribe, setSubscribe] = useState([])
    const [client, setClient] = useState([])
    const [worker, setWorker] = useState('')
    const [workerHistory, setWorkerHistory] = useState('')
    const [overdue, setOverdue] = useState(false)
    const [loading, setLoading] = useState(true)
    const auth = useAuth()
    useEffect(() => {
        handleViewSubscribtion()
        handleViewWorkers()
        handleViewWorker()
        console.log(overdue)
    }, [])
    
    setTimeout(() => {
        handleCheckDateOfEnd()
        setLoading(false)
    }, 1000);
const handleCheckDateOfEnd = ()=>{
    if(dayjs(new Date()).format('YYYY-MM-DD')>subscribe.subscriptions_end_date)
        setOverdue(true)
}
    const handleViewWorkers = async() =>{
        await supabase
        .from('workers')
        .select("*")
        .eq('id_workers', auth.user.id).then((data)=>{
            var fullFIO = data.data[0].surname+' '+data.data[0].name+' '+data.data[0].lastname;
            var t = fullFIO.split (' ');
            var shortFIO = t [0] + ' ' + t [1].charAt (0) + '. ' + t [2].charAt (0) + '.';
            setWorker(shortFIO)
        })
    }
    const handleViewSubscribtion = async()=>{
        await supabase
        .from('subscriptions')
        .select("*")
        .eq('id_subscriptions', checks.subscriptions_id).then(async(data)=>{
            setSubscribe(data.data[0])
            await supabase
            .from('clients')
            .select("*")
            .eq('id_clients', data.data[0].clients_id).then((an)=>{
                setClient(an.data[0])
            })
        })
    }

        const handleSendCheck = async() =>{emailjs.send("service_b3tqa1m","template_ulq7wid",{
            date_of_buy: checks.date_of_buy,
            sum: checks.sum,
            email: client.email,
            worker: worker
            }, "SuQrmHd0cn5GrbNXE").then(async()=>{
                await supabase
                .from('checks')
                .update({ workers_id: auth.user.id,
                send: true })
                .eq('id_checks', checks.id_checks).then(()=>{
                    window.location.reload()
                })
            })
        }

        const handleViewWorker = async() =>{
            if(checks.workers_id!==null){
                await supabase
            .from('workers')
            .select("*")
            .eq('id_workers', checks.workers_id).then((data)=>{
                var fullFIO = data.data[0].surname+' '+data.data[0].name+' '+data.data[0].lastname;
                var t = fullFIO.split (' ');
                var shortFIO = t [0] + ' ' + t [1].charAt (0) + '. ' + t [2].charAt (0) + '.';
                setWorkerHistory(shortFIO)
            })
            }
        }

        const handleDeleteSubscribe = async()=>{
            await supabase
            .from('checks')
            .delete()
            .eq('id_checks', checks.id_checks).then(async()=>{
                await supabase
                .from('subscriptions')
                .delete()
                .eq('id_subscriptions', checks.subscriptions_id).then(()=>{
                    window.location.reload()
                })
            })
        }
  return (
    <tbody>
        {loading&&(
            <Spinner />
        )}
        {!loading&&(
        <>
        {!checks.send&&overdue===false&&(
            <tr style={{background:'#ccd5ae'}}>
            <td>{checks.id_checks}</td>
            <td>{checks.date_of_buy}</td>
            <td>{checks.sum} рублей</td>
            <td>{subscribe.subscriptions_end_date}</td>
            <td>{client.email}</td>
            <td>{workerHistory}</td>
            <td><Button variant="primary" onClick={handleSendCheck}>Отправить чек</Button></td>
        </tr>
        )}
        {overdue&&(
            <tr style={{background:'#f28482'}}>
            <td>{checks.id_checks}</td>
            <td>{checks.date_of_buy}</td>
            <td>{checks.sum} рублей</td>
            <td>{subscribe.subscriptions_end_date}</td>
            <td>{client.email}</td>
            <td>{workerHistory}</td>
            <td><Button variant="primary" onClick={handleDeleteSubscribe}>Удалить подписку</Button></td>
        </tr>
        )}
        {checks.send&&overdue===false&&(
            <tr>
            <td>{checks.id_checks}</td>
            <td>{checks.date_of_buy}</td>
            <td>{checks.sum} рублей</td>
            <td>{subscribe.subscriptions_end_date}</td>
            <td>{client.email}</td>
            <td>{workerHistory}</td>
        </tr>
        )}
        </>
        )}
    </tbody>
  )
}
