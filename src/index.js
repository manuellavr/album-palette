import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SearchAlbums from "./components/SearchAlbums.js";
import SearchResults from "./components/SearchResults.js"; 
import qs from 'qs';
import axios from 'axios';

class Main extends React.Component {

  render() {
    return (
    	<Router>
    	<Switch>
    		<SearchAlbums />
    	</Switch>
    	</Router>
     
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));