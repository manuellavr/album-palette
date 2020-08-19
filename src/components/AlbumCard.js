import React from "react";
import getColors from 'get-image-colors';
import loading from '../imgs/loading.gif';
import logo from '../imgs/Spotify_Logo_RGB_Green.png';

export default class AlbumCard extends React.Component{
    
    constructor(props){    

        super(props);
       
        this.state = {
            palette: [],
            artists: "",
            isLoading: true
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
                     this.setState({
                        isLoading: false
                    })
             })

        this.setState({
            artists: this.props.album.artists.map(albumArtist => {
                    return albumArtist.name
                }).join(", ")
        })

    }


    copyPalette = () =>{
       const palette = this.state.palette.map(color => color.toUpperCase()).join(" ");
        var dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.value = palette;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
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
                    Listen to this album on <img src={logo} alt="spotify's green logo" style={{width: 100}}/>
                </a>
                <div className="palette">
                    {this.state.isLoading ? <img src={loading} alt="animated symbol that represents content loading" key={this.props.album.id}/> : this.state.palette.map(color => (
                        <div className="palette__color" style={{backgroundColor: color}} key={color}><div className="overlay"><div className="text">{color.toUpperCase()}</div></div></div>
                    ))}                   
                </div>
                <button className="button--see" onClick={this.copyPalette}>copy hex codes!</button> 
                </div>
            </div>
        )   
    }
}

