import React, { Component } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import { Helmet } from "react-helmet";
import Api from "../../Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../Firebase/firebase.js";
import Login from "../Login/Login"
import { connect } from "react-redux";

class ConnectedSchedular extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      item: null,
      itemLoading: false,
      data: []
    }

    this.data = [
        {
            Id: 2,
            Subject: 'Paris',
            StartTime: new Date(2020, 8, 21, 3, 0),
            EndTime: new Date(2020, 8, 21, 4, 30),
        },
      ];
    }

    getApmts(serviceID) {
      Firebase.getApmtsByID(serviceID).
      then(val => {
        var apmts = []
  
        for (var i = 0; i < val.length; i++) {
          apmts.push(val[i])
        }
  
        console.log("apmts", apmts)
        if (this.isCompMounted) {
          this.setState({
            data: apmts,
          });
        }
      })
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
  
    componentDidUpdate(prevProps, prevState, snapshot) {
      // If ID of product changed in URL, refetch details for that product
      if (this.props.match.params.id !== prevProps.match.params.id) {
        this.fetchVendorForCalendar(this.props.match.params.id);
      }
  
    }

    componentWillUnmount() {
      this.isCompMounted = false;
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

        return (
              <div>
                <Helmet>
                  <title>{this.state.item.FirstName} {this.state.item.LastName}'s Schedule</title>
                  <link href="//cdn.syncfusion.com/ej2/ej2-base/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-buttons/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-calendars/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-dropdowns/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-inputs/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-navigations/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-popups/styles/material.css" rel="stylesheet" />
                  <link href="//cdn.syncfusion.com/ej2/ej2-react-schedule/styles/material.css" rel="stylesheet" />
                  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" />
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.38/system.js"></script> 
                  {/* <script src="systemjs.config.js"></script> */}
                </Helmet>
                <div>
                  {this.state.item.FirstName} {this.state.item.LastName}'s Calendar
                </div>
                <ScheduleComponent 
                  height='550px' 
                  selectedDate={new Date(2020, 8, 21)} 
                  eventSettings={{ 
                    dataSource: this.state.data
                  }}>
                    <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
                </ScheduleComponent>
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

