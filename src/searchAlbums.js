import React from "react";
import AlbumCard from './AlbumCard.js';
import axios from 'axios';
import qs from 'qs';

export default class SearchAlbums extends React.Component{
    
    constructor(){
        super();
        this.searchAlbums = this.searchAlbums.bind(this);
        this.onChangeQuery = this.onChangeQuery.bind(this);

        this.state={
            query: '',
            albums: [],
            accessToken: ''
        }
    }

    componentDidMount(){

        const client_id = process.env.REACT_APP_CLIENT_ID;
        const client_secret = process.env.REACT_APP_CLIENT_SECRET;
        const url = "https://accounts.spotify.com/api/token";
        const body = {
            grant_type: 'client_credentials'
        }
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            } 
        }

        axios.post(url, qs.stringify(body), header)
        .then((res) => {    
            this.setState({
                accessToken:res.data.access_token
            })
        })
        .catch((err) => {
            console.error(err)
        })

        console.log("montou")

    }

    searchAlbums(e) {

        e.preventDefault();       
        
        const searchUrl = `https://api.spotify.com/v1/search?q=${this.state.query}&type=album&limit=30`
        const searchHeader = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.accessToken
            }
        }

        axios.get(searchUrl, searchHeader)
        .then(res => {

            this.setState({
                albums: res.data.albums.items
            })

        })
        .catch(err => {
            console.error(err) // TODO: handle this; get new token
        })
    }
        
    onChangeQuery(e){
        this.setState({
            query: e.target.value
        })
    }

    render(){
        return (
            <>
                <form className="form" onSubmit={this.searchAlbums}>
                    <label className="label" htmlFor="query">Album or Artist Name</label>
                    <input className="input" type="text" name="query"
                        placeholder="i.e. Beyoncé"
                        value={this.state.query} onChange={this.onChangeQuery}
                        />
                    <button className="button" type="submit">Search</button>
                </form>
                <div className="card-list">
                    {this.state.albums.map(album => (
                       <AlbumCard album={album} key={album.id} palette={album.palette}/>
                    ))}
                </div>
            </>
        )
    }
}