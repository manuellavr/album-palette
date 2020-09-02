import React from "react";
import axios from 'axios';
import SearchResults from './SearchResults.js';    
import { Container, Row, Col } from 'react-bootstrap';
import qs from 'qs';
import album from '../imgs/palettes.png';
import {Element, scroller, animateScroll as scroll} from 'react-scroll';
import {withTranslation, Trans} from "react-i18next";

class SearchAlbums extends React.Component{
    
    constructor(){
        super();
        this.searchAlbums = this.searchAlbums.bind(this)
        this.onChangeQuery = this.onChangeQuery.bind(this)
        this.getNewToken = this.getNewToken.bind(this)

        this.state={
            query: '',
            albums: [],
            accessToken: '',
            isPTBR: true
        }
    }

    componentDidMount(){
        this.getNewToken();
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
              offset: 85
            })
        })
        .catch(err => {
            console.error(err)
            this.getNewToken()
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
        const { t, i18n } = this.props

        return (
            <>  
                <Container fluid className="top">
                <Row>
                <Col xs={12}>
                    <button className="float-right button--lang" onClick={() => {
                        this.setState(prevState => {
                        return({
                            isPTBR: !prevState.isPTBR
                        })
                        })
                        i18n.changeLanguage(!this.state.isPTBR ? 'br' : 'en')
                    }}>
                        {this.state.isPTBR ? "EN" : "PT-BR"}
                    </button>
                </Col>
                </Row>
                </Container>

                <Container> 

                <Row>
                <Col md={12}>
                <h1 className="title">albumpalette</h1>
                </Col>
                </Row>

                <Row className="content-body">
                <Col xs={12} sm={6}>
                <p className="large-txt">{t('main_txt')}</p>
                <p className="medium-txt"> 
                <Trans t={t} i18nKey="text">
                    Um site desenvolvido com a <a href="https://developer.spotify.com/documentation/web-api/" target="__blank">
                    API Web do Spotify</a> e a biblioteca <a href="https://www.npmjs.com/package/get-image-colors" target="__blank">get-image-colors</a>
                </Trans>
                </p>
                <br/>
                <br/>
                <img className="img-reduced" src={album} alt={t('alt.art')}></img>
                </Col>
                <Col xs={12} sm={6}>
                <form className="form float-right" onSubmit={this.searchAlbums}>
                        <input className="input" type="text" name="query"
                            placeholder={t('search_placeholder')}
                            value={this.state.query} onChange={this.onChangeQuery}
                            />
                       <button className="button" type="submit">{t('search_btn')}</button>
                </form>
                </Col>
                </Row>

                <Element name="results"><div className="results">
                    <SearchResults albums={this.state.albums} token={this.state.accessToken} />
                </div>
                </Element>
                
                <Row className="center-content">
                {this.state.albums.length > 0 ? <button className="scroll-btn" onClick={this.scrollToTop}>{t('scroll_btn')}</button> : null}
                </Row>
                </Container>
            </>
        )
    }
}

export default withTranslation('common')(SearchAlbums)