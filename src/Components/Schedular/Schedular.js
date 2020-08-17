import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar} from "daypilot-pro-react";
import Api from "../../Api";
import CircularProgress from "@material-ui/core/CircularProgress";

class Schedular extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {

      item: null,
      itemLoading: false,

      startDate: "2020-02-02",
      viewType: "Week",
      cellHeight: 30,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: function (args) {
        DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function(modal) {
          var dp = args.control;
          dp.clearSelection();
          if (!modal.result) { return; }
          dp.events.add(new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result
          }));
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

    // load resource and event data
    this.setState({
      startDate: DayPilot.Date.today(),
      events: [
        {
          id: 1,
          text: "Event 1",
          start: DayPilot.Date.today().addHours(10),
          end: DayPilot.Date.today().addHours(14)
        },
        {
          id: 2,
          text: "Event 2",
          start: "2020-02-02T10:00:00",
          end: "2020-02-02T11:00:00",
          barColor: "#38761d",
          barBackColor: "#93c47d"
        }
      ]
    });

  }

  render() {
    if (this.state.itemLoading) {
      return <CircularProgress className="circular" />;
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

export default Schedular;
