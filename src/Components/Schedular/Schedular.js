import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar} from "daypilot-pro-react";
import Api from "../../Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../Firebase/firebase.js";
import Login from "../Login/Login"
import { connect } from "react-redux";

class ConnectedSchedular extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {

      item: null,
      itemLoading: false,

      //calendar config
      startDate: "2020-02-02",
      viewType: "Week",
      cellHeight: 30,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: function (args) {
        DayPilot.Modal.prompt("Create a new event:", "leave some notes").then(function(modal) {
          var dp = args.control;
          dp.clearSelection();
          if (!modal.result) { return; }
          dp.events.add(new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result
          }));
          Firebase.addApmts(
            props.match.params.id, 
            {
              start: args.start.value,
              end: args.end.value,
              id: DayPilot.guid(),
              text: modal.result
            }
          )
        });
      },
      onBeforeEventRender: args => {
        args.data.backColor = "#93c47d";
        args.data.barHidden = true;
        args.data.fontColor = "white";
        args.data.borderColor = "darker";

        args.data.areas = [
          {right: 6, top: 6, width: 17, height: 17, image: "info-17-inverted-rounded-semi.svg", onClick: args=> this.showDetails(args.source)},
          ];
      },
      onBeforeEventDomAdd: args => {
        args.element = <div>
          {args.e.data.text}
          <div style={{position: "absolute", right: "25px", top: "5px", height: "17px", width: "17px"}}
               onClick={()=>this.showDetails(args.e)}>
            <img src={"info-17-semi.svg"} alt={"Info icon"}/>
          </div>
        </div>;
      }
    };
  }

  async fetchVendorForCalendar(serviceID) {
    this.setState({ itemLoading: true });

    let item = await Api.getItemUsingID(serviceID);

    // Make sure this component is still mounted before we set state..
    if (this.isCompMounted) {
      this.setState({
        item,
        itemLoading: false,
      });
    }
  }

  getApmts(serviceID) {
    Firebase.getApmtsByID(serviceID).
    then(val => {
      var apmts = []

      for (var i = 0; i < val.length; i++) {
        apmts.push(val[i])
      }

      if (this.isCompMounted) {
        this.setState({
          startDate: DayPilot.Date.today(),
          events: apmts,
        });
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If ID of product changed in URL, refetch details for that product
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchVendorForCalendar(this.props.match.params.id);
    }

  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }

  showDetails(e) {
   DayPilot.Modal.alert(e.data.text);
  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchVendorForCalendar(this.props.match.params.id);
    this.getApmts(this.props.match.params.id)
  }

  render() {
    if (this.props.loggedInUser == null){
      return <Login/>;
    }

    if (this.state.itemLoading) {
      return (<CircularProgress 
        className="circleStatic" 
        size={60}
        style={{
          position: 'absolute', left: '50%', top: '50%',
        }}
      />);
    }

    if (!this.state.item) {
      return null;
    }
    
    var {...config} = this.state;
    return (
      <div>
        <div>
          {this.state.item.FirstName} {this.state.item.LastName}'s Calendar
        </div>
        <DayPilotCalendar
          {...config}
          ref={component => {
            this.calendar = component && component.control;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

let Schedular = connect(mapStateToProps)(ConnectedSchedular);
export default Schedular;

