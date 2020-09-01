import React, { Component } from "react";
import { setLoggedInUser } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ReactTypingEffect from 'react-typing-effect';

import './Searcher.css';

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn,
  };
};

class ConnectedSearcher extends Component {
  constructor(props){
    super(props);

    this.state = {
      animations: ["haircut", "okada", "laundry", "vulcanizer", "purewater"], 
      count:0,
    };
  }

  componentDidMount(){
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user != null){
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid }));
    }

    setInterval( () => { 
      this.setState({
        count: (this.state.count+1) % 5
      })
    }, 3000);

  }

  render() {

    return (
      //TODO: make the search placeholder animate and change
      //make your hair?? --> pedicure?? --> barber shop?? --> braids???
      <div className="Searcher-container">
        <TextField
          label="What do you want to do today???"
          value={this.state.searchTerm}
          onChange={e => {
            this.setState({ searchTerm: e.target.value });
          }}
          style={{ marginLeft: 30, width: 250, marginBottom: 15 }}
        />

        <Button
          style={{ marginLeft: 20 }}
          variant="outlined"
          color="primary"
          onClick={() => {
            this.props.history.push(
              "/rimmi/servicelist?term=" +
              this.state.searchTerm
            );
          }}
        >
          {" "}
          Search
        </Button>

        <ReactTypingEffect
          style={{ marginTop: 200, fontSize: 24, color: '#3F51B5' }}
          text={this.state.animations[this.state.count] + '??'}
          speed={150}
          eraseDelay={150}
          typingDelay={150}
        />
      </div>      
    );
  }
}

const Searcher = withRouter(connect(mapStateToProps)(ConnectedSearcher));
export default Searcher;