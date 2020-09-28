import React, { Component } from "react";
import { setLoggedInUser } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/PersonOutline";
import Auth from "../../Auth";
import {
  logout,
} from "../../Redux/Actions";
import './Header.css';

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
      this.props.dispatch(setLoggedInUser({ name: user.name, uid: user.uid, email: user.email }));
    }
  }

  render() {
    let { anchorEl } = this.state;
    
    return (
      <div className="Header">
          <div>WELCOME TO RIMMI</div>
          <div className="right-part">
            {!this.props.someoneLoggedIn ? (
              <Button
                variant="outlined"
                style={{ marginRight: 20 }}
                color="primary"
                onClick={() => {
                  this.props.history.push("/rimmi/login");
                }}
              >
                Log in
              </Button>
            ) : (
                <Avatar
                  onClick={event => {
                    this.setState({ anchorEl: event.currentTarget });
                  }}
                  style={{ backgroundColor: "#3f51b5", marginRight: 10 }}
                >
                  <Person />
                </Avatar>
              )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => {
                this.setState({ anchorEl: null });
              }}
            >
              <MenuItem
                onClick={() => {
                  Auth.signout(() => {
                    this.props.history.push("/rimmi/");
                    this.props.dispatch(logout());
                  });
                  this.setState({ anchorEl: null});
                  localStorage.removeItem('loggedInUser');
                }}
              >
                Logout
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.props.history.push("/rimmi/");
                }}
              >
                Home
              </MenuItem>
              { this.props.someoneLoggedIn ? 
                (
                  <MenuItem
                    onClick={() => {
                      this.props.history.push("/rimmi/profile");
                    }}
                  >
                    {this.props.loggedInUser.name}
                  </MenuItem>
                ):(
                  <TextField></TextField>
                )
              }
            </Menu>
          </div>
      </div>

    );
  }
}

const Header = withRouter(connect(mapStateToProps)(ConnectedHeader));
export default Header;