import React, { Component } from 'react'
import supabase  from '../../Api/supabaseClient'
import Spinner from 'react-bootstrap/Spinner';
import { AnimeCard } from './AnimeCard';

export default class ViewAnime extends Component {
  constructor(props){
    super (props) 
    this.state = {anime: []};
    this.state = {errors: []};
    this.state = {loading: true}

}
componentDidMount() {
    this.handleKeywordsInfo()
}

async handleKeywordsInfo(){ 
    const {data, error} = await supabase
    .from('anime')
    .select('*')
    if(error){
        this.setState({errors:'Что-то пошло не так(('})
        this.setState({anime: null})
        console.log(error)
    }
    if(data){
        this.setState({anime:data})
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
                        {this.state.anime&&(
                                    <div className='genresCard'>{this.state.anime.map(animes=>(
                                        <>
                                            <AnimeCard key={animes.id} animes={animes}/>
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
