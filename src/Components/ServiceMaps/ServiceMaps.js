import React, { Component } from "react";
import GoogleMapReact from 'google-map-react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ServicePin from './ServicePin'
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import Api from "../../Api";
import Button from "@material-ui/core/Button";
import ProductsHeader from "../ProductsHeader/ProductsHeader"
import { geolocated } from "react-geolocated";

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
    
        let filteredResult = []
    
        for(var i=0; i<results.data.length; i++){
          if (this.closeToUserLoc(results.data[i].longitude, results.data[i].latitude)){
            filteredResult.push(results.data[i])
          }
        }
        
        this.setState({
          items: filteredResult,
          loading: false,
          totalItemsCount: filteredResult.length
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

    updateQueryString(newValues) {
        let currentQS = queryString.parse(this.props.location.search);
        let newQS = { ...currentQS, ...newValues };
        this.props.history.push("/rimmi?" + queryString.stringify(newQS));
    }

    closeToUserLoc(lat, long){
        let userLat = 0
        let userLong = 0
        let distanceFromUser = calcDistance(lat, long, userLat, userLong)
    
        if (this.props.coords){
          userLat = this.props.coords.latitude
          userLong = this.props.coords.longitude
        }
        // TODO: fix this for center of nigeria
        distanceFromUser = 6
    
        if( distanceFromUser > 5){
          return true
        }
        return false
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
        let parsedQS = queryString.parse(this.props.location.search);

        const infoBox = this.state.entered === true && 
            this.state.service.VendorID != undefined ? 
                <InfoBox 
                    lat={this.state.lat} 
                    lng={this.state.lng} 
                    service={this.state.service} 
                /> 
            : null

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
            return (
                <CircularProgress 
                    className="circleStatic" 
                    size={60}
                    style={{
                    position: 'absolute', 
                    left: '50%', 
                    top: '50%', 
                    marginTop: '-50px', 
                    marginLeft: '-30px'
                    }}
                />
            );
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

                <ProductsHeader
                    parsedQS={parsedQS}
                    updateQueryString={this.updateQueryString}
                    totalItemsCount={this.state.totalItemsCount} 
                />

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

function calcDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
  }
}

const ServiceMaps = withRouter(connect(mapStateToProps)(ConnectedServiceMaps));

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(ServiceMaps);
