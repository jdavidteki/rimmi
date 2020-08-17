import React, { Component } from "react";
import "./Footer.css"

class Footer extends Component {
  state = {
  };

  componentDidMount(){}

  render() {
    let { anchorEl } = this.state;
    
    return (
      <div className="Footer">
        Copyright rimmi.com
      </div>
    );
  }
}

export default Footer;