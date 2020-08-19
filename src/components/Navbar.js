import React from 'react';
import Nav from 'react-bootstrap/Nav';
import {Link} from 'react-router-dom';

export default function Navbar(){
	return(

			<Nav className="navbar">
				<Link to="/"><Nav.Item>albumpalette</Nav.Item></Link>
			</Nav>

		)
}