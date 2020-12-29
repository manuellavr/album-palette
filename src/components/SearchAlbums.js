import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Element, scroller, animateScroll as scroll } from 'react-scroll';
import { withTranslation, Trans } from "react-i18next";
import { Container, Row, Col } from 'react-bootstrap';
import qs from 'qs';
import album from '../imgs/palettes.png';
import SearchResults from './SearchResults.js';

const SearchAlbums = ({ i18n, t }) => {

    const [query, setQuery] = useState('')
    const [albums, setAlbums] = useState([])
    const [accessToken, setAccessToken] = useState('')
    const [isPTBR, setIsPTBR] = useState(true)

    useEffect(() => {
        getNewToken();
    }, [])

    const getNewToken = () => {

        const client_id = process.env.REACT_APP_CLIENT_ID;
        const client_secret = process.env.REACT_APP_CLIENT_SECRET;
        const url = "https://accounts.spotify.com/api/token";
        const body = {
            grant_type: 'client_credentials'
        }
        const header = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            }
        }

        axios.post(url, qs.stringify(body), header)
            .then((res) => {
                setAccessToken(res.data.access_token)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const searchAlbums = (e) => {

        e.preventDefault();
        console.log(query)

        const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=album&limit=28`
        const searchHeader = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }

        axios.get(searchUrl, searchHeader)
            .then(res => {
                setAlbums(res.data.albums.items)
                setQuery("")

                scroller.scrollTo('results', {
                    duration: 700,
                    delay: 120,
                    smooth: true,
                    offset: 85
                })
            })
            .catch(err => {
                console.error(err)
                getNewToken();
            })
    }

    const onChangeQuery = (e) => {
        setQuery(e.target.value)
    }

    const scrollToTop = () => {
        scroll.scrollToTop()
    }

    const onChangeLang = () => {

        setIsPTBR(prev => !prev)

        i18n.changeLanguage(!isPTBR ? 'br' : 'en')
    }

    return (
        <>
            <Container fluid className="top">
                <Row>
                    <Col xs={12}>
                        <button className="float-right button--lang" onClick={onChangeLang}>
                            {isPTBR ? "EN" : "PT-BR"}
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
                        <br />
                        <br />
                        <img className="img-reduced" src={album} alt={t('alt.art')}></img>
                    </Col>
                    <Col xs={12} sm={6}>
                        <form className="form float-right" onSubmit={searchAlbums}>
                            <input className="input" type="text" name="query"
                                placeholder={t('search_placeholder')}
                                value={query} onChange={onChangeQuery}
                            />
                            <button className="button" type="submit">{t('search_btn')}</button>
                        </form>
                    </Col>
                </Row>

                <Element name="results"><div className="results">
                    <SearchResults albums={albums} token={accessToken} />
                </div>
                </Element>

                <Row className="center-content">
                    {albums.length > 0 ? 
                        <button className="scroll-btn" onClick={scrollToTop}>
                            {t('scroll_btn')}
                        </button> 
                    : null}
                </Row>
            </Container>
        </>
    )
}

export default withTranslation('common')(SearchAlbums)