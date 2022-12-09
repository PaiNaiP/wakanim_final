import React, { Component } from 'react';
import  supabase  from '../../Api/supabaseClient'
import GenresCards from './GenresCards';
import Spinner from 'react-bootstrap/Spinner';

export default class ViewGenres extends Component {
    constructor(props){
        super (props) 
        this.state = {genres: []};
        this.state = {errors: []};
        this.state = {loading: true}

    }
    componentDidMount() {
        this.handleGenresInfo()
        //console.log(this.props)
        // console.log(localStorage.getItem('user'))
        // console.log(localStorage.getItem('role'))

    }

    async handleGenresInfo(){ 
        const {data, error} = await supabase
        .from('genres')
        .select('*')
        this.setState({loading:false})
        if(error){
            this.setState({errors:'Что-то пошло не так(('})
            this.setState({genres: null})
            console.log(error)
        }
        if(data){
            this.setState({genres:data})
            this.setState({errors:null})
        }
    }
    
 
  render() {
    return (
        <>
            {this.state.loading&&(
                <Spinner animation="border" variant="primary" style={{marginLeft:'38%', marginTop:'10%'}}/>
            )}
            {!this.state.loading&&(
                <div>{this.state.errors&&(<p>{this.state.errors}</p>)}
                    {this.state.genres&&(
                        <div className='genresCard'>
                            {this.state.genres.map(genre=>(
                                <GenresCards key={genre.id} genre={genre}/>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
  }
}
