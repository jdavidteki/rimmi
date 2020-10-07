import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";


class ConnectedItem extends Component {
  render() {
    return (
      <Card
        style={{ width: 200, height: 270, margin: 10, display: "inline-block" }}
      >
        <CardActionArea
          onClick={() => {
            this.props.history.push("/rimmi/details/" + this.props.item.VendorID);
          }}
        >
          <CardMedia
            style={{ height: 140 }}
            image={this.props.item.ImageURL}
          />
          <CardContent>
            <div
              style={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {this.props.item.FirstName} {this.props.item.LastName}
            </div>
            <div style={{ color: "#1a9349", fontWeight: "bold" }}>
              {this.props.item.MainPhone}<br/>
              {this.props.item.OfficeLine1}, {this.props.item.OfficeCity}
            </div>

          </CardContent>
        </CardActionArea>
        <CardActions
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 50 }}
        >
          <Button
            size="small"
            style={{ marginRight: 50 }}
            onClick={() => {
              this.props.history.push("/rimmi/details/" + this.props.item.VendorID);
            }}
          >
            {" "}
            Details
          </Button>
        </CardActions>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

export default withRouter(connect(mapStateToProps)(ConnectedItem));
