import React from "react";
import getColors from 'get-image-colors';

export default class AlbumCard extends React.Component{
    
    constructor(props){    
        super(props);
        this.state = {
            palette: []
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
    }

    GetPalette = () => {
         
    }

    render(){             

        return (
             <div className="card"  >           
                <div className="card--content">   
                 <img className="card--image"
                    src={this.props.album.images[1].url}
                    alt={this.props.album.name + ' cover'}
                />              
                <h3 className="card--title">{this.props.album.name}</h3>
                <p>Artist(s): {this.props.album.artists.map(albumArtist => albumArtist.name + ' ')}</p>
                <a href={this.props.album.external_urls.spotify} className="medium-txt" target="_blank" rel="noopener noreferrer">
                    Link for album in spotify
                </a>
                <br />
                <br />
                    {this.state.palette.map(color => (
                        <div className="paletteBox" style={{backgroundColor: color}} key={color}>{color}</div>
                    ))}                   
                </div>
            </div>
        )   
    }
}

