import React, { Component } from 'react';
import supabase  from '../../Api/supabaseClient'
import Spinner from 'react-bootstrap/Spinner';
import WorkersCard from './WorkersCard';

export default class ViewWorkers extends Component {
  constructor(props){
    super (props) 
    this.state = {workers: [], roles:[]};
    this.state = {errors: []};
    this.state = {loading: true}
}
componentDidMount() {
    this.handleGenresInfo()
}

async handleGenresInfo(){ 
    const {data, error} = await supabase
    .from('workers')
    .select('*')
    let { data: workers } = await supabase
    .from('workers')
    .select(`
        roles_id,
        roles (
        name_of_role)
    `)
    if(error){
        this.setState({errors:'Что-то пошло не так(('})
        this.setState({workers: null})
        this.setState({roles: null})
        console.log(error)
    }
    if(data){
        await supabase.auth.signUp({
            email: this.state.email,
            password: this.state.password,
        })
        this.setState({workers:data})
        this.setState({roles:workers})
        this.setState({errors:null})
    }
    this.setState({loading:false})
}


render() {
return (
    <>
        {this.state.loading&&(
            <Spinner animation="border" variant="primary" style={{marginLeft:'38%', marginTop:'10%'}}/>
        )}
        {!this.state.loading&&(
            <div>
                {this.state.errors&&(<p>{this.state.errors}</p>)}
                {this.state.workers&&(
                            <div className='genresCard'>{this.state.workers.map(worker=>(
                                <>
                                    <WorkersCard key={worker.id} worker={worker}/>
                                </>
                        ))}
                    </div>
                )}
            </div>
        )}
    </>
)
}
}
