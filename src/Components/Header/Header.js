import React, { Component } from "react";
import { setLoggedInUser } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";


const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn,
  };
};

class ConnectedHeader extends Component {
  state = {
  };

  componentDidMount(){
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (user != null){
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid }));
    }
  }

  render() {
    let { anchorEl } = this.state;
    
    return (
      <div>Header will go here</div>
    );
  }
}

const Header = withRouter(connect(mapStateToProps)(ConnectedHeader));
export default Header;