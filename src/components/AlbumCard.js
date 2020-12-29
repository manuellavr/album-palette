import React, { useState, useEffect } from "react";
import { withTranslation } from 'react-i18next';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import loading from '../imgs/loading.gif';
import copy from '../imgs/copy_icon.png';
import logo from '../imgs/Spotify_Logo_RGB_Green.png';
import getColors from 'get-image-colors';

const AlbumCard = ({ album, t }) => {

    const [palette, setPalette] = useState([])
    const [artists, setArtists] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const options = {
            count: 13
        }

        getColors(album.images[1].url, options)
            .then(colors => colors.map(color => color.hex()))
            .then(palettes => {
                setPalette(palettes)
                setIsLoading(false)
            })

        setArtists(album.artists.map(albumArtist => {
            return albumArtist.name
        }).join(", "))

    }, [album.artists, album.images])

    const copyPalette = () => {
        const dummyPalette = palette.map(color => color.toUpperCase()).join(" ");
        var dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.value = dummyPalette;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    return (
        <div className="card"  >
            <div className="card__content">
                <img className="card__image" src={album.images[0].url} alt={album.name + ' cover'} />

                <h3 className="card__title" title={album.name}>
                    {album.name}
                </h3>

                <p className="card__artists" title={artists}>
                    <b>{t('artists')}:</b> {artists}
                </p>

                <a href={album.external_urls.spotify}
                    className="medium-txt"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('listen')} <img src={logo} alt="spotify's green logo" style={{ width: 100 }} />
                </a>

                <div className="palette center-content">
                    {isLoading ? <img src={loading} alt={t('alt.loading')} key={album.id} /> :
                        palette.map(color => (
                            <div className="palette__color"
                                style={{ backgroundColor: color }}
                                key={color}
                            >
                                <div className="overlay">
                                    <div className="text">{color.toUpperCase()}</div>
                                </div>
                            </div>
                        ))}
                </div>

                <OverlayTrigger trigger="focus" placement="right" delay={{ hide: 1500 }} overlay={
                    <Tooltip>
                        {t('copied')}
                    </Tooltip>
                }>
                    <button className="button--see" onClick={copyPalette}>
                        {t('copy')} <img src={copy} alt={t('alt.copy')} style={{ width: 15 }} />
                    </button>
                </OverlayTrigger>

            </div>
        </div>
    )
}

export default withTranslation('common')(AlbumCard)