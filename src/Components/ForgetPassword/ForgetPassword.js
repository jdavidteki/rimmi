import React, { Component } from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../Firebase/firebase.js";

class ForgotPassword extends Component {
    state = {
        email: "",
        loginErrorMsg: "",
        wrongCred: false,
        emailSent: false,
    };

    render() {
        return (
            <div style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <div
                    style={{
                        height: 300,
                        width: 200,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                >
                    {!this.state.emailSent ?
                        <div>
                            <TextField
                                value={this.state.email}
                                placeholder="What's your email???"
                                onChange={e => {
                                this.setState({ email: e.target.value });
                                }}
                            />
                            <Button
                                style={{ marginTop: 20, width: 200 }}
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    Firebase.sendEmailWithPassword(this.state.email)
                                    .then(user => {
                                        console.log("user", user)
                                        this.setState({emailSent: true})
                                    })
                                    .catch(error => {
                                        console.warn("error", error)
                                        this.setState({ wrongCred: true, loginErrorMsg: error.toString()});
                                        return;
                                    });
                                }}
                            >
                                Send Reset Email
                            </Button>
                            {" "}
                            {this.state.wrongCred && (
                                <div style={{ color: "red" }}>{this.state.loginErrorMsg}</div>
                            )}
                        </div>
                    :
                        <div>
                            Please follow the instructions in your email to reset your password
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ForgotPassword