import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";
import Item from "../Item/Item";
import { connect } from "react-redux";
import { Tabs } from './Tabs'

import "./Details.css"
class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;
    this.state = {
      relatedServices: [],
      quantity: 1,
      item: null,
      itemLoading: false,
    };
  }

  async fetchProductAndRelatedServices(serviceID) {
    this.setState({ itemLoading: true });

    let item = await Api.getItemUsingID(serviceID);

    let relatedServices = await Api.searchItems({
      services: item.Services,
    });

    // Make sure this component is still mounted before we set state..
    if (this.isCompMounted) {
      this.setState({
        item,
        quantity: 1,
        relatedServices: relatedServices.data.filter(x => x.VendorID !== item.VendorID),
        itemLoading: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    // If ID of product changed in URL, refetch details for that product
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchProductAndRelatedServices(this.props.match.params.id);
    }

  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchProductAndRelatedServices(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }


  handleSelect(key){
    console.log('selected' + key);
    this.setState({ key: key });
  }

  render() {
    if (this.state.itemLoading) {
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

    if (!this.state.item) {
      return null;
    }

    return (
      <div style={{ padding: 10 }}>
        <div
          style={{
            marginBottom: 20,
            marginTop: 10,
            fontSize: 22
          }}
        >
          {this.state.item.FirstName} {this.state.item.LastName}
        </div>
        <div className="Details-hero" style={{ display: "flex" }}>
          <img src={this.state.item.ImageURL} alt="" width={250} height={250}
            style={{
              border: "1px solid lightgray",
              borderRadius: "5px",
              objectFit: "cover"
            }} />
          <div 
            className="Details-aboutMe"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}
          >

            {/* Product description */}
            <div
              style={{
                marginTop: 20,
                marginBottom: 20,
                fontSize: 22
              }}
            >
              About Me
            </div>
            <div
              style={{
                maxHeight: 200,
                fontSize: 13,
                overflow: "auto"
              }}
            >
              {this.state.item.Description ? this.state.item.Description : "Not available"}
            </div>
          </div>
        </div>

        {/* Servics rendered */}
        <div
          style={{
            maxHeight: 200,
            fontSize: 13,
            marginTop: 10,
            overflow: "auto"
          }}
        >
          <div
            style={{
              marginTop: 20,
              marginBottom: 20,
              fontSize: 22
            }}
          >
            My Services
          </div>

          {this.state.item.Services.length > 0 ?
            (
              <Tabs data={this.state.item.Services} vendorID={this.props.match.params.id}/>
            ) 
            :""
          }
        </div>
        {/* relatedServices */}
        <div
          style={{
            marginTop: 20,
            marginBottom: 10,
            fontSize: 22
          }}
        >
          Related Services
        </div>
        {
          this.state.relatedServices.slice(0, 3).map(x => {
            return <Item key={x.id} item={x} />;
          })
        }
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

let Details = connect(mapStateToProps)(ConnectedDetails);
export default Details;
