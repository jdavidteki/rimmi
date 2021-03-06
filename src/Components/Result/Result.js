import React, { Component } from "react";
import { setLoggedInUser } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import './Result.css';

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn,
  };
};

class ConnectedResult extends Component {
  state = {
  };

  componentDidMount(){
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user != null){
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid, email: user.email }));
    }
  }

  render() {
    return (
      //TODO: make the search placeholder animate and change
      //make your hair?? --> pedicure?? --> barber shop?? --> braids???
      <div className="Result-container">
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
              "/rimmi/result?term=" +
              this.state.searchTerm
            );
          }}
        >
          {" "}
          Search
        </Button>
      </div>      
    );
  }
}

const Result = withRouter(connect(mapStateToProps)(ConnectedResult));
export default Result;