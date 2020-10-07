import React, { Component } from "react";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import Api from "../../Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../Firebase/firebase.js";
import Login from "../Login/Login"
import { connect } from "react-redux";
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';

//@syncfusion styling
import "./@syncfusion/ej2-base/styles/material.css";
import "./@syncfusion/ej2-buttons/styles/material.css";
import "./@syncfusion/ej2-calendars/styles/material.css";
import "./@syncfusion/ej2-dropdowns/styles/material.css";
import "./@syncfusion/ej2-inputs/styles/material.css";
import "./@syncfusion/ej2-lists/styles/material.css";
import "./@syncfusion/ej2-navigations/styles/material.css";
import "./@syncfusion/ej2-popups/styles/material.css";
import "./@syncfusion/ej2-splitbuttons/styles/material.css";
import "./@syncfusion/ej2-react-schedule/styles/material.css";

class ConnectedSchedular extends Component {
    constructor() {
      super(...arguments);

      this.state = {
        item: null,
        itemLoading: false,
        data: []
      }

      this.serviceDetails = capitalize_Words(`${this.props.match.params.service} - ${this.props.match.params.details}`)
    }

    getApmts(serviceID) {
      Firebase.getApmtsByID(serviceID).
      then(val => {
        var apmts = []
  
        for (var i = 0; i < val.length; i++) {
          apmts.push(val[i])
        }

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

    sendEmail = (recipient, senderObj, action) => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      
      fetch(`https://uur0cncxx8.execute-api.us-east-1.amazonaws.com/default/rimmiEmailSender?recipient=${recipient}&subject=${senderObj.Subject}&startTime=${senderObj.StartTime}&id=${senderObj.Id}&action=${action}`, 
              requestOptions
      )
      .then(response => response.json())
      .then(data => {
        console.log(data)
      });
    };
  
    componentDidUpdate(prevProps, prevState, snapshot) {
      // If ID of product changed in URL, refetch details for that product
      // if (this.props.match.params.id !== prevProps.match.params.id) {
      //   this.fetchVendorForCalendar(this.props.match.params.id);
      // }
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
        args.data[0].ClientID = this.props.loggedInUser.uid
        Firebase.addApmts(this.props.match.params.id, this.props.loggedInUser.uid, args.data[0])
        this.sendEmail(this.props.loggedInUser.email, args.data[0], "created")
      }

      if (args.requestType == "eventRemove"){
        Firebase.cancelApmts(this.props.match.params.id, args.data[0])
        //TODO: improve confirmation email to check who canceled the appointment
        this.sendEmail(this.props.loggedInUser.email, args.data[0], "canceled")
      }
    }

    eventClick = (args) => {
      console.log("args", args)
      if (args.event.ClientID != this.props.loggedInUser.uid){
        alert("You can't edit an appointment you didnt create")
        args.cancel = true
      }
    }

    content = (props) => {
      return (
      <div>
        {props.elementType === 'cell' ?
            <div>
              <table className="e-popup-table">
                <tbody>
                  <tr>
                    <td>
                      <form>
                        <div>
                          {/* TODO: if this.serviceDetails is undefined remove readonly */}
                          <input className="subject e-field" type="text" name="Subject" placeholder="Add Jesuye" value={this.serviceDetails} readOnly/>
                        </div>
                      </form>
                      </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="e-date-time">
                            <div className="e-date-time-icon e-icons">
                              </div>
                                <div className="e-date-time-details e-text-ellipsis">
                                  {new Date(props.startTime || props.StartTime).toString()}
                                </div>
                            </div>
                        </td>
                      </tr>
                  </tbody>
                </table>
            </div>
            :
            <div className="e-event-content e-template">
              <div className="e-subject-wrap">
                {(props.Subject !== undefined) ?
                  <div className="subject">{props.Subject}</div> : ""}
                {(props.Location !== undefined) ?
                  <div className="location">{props.Location}</div> : ""}
                {(props.Description !== undefined) ?
                  <div className="description">{props.Description}</div> : ""}
              </div>
            </div>
        }
      </div>);
    }

    editorTemplate = (props) => {
      return ((props !== undefined) ? 
        <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}>
          <tbody>
            <tr>
              <td className="e-textlabel">Service</td><td colSpan={4}>
                <form>
                  <input id="Summary" className="e-field e-input" type="text" name="Subject" style={{ width: '100%' }} value={this.serviceDetails}/>
                </form>
              </td>
            </tr>
            <tr><td className="e-textlabel">From</td><td colSpan={4}>
              <DateTimePickerComponent id="StartTime" format='dd/MM/yy hh:mm a' data-name="StartTime" value={new Date(props.startTime || props.StartTime)} className="e-field"></DateTimePickerComponent>
            </td></tr>
            <tr><td className="e-textlabel">To</td><td colSpan={4}>
              <DateTimePickerComponent id="EndTime" format='dd/MM/yy hh:mm a' data-name="EndTime" value={new Date(props.endTime || props.EndTime)} className="e-field"></DateTimePickerComponent>
            </td></tr>
            <tr>
              <td className="e-textlabel">Message to Vendor</td><td colSpan={4}>
                <textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }}></textarea>
              </td>
            </tr>
          </tbody>
        </table> 
        : 
        <div></div>
      );
    }

    render() {
        if (this.props.loggedInUser == null){
          return <Login/>;
        }

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

        return (
          <div>
            <div>
              {this.state.item.FirstName} {this.state.item.LastName}'s Calendar
            </div>
            <ScheduleComponent 
              height='900px' 
              actionBegin={this.onActionBegin}
              quickInfoTemplates={{content: this.content}}
              editorTemplate={this.editorTemplate}
              eventClick={this.eventClick}
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


function capitalize_Words(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}