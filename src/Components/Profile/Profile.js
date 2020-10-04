import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Firebase from "../../Firebase/firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import FileUploader from "react-firebase-file-uploader";

import "./Profile.css";

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    someoneLoggedIn: state.someoneLoggedIn
  };
};

class ConnectedProfile extends Component {
    constructor(props) {
        super(props);
        this.readyMadeAvatar = ``;
        this.state = {
            avatar: "",
            isUploading: false,
            progress: 0,
            avatarURL: "",
            profileInfo: null,
            avatarOnFile: true
        };
    }

    ImgOnFile = () =>{
        this.setState({
            avatarOnFile: false,
        })
    }

    componentDidMount(){
        if (this.props.someoneLoggedIn){
            //TODO: figure out which one to remove
            this.readyMadeAvatar = `https://firebasestorage.googleapis.com/v0/b/rimmi-ff8d1.appspot.com/o/images%2F${this.props.loggedInUser.uid}.jpeg?alt=media&token=86d4ac39-d703-416a-a257-f209a64b0cb4`
            Firebase.fetchUserProfile(this.props.loggedInUser.uid).
            then(val => {
                this.setState({profileInfo: val})
            })
        }
    }

    componentDidUpdate(){
        this.readyMadeAvatar = `https://firebasestorage.googleapis.com/v0/b/rimmi-ff8d1.appspot.com/o/images%2F${this.props.loggedInUser.uid}.jpeg?alt=media&token=86d4ac39-d703-416a-a257-f209a64b0cb4`
        Firebase.fetchUserProfile(this.props.loggedInUser.uid).
        then(val => {
            this.setState({profileInfo: val})
        })
    }

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = filename => {
        this.setState({ avatar: filename, progress: 100, isUploading: false });
        Firebase
        .storage()
        .ref("images/")
        .child(filename)
        .getDownloadURL()
        .then(url => this.setState({ avatarURL: url, avatarOnFile: true }));
    };

    render () {
        if (!this.props.someoneLoggedIn){
            return (
                <div className="Profile">
                    <div className="Profile-wrapper">
                        <div className="Profile-info">
                            <div className="Profile-notFound">
                            <h2>Oops!</h2>
                            <p>Can't find this user. Try again.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.state.profileInfo){
            return (
                <div className="Profile">
                    <div className="Profile-vendorSignup">
                        <Button
                            style={{ marginTop: 20, width: 200 }}
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                            this.props.history.push("/rimmi/vendorsignup");
                            }}
                        >
                            Vendor Signup
                        </Button>
                    </div>
                    <div className="Profile-wrapper">
                        <div className="Profile-info">
                            
                            {this.state.avatarOnFile ? (
                                 <img src={this.readyMadeAvatar} alt="Profile image" onError={this.ImgOnFile}/>
                            ):(
                                <form>
                                    {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                    {this.state.avatarURL && <img src={this.state.avatarURL} alt="Profile image" />}
                                    <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, cursor: 'pointer'}}>
                                        Upload Picture
                                        <FileUploader
                                            hidden
                                            accept="image/jpeg"
                                            filename={file => this.props.loggedInUser.uid }
                                            storageRef={Firebase.storage().ref('images/')}
                                            onUploadStart={this.handleUploadStart}
                                            onUploadError={this.handleUploadError}
                                            onUploadSuccess={this.handleUploadSuccess}
                                            onProgress={this.handleProgress}
                                        />
                                    </label>
                                </form>
                            )}

                            <h2
                                style={{ marginTop: 20 }}
                            >
                                <a>{this.state.profileInfo.firstName}, {this.state.profileInfo.lastName}</a>
                            </h2>
                            <h3>{this.state.profileInfo.location}</h3>
                        </div>
                        <div className="Profile-state">
                            <ul>
                                <li>
                                    <a href="#" target="_blank">
                                        <i>N{this.state.profileInfo.totalSpent}</i>
                                        <span>Total Spent</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" target="_blank">
                                        <i>{this.state.profileInfo.dateJoined}</i>
                                        <span>Date Joined</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }

        return (<CircularProgress 
            className="circleStatic" 
            size={60}
            style={{
              position: 'absolute', left: '50%', top: '50%',
            }}
        />);
    }
}
const Profile = withRouter(connect(mapStateToProps)(ConnectedProfile));
export default Profile;
