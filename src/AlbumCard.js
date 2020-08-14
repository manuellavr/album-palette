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
          count: 10
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
                <img className="card--image"
                    src={this.props.album.images[1].url}
                    alt={this.props.album.name + ' poster'}
                />
                <div className="card--content">
                   {this.state.palette.map(color => (
                       <div className="paletteBox" style={{backgroundColor: color}} key={color}></div>
                   ))}
                <h3 className="card--title">{this.props.album.name}</h3>
                <p>Artist: {this.props.album.artists.map(albumArtist => albumArtist.name + '; ')}</p>
                <a href={this.props.album.external_urls.spotify} target="_blank" rel="noopener noreferrer">Link for album in spotify</a>
               
                </div>
            </div>
        )   
    }
}

