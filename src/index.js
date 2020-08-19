import React from 'react';
import ReactDOM from 'react-dom';
import SearchAlbums from "./components/SearchAlbums.js";

class Main extends React.Component {

  render() {
    return (
    		<SearchAlbums />
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));