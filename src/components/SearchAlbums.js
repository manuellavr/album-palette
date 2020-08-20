import React from "react";
import axios from 'axios';
import SearchResults from './SearchResults.js';    
import { Container, Row, Col } from 'react-bootstrap';
import qs from 'qs';
import album from '../imgs/palette.png';
import {Element, scroller, animateScroll as scroll} from 'react-scroll';

export default class SearchAlbums extends React.Component{
    
    constructor(){
        super();
        this.searchAlbums = this.searchAlbums.bind(this)
        this.onChangeQuery = this.onChangeQuery.bind(this)
        this.getNewToken = this.getNewToken.bind(this)

        this.state={
            query: '',
            albums: [],
            accessToken: ''
        }
    }

    componentDidMount(){

        this.getNewToken();
        console.log("montou");

    }

    getNewToken(){

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
    }

    
    searchAlbums(e) {

        e.preventDefault();       
        
        const searchUrl = `https://api.spotify.com/v1/search?q=${this.state.query}&type=album&limit=28`
        const searchHeader = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.accessToken
            }
        }

        axios.get(searchUrl, searchHeader)
        .then(res => {

            this.setState({
                albums: res.data.albums.items,
                query: ""
            })

            scroller.scrollTo('results', {
              duration: 700,
              delay: 120,
              smooth: true,
              offset: 100
        })

        })
        .catch(err => {
            this.getNewToken()// TODO: handle this; get new token
        })

    }
        
    onChangeQuery(e){
        this.setState({
            query: e.target.value
        })
    }

    scrollToTop = () =>{
            scroll.scrollToTop()
    }

    render(){
        return (
            <>  
                <Container> 
                <Row>
                <Col xs={12} sm={6}>
                <h1 className="title">albumpalette</h1>
                </Col>
                </Row>    
                <Row className="content-body">
                <Col xs={12} sm={6}>
                <p className="large-txt">Get inspired by color palettes based on your favorite albums' cover art</p>
                <p className="medium-txt">A website developed with <a href="https://developer.spotify.com/documentation/web-api/" target="__blank">
                Spotify's Web API</a> and the <a href="https://www.npmjs.com/package/get-image-colors" target="__blank">get-image-colors</a> javascript library</p>
                <img src={album} alt="a colorful square with geometric shapes simulating an album cover. its associated color palette is below the square." className="img-reduced"></img>
                </Col>
                <Col xs={12} sm={6}>
                <>
                <form className="form float-right" onSubmit={this.searchAlbums}>
                        <input className="input" type="text" name="query"
                            placeholder="album or artist's name"
                            value={this.state.query} onChange={this.onChangeQuery}
                            />
                       <button className="button" type="submit">search</button>
                </form>
                </>
                </Col>
                </Row>
                <Element name="results"><div className="results" id="results">
                    <SearchResults albums={this.state.albums} token={this.state.accessToken} />
                </div>
                </Element>
                <Row className="center-content">
                {this.state.albums.length > 0 ? <button className="scroll-btn" onClick={this.scrollToTop}>scroll to top</button> : null}
                </Row>
                </Container>
            </>
        )
    }
}