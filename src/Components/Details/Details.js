import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";
import Item from "../Item/Item";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";

class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {
      relatedServices: [],
      quantity: 1,
      item: null,
      itemLoading: false
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



  render() {
    if (this.state.itemLoading) {
      return <CircularProgress className="circular" />;
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
        <div style={{ display: "flex" }}>
          <img src={this.state.item.ImageURL} alt="" width={250} height={250}
            style={{
              border: "1px solid lightgray",
              borderRadius: "5px",
              objectFit: "cover"
            }} />
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              display: "flex",
              flexDirection: "column"
            }}
          >

            <div style={{
              fontSize: 16,

            }}>
              Price: ${this.state.item.price}
            </div>
            {this.state.item.popular && (
              <div style={{ fontSize: 14, marginTop: 5, color: "#228B22" }}>
                (Popular product)
              </div>
            )}

            <TextField
              type="number"
              value={this.state.quantity}
              style={{ marginTop: 20, marginBottom: 10, width: 70 }}
              label="Quantity"
              inputProps={{ min: 1, max: 10, step: 1 }}
              onChange={e => {
                this.setState({ quantity: parseInt(e.target.value) });
              }}
            />
            <Button
              style={{ width: 170, marginTop: 5 }}
              color="primary"
              variant="outlined"
              onClick={() => {
                this.props.history.push("/rimmi/schedular/" + this.props.match.params.id);
              }}
            >
              Schedule <AddShoppingCartIcon style={{ marginLeft: 5 }} />
            </Button>
          </div>
        </div>

        {/* Product description */}
        <div
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 22
          }}
        >
          About Service
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

        {/* Servics rendered */}
        <div
          style={{
            maxHeight: 200,
            fontSize: 13,
            marginTop: 10,
            overflow: "auto"
          }}
        >
          {this.state.item.Services ? this.state.item.Services : ""}
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
