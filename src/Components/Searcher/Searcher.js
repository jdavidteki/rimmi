import React, { Component } from "react";
import { setLoggedInUser } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ReactTypingEffect from 'react-typing-effect';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Searcher.css';

class ConnectedSearcher extends Component {
  constructor(props){
    super(props);

    this.state = {
      animatedTexts: [
        "okada", 
        "barber", 
        "laundry", 
        "vulcanizer", 
        "pedicure",
        "baby sitting",
        "massage",
        "house keeping",
        "haircut",
        "braids",
      ], 
      count:0,
    };

    this.searchTerm=''
  }

  componentDidMount(){
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user != null){
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid, email: user.email }));
    }

    setInterval( () => { 
      this.setState({
        count: (this.state.count+1) % 10
      })
    }, 4000);
  }

  render() {
    return (      
      <div className="Searcher-container">
        <Autocomplete
          id="controllable-states-demo"
          value={this.searchTerm}
          options={this.state.animatedTexts.slice(0,5)}
          renderInput={(params) => <TextField {...params} className="Searcher-input" label="what do you want to do today??" variant="outlined" />}
          onInputChange={(event, newInputValue) => {
            this.searchTerm = newInputValue
          }}
          onChange={(event, newValue) => {
            this.searchTerm = newValue
            this.props.history.push(
              "/rimmi/servicelist?term=" +
              newValue
            );
          }}
          onKeyUp = {event => {
            if (event.key === 'Enter') {
              this.props.history.push(
                "/rimmi/servicelist?term=" +
                this.searchTerm
              );
            }
          }}
        />

        <ReactTypingEffect
          style={{ marginTop: 200, fontSize: 24, color: '#3F51B5' }}
          text={this.state.animatedTexts[this.state.count] + '??'}
          speed={150}
          eraseDelay={150}
          typingDelay={150}
        />
      </div>      
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn,
  };
};

const Searcher = withRouter(connect(mapStateToProps)(ConnectedSearcher));
export default Searcher;