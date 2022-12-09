import React, { Component } from 'react';
import supabase  from '../../Api/supabaseClient'
import Spinner from 'react-bootstrap/Spinner';
import KeywordsCards from './KeywordsCards';

class ViewKeywords extends Component {
    constructor(props){
        super (props) 
        this.state = {keywords: []};
        this.state = {errors: []};
        this.state = {loading: true}

    }
    componentDidMount() {
        this.handleKeywordsInfo()
    }

    async handleKeywordsInfo(){ 
        const {data, error} = await supabase
        .from('keywords')
        .select('*')
        if(error){
            this.setState({errors:'Что-то пошло не так(('})
            this.setState({keywords: null})
            console.log(error)
        }
        if(data){
            this.setState({keywords:data})
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
                        {this.state.keywords&&(
                                    <div className='genresCard'>{this.state.keywords.map(keyword=>(
                                        <>
                                            <KeywordsCards key={keyword.id} keyword={keyword}/>
                                        </>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </>
        );
    }
}

export default ViewKeywords;