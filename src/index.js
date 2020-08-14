import React from 'react';
import ReactDOM from 'react-dom';
import SearchAlbums from "./searchAlbums.js";

class Main extends React.Component {
  render() {
    return (
      <div className="container">
        <h1 className="title">Album Search</h1>
        <SearchAlbums/>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));