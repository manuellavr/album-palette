import React from 'react';
import AlbumCard from './AlbumCard.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function SearchResults({ albums }) {

   return (<div>
      <Row className="center-content">
         {albums.filter(album => album.images[0]).map(album => (
            <Col xs={10} sm={6} lg={4} xl={3} className="card-list" key={album.id}>
               <AlbumCard album={album} key={album.id} palette={album.palette} />
            </Col>
         ))}
      </Row>
   </div>
   )
}

