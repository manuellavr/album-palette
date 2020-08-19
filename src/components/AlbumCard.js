import React from "react";
import getColors from 'get-image-colors';

export default class AlbumCard extends React.Component{
    
    constructor(props){    

        super(props);
       
        this.state = {
            palette: [],
            artists: ""
        }
    }

    componentDidMount(){
        const options = {
          count: 13
        }
        getColors(this.props.album.images[1].url, options)
             .then(colors => colors.map(color => color.hex())).then(palettes => {
                     this.setState({
                         palette: palettes
                     })  
             })

        this.setState({
            artists: this.props.album.artists.map(albumArtist => {
                    return albumArtist.name
                }).join(", ")
        })
    }

    render(){             

        return (
             <div className="card"  >           
                <div className="card__content">   
                 <img className="card__image"
                    src={this.props.album.images[1].url}
                    alt={this.props.album.name + ' cover'}
                />              
                <h3 className="card__title" title={this.props.album.name}>{this.props.album.name}</h3>
                <p className="card__artists" title={this.state.artists}><b>Artist(s):</b> {this.state.artists}</p>
                <a href={this.props.album.external_urls.spotify} className="medium-txt" target="_blank" rel="noopener noreferrer">
                    Listen to this album on Spotify
                </a>

                <div className="palette">
                    {this.state.palette.map(color => (
                        <div className="palette__color" style={{backgroundColor: color}} key={color}></div>
                    ))}                   
                </div>
                <button className="button--see">+</button>
                </div>
            </div>
        )   
    }
}

