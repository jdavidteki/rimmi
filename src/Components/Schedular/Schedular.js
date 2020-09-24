import React, { Component } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import Api from "../../Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../Firebase/firebase.js";
import Login from "../Login/Login"
import { connect } from "react-redux";

//syncfusion styling
import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../../../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";

class ConnectedSchedular extends Component {
    constructor() {
      super(...arguments);

      this.state = {
        item: null,
        itemLoading: false,
        data: []
      }
    }

    getApmts(serviceID) {
      Firebase.getApmtsByID(serviceID).
      then(val => {
        var apmts = []
  
        for (var i = 0; i < val.length; i++) {
          apmts.push(val[i])
        }
  
        console.log("apmts", apmts)
        this.setState({
          data: apmts,
        });
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

    onActionBegin = (args) => {
      if (args.requestType == 'eventCreate'){
        Firebase.addApmts(this.props.match.params.id, args.data[0])
      }
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
            <div>
              {this.state.item.FirstName} {this.state.item.LastName}'s Calendar
            </div>
            <ScheduleComponent 
              height='600px' 
              actionBegin={this.onActionBegin}
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

