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

// TODO:when people Search,it should return cloeset 5 vendors to thier current location
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
          <div style={{ fontWeight: 900 }} >RIMMI -  we see you...</div>
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
                  style={{ backgroundColor: "#3f51b5", marginRight: 10, cursor: "pointer" }}
                  src={`https://firebasestorage.googleapis.com/v0/b/rimmi-ff8d1.appspot.com/o/images%2F${this.props.loggedInUser.uid}.jpeg?alt=media&token=86d4ac39-d703-416a-a257-f209a64b0cb4`}
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
                  this.props.history.push("/rimmi/");
                }}
              >
                Home
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.props.history.push("/rimmi/appointments");
                }}
              >
                Appointments
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
            </Menu>
          </div>
      </div>
    );
  }
}

const Header = withRouter(connect(mapStateToProps)(ConnectedHeader));
export default Header;