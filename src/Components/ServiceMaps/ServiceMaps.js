import React, { Component } from "react";
import GoogleMap from 'google-map-react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ServicePin from './ServicePin'
import { Icon, Popup, Button } from 'semantic-ui-react'


const CurrentPin = ({text}) => {
    return(
        <div>
            <img
                src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/256/map-marker-icon.png"
                style={{ height: "50px", width: "50px" }}
            />
        </div>
    )
}

const iconStyle = {
    borderRadius: '100px',
    boxShadow: '3px 3px 1px #888888'
}

const InfoBox = (props) => {
    let googleMapLocation = "https://maps.google.com/?q=" + props.lat + ", " + props.lng
    let windowGoogleMap = `window.location= + ${googleMapLocation}`
    console.log("we here", props)
    return (
        <div>
            <Popup 
                trigger={
                    <a target="_blank" 
                        href={googleMapLocation}>
                        <Icon onClick={windowGoogleMap} 
                        className="building icon" 
                        size='big' 
                        style={{transform: 'matrix(-1, 0, 0, 1, 10, 0)'}}/>
                    </a>
                } 
                content={props.service} 
                position='top center' 
                style={{marginLeft: '8px', backgroundColor: 'AliceBlue', border: 'solid 1px light', textAlign: 'center'}}
            />
        </div>
    )
}

class ConnectedServiceMaps extends Component {
    state = {
        serviceName: "",
        lat: "",
        lng: "",
        center: "",
        zoom: this.props.zoom,
        hover: false,
        currentPosition: false,
        infoBox: false
    }

    static defaultProps = {
        zoom: 5,
        center: {
          lat: 	44.50,
          lng: -89.50
        }
    };

    handleOnClick = () => {
        this.setState({
          clicked: !this.state.clicked
        })
    }

    onChildMouseEnter = (num, childProps) => {
        console.log("we here ooo")
        if (childProps.service === undefined){
          return null
        } else {
          this.setState({
            serviceName: childProps.service.name,
            lat: childProps.lat,
            lng: childProps.lng,
            hover: true
          })
        }
    }
    
    onChildMouseLeave = (num, childProps) => {
        console.log("leaving")
        if (childProps.service === undefined){
          return null
        } else {
    
          this.setState({
            lat: "",
            lng: "",
            hover: false
          })
        }
    }
  
    componentDidMount(){
    }
  
    render() {
        const facilities = [
            {
                name: "Jesuye David",
                longitude: -78.94,
                latitude: 35.92,
            },{
                name: "Ibiwunmi Fambegbe",
                longitude: -77.03,
                latitude: 38.88,
            },
        ]

        const infoBox = this.state.hover === true ? <InfoBox lat={this.state.lat} lng={this.state.lng} service={this.state.serviceName} googleMapLocation={googleMapLocation} /> : null

        const servicePins = facilities.map((service, index) => {
            if (service.latitude === null || service.longitude === null){
              return null
            } else{
              return (
                <ServicePin 
                    style={{width: '30px', height: '30px'}} 
                    key={index} 
                    onChildMouseEnter={this.onChildMouseEnter} 
                    onChildMouseLeave={this.onChildMouseLeave} 
                    service={service} 
                    hover={this.state.hover} 
                    lat={service.latitude} 
                    lng={service.longitude}
                    text={"Pinpin"}
                />
              )
            }
        })

      return (   
        <GoogleMap 
            bootstrapURLKeys={{
                key: "AIzaSyAATJtFuqdtim8b6Iabd5Ty0S5NvOekn0Q", 
                language: 'en'
            }}
            center={this.props.center}
            defaultZoom={this.props.zoom}
            yesIWantToUseGoogleMapApiInternals
            hoverDistance={40 / 2}
        >
            {servicePins}
            <CurrentPin
                lat={49.95}
                lng={-89.50}
                text={"Jesuye David"}
            />
            {infoBox}
        </GoogleMap>  
      );
    }
}

const mapStateToProps = state => {
    return {
        loggedInUser: state.loggedInUser,
        someoneLoggedIn: state.someoneLoggedIn,
    };
};

const ServiceMaps = withRouter(connect(mapStateToProps)(ConnectedServiceMaps));
export default ServiceMaps;