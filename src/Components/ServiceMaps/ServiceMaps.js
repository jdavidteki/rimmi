import React, { Component } from "react";
import GoogleMapReact from 'google-map-react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ServicePin from './ServicePin'
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import Api from "../../Api";
import Button from "@material-ui/core/Button";

import "./ServiceMaps.css"

const InfoBox = (props) => {
    let serviceDetails = `${window.location.origin}/rimmi/details/${props.service.VendorID}`
    return (
        <a className="InfoBox"
            href={serviceDetails}
        >
            <div className="InfoBox-container">
                <p>{props.service.FirstName} {props.service.LastName}</p>
                <p>{props.service.MainPhone}</p>
                <p>{props.service.OfficeLine1}, {props.service.OfficeCity}</p>
            </div>
        </a>
    )
}

class ConnectedServiceMaps extends Component {
    state = {
        service: {},
        lat: 0,
        lng: 0,
        center: 0,
        zoom: this.props.zoom,
        hover: false,
        currentPosition: false,
        infoBox: false,
        entered: false,
        loading: false,
        items: [],
    }

    static defaultProps = {
        zoom: 7,
        center: {
          lat: 	9.072264,
          lng: 	7.491302
        }
    };

    async fetchData() {

        this.setState({ loading: true });
    
        // Parse the query string
        let qsAsObject = queryString.parse(this.props.location.search);
    
        let results = await Api.searchItems(qsAsObject);
        
        this.setState({
          items: results.data,
          loading: false,
          totalItemsCount: results.totalLength
        });
    }
    
    componentDidMount() {
      this.fetchData();
    }
    
    onChildMouseEnter = (num, childProps) => {
        if (childProps.service === undefined){
          return null
        } else {
          this.setState({
            service: childProps.service,
            lat: childProps.lat,
            lng: childProps.lng,
            entered: true,
            hover: true
          })
        }
    }

    onChildMouseLeave = (num, childProps) => {
        if (childProps.service === undefined){
          return null
        } else {
    
          this.setState({
            lat: "",
            lng: "",
            hover: false,
            service: {}
          })
        }
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

        const infoBox = this.state.entered === true ? 
            <InfoBox 
                lat={this.state.lat} 
                lng={this.state.lng} 
                service={this.state.service} 
            /> : null

        const servicePins = this.state.items.map((service, index) => {
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

        if (this.state.loading) {
            return (<CircularProgress 
                className="circleStatic" 
                size={60}
                style={{
                position: 'absolute', left: '50%', top: '50%',
                }}
            />);
        }

        return ( 
            <div className="SearchMaps">
                <Button
                    style={{ marginBottom: 20}}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                    this.props.history.push(
                        "/rimmi/servicelist" +
                        this.props.location.search
                    );
                    }}
                >
                    {" "}
                    LIST VIEW
                </Button>

                <GoogleMapReact 
                    bootstrapURLKeys={{
                        key: "AIzaSyAATJtFuqdtim8b6Iabd5Ty0S5NvOekn0Q", 
                        language: 'en'
                    }}
                    defaultCenter={this.props.center}
                    center={this.props.center}
                    defaultZoom={this.props.zoom}
                    onChildMouseEnter={this.onChildMouseEnter}
                    onChildMouseLeave={this.onChildMouseLeave}
                >
                    {servicePins}
                    {infoBox}
                </GoogleMapReact> 
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

const ServiceMaps = withRouter(connect(mapStateToProps)(ConnectedServiceMaps));
export default ServiceMaps;