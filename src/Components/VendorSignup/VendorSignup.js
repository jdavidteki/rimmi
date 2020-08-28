import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import BusinessIcon from '@material-ui/icons/Business';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../Firebase/firebase";

import "./VendorSignup.css"

class ConnectedVendorSignup extends Component {

    state = {
        mainPhone: "",
        redirectToReferrer: false,
        SignUpErrorMsg: "",
        services: "",
        category: "",
        officeZip: "",
        officeState: "",
        officeCity: "",
        officeLine1: "",
        twitterUsername: "",
        facebookUsername: "",
        discription: "",
        mainPhone: "",
    };

    componentDidMount() {
    }

  
    render() {
        return (
            <div style={{height: "100%"}}>
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <div
                    style={{
                        width: 200,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                    >
                    <Avatar style={{ marginBottom: 10 }}>
                        <BusinessIcon />
                    </Avatar>
                    <div
                        style={{
                        marginBottom: 20,
                        fontSize: 24,
                        textAlign: "center"
                        }}
                    >
                        {" "}
                        Vendor Sign Up
                        {" "}
                    </div>
                    <TextField
                        value={this.state.mainPhone}
                        placeholder="Main Phone"
                        onChange={e => {
                        this.setState({ mainPhone: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.discription}
                        placeholder="About me"
                        onChange={e => {
                        this.setState({ discription: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.facebookUsername}
                        placeholder="Facebook Username"
                        onChange={e => {
                        this.setState({ facebookUsername: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.twitterUsername}
                        placeholder="Twitter Username"
                        onChange={e => {
                        this.setState({ twitterUsername: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.officeLine1}
                        placeholder="Office Line1"
                        onChange={e => {
                        this.setState({ officeLine1: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.officeCity}
                        placeholder="Office City"
                        onChange={e => {
                        this.setState({ officeCity: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.officeState}
                        placeholder="Office State"
                        onChange={e => {
                        this.setState({ officeState: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.officeZip}
                        placeholder="Office Postal Code"
                        onChange={e => {
                        this.setState({ officeZip: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.category}
                        placeholder="Service category"
                        onChange={e => {
                        this.setState({ category: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.services}
                        placeholder="list all your services..."
                        onChange={e => {
                        this.setState({ services: e.target.value });
                        }}
                    />
                    <Button
                        style={{ marginTop: 20, width: 200 }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            Firebase.vendorSignUp({
                                uid: this.props.loggedInUser.uid,
                                firstName: this.props.loggedInUser.name,
                                lastName: this.props.loggedInUser.name,
                                services: this.state.services,
                                category: this.state.category,
                                officeZip: this.state.officeZip,
                                officeState: this.state.officeState,
                                officeCity: this.state.officeCity,
                                officeLine1: this.state.officeLine1,
                                twitterUsername: this.state.twitterUsername,
                                facebookUsername: this.state.facebookUsername,
                                discription: this.state.discription,
                                mainPhone: this.state.mainPhone,
                            })
                        }}
                    >
                    Sign Up
                    </Button>
                    {this.state.wrongCred && (
                        <div style={{ color: "red" }}>{this.state.SignUpErrorMsg}</div>
                    )}
                    </div>
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.loggedInUser,
        someoneLoggedIn: state.someoneLoggedIn,
    };
};

const VendorSignup = withRouter(connect(mapStateToProps)(ConnectedVendorSignup));
export default VendorSignup;