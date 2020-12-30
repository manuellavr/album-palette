import React from "react";
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Element, scroller, animateScroll as scroll } from 'react-scroll';
import { withTranslation, Trans } from "react-i18next";
import { Container, Row, Col } from 'react-bootstrap';
import { GET_IMAGE_COLORS_URL, SPOTIFY_TOKEN_REQUEST_URL, SPOTIFY_WEB_API_URL, PAGE_LIMIT } from '../constants';
import qs from 'qs';
import album from '../imgs/palettes.png';
import SearchResults from './SearchResults.js';

const SearchAlbums = ({ i18n, t }) => {

    const searchBarRef = useRef(null)
    const [query, setQuery] = useState('')
    const [albums, setAlbums] = useState([])
    const [accessToken, setAccessToken] = useState('')
    const [isPTBR, setIsPTBR] = useState(true)
    const [currentPage, setCurrentPage] = useState({
        offset: 0,
        hasNext: false
    })

    useEffect(() => {
        getNewToken();
    }, [])

    const getNewToken = () => {

        const client_id = process.env.REACT_APP_CLIENT_ID;
        const client_secret = process.env.REACT_APP_CLIENT_SECRET;
        const url = SPOTIFY_TOKEN_REQUEST_URL;
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

    const searchAlbums = (offset, fetchingNew) => {

        const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=album&offset=${offset}&limit=${PAGE_LIMIT}`

        const searchHeader = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }

        axios.get(searchUrl, searchHeader)
            .then(res => {

                if(fetchingNew)
                    setAlbums(res.data.albums.items)
                else
                    setAlbums(prev => prev.concat(res.data.albums.items))

                setCurrentPage(prev => ({
                    offset: prev.offset + PAGE_LIMIT,
                    hasNext: res.data.albums.next === null ? false : true
                }))

                if (fetchingNew) {
                    scroller.scrollTo('results', {
                        duration: 700,
                        delay: 120,
                        smooth: true,
                        offset: 85
                    })
                }
            })
            .catch(err => {
                console.error(err)
                getNewToken();
            })
    }

    const getNewArtistsAlbums = (e) => {

        e.preventDefault();

        searchBarRef.current.value = ""
        setCurrentPage({
            limit: 28,
            total: 0,
            offset: 0,
            hasNext: true
        })
        searchAlbums(0, true)
    }

    const fetchMore = (e) => {
        e.preventDefault();
        searchAlbums(currentPage.offset, false)
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
                                Um site desenvolvido com a <a className="link" href={SPOTIFY_WEB_API_URL} target="__blank">
                                    API Web do Spotify</a> e o pacote <a className="link" href={GET_IMAGE_COLORS_URL} target="__blank">get-image-colors</a>
                            </Trans>
                        </p>
                        <br />
                        <br />
                        <img className="img-reduced" src={album} alt={t('alt.art')}></img>
                    </Col>
                    <Col xs={12} sm={6}>
                        <form className="form float-right" onSubmit={getNewArtistsAlbums}>
                            <input className="input" type="text" name="query"
                                aria-label={t('search_btn')}
                                placeholder={t('search_placeholder')}
                                onChange={onChangeQuery}
                                ref={searchBarRef}
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
                    {currentPage.hasNext && albums.length > 0 ?
                        <button className="scroll-btn" onClick={fetchMore}>
                            {t('ver_mais')}
                        </button>
                        :
                        (
                            currentPage.offset > 0 ?
                                <button className="scroll-btn" onClick={scrollToTop}>
                                    {t('scroll_btn')}
                                </button>
                                :
                                null
                        )
                    }
                </Row>
            </Container>
        </>
    )
}

export default withTranslation('common')(SearchAlbums)