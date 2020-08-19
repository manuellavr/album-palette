import React from 'react';
import AlbumCard from './AlbumCard.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar from './Navbar.js';
import SearchBar from './SearchBar.js';

export default class SearchResults extends React.Component{	

	render(){
		return (	<div>
					<Row>
					{this.props.albums.map(album => (
                     <Col sm={6} lg={4} xl={3} className="card-list" key={album.id}>
                        <AlbumCard album={album} key={album.id} palette={album.palette}/>
                     </Col>
                    ))}  
                    </Row>
                    </div>  
		)
	}

}