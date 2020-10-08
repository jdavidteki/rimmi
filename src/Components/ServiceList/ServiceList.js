import React, { Component } from "react";
import Item from "../Item/Item";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
import Api from "../../Api";
import ProductsHeader from "../ProductsHeader/ProductsHeader"
import Button from "@material-ui/core/Button";
import { geolocated } from "react-geolocated";

class ServiceList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      totalItemsCount: null,
      items: []
    };
    this.updateQueryString = this.updateQueryString.bind(this);
  }

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

  componentDidUpdate(prevProps, prevState, snapshot) {

    let currentQS = queryString.parse(this.props.location.search);
    let oldQS = queryString.parse(prevProps.location.search);
    
    let areSameObjects = (a, b) => {
      if (Object.keys(a).length !== Object.keys(b).length) return false;
      for (let key in a) {
              if (a[key] !== b[key]) return false;
      }
      return true;
    }

    // We will refetch products only when query string changes.
    if (!areSameObjects(currentQS,oldQS )) {
      this.fetchData();
    }
  }

  render() {
    let parsedQS = queryString.parse(this.props.location.search);

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
      <div>
        <Button
            style={{ marginBottom: 20}}
            variant="outlined"
            color="primary"
            onClick={() => {
            this.props.history.push(
                "/rimmi/servicemaps" +
                this.props.location.search
            );
            }}
        >
            {" "}
            MAP VIEW
        </Button>

        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <ProductsHeader
            parsedQS={parsedQS}
            updateQueryString={this.updateQueryString}
            totalItemsCount={this.state.totalItemsCount} 
          />

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {this.state.items.map(item => {
              return <Item key={item.VendorID} item={item} />;
            })}
          </div>
        </div>

        {/* TODO implement paging*/}
        {/* <Paging
          parsedQS={parsedQS}
          updateQueryString={this.updateQueryString}
          totalItemsCount={this.state.totalItemsCount}
        /> */}
      </div >
    );
  }
}

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

export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(ServiceList);
