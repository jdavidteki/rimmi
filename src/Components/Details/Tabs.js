import React, { Component } from "react";
import renderHTML from 'react-render-html';
import Firebase from "../../Firebase/firebase.js";
import LinearProgress from "@material-ui/core/LinearProgress";

import "./Tabs.css"

export class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      tabData: null
    }
  }
  
  componentDidMount(){
    this.buildTabDataFromServices()
  }

  clickHandler = (e) => {
    this.setState({
      active: parseInt(e.currentTarget.attributes.num.value)
    })
  }

  buildTabDataFromServices = () => {
    let services = this.props.data.split(",")
    let tabData = []

    Firebase.getAllServiceDetails().
    then(val => {

      for (var i=0; i<services.length; i++){
        let trimService = services[i].toLowerCase().trim()
        let servicesDetails = Object(val)

        if (servicesDetails[trimService] != undefined){
          let detailedServiceList = servicesDetails[trimService]

          for (var j=0; j<detailedServiceList.length; j++){
            if (detailedServiceList[j] != undefined){
              detailedServiceList[j] = 
              //TODO: can this be done more efficiently?
              `<a 
                href="/rimmi/schedular/${this.props.vendorID}/${trimService}/${detailedServiceList[j].split(" ").join("-")}"
                style="text-decoration: none; white-space: nowrap;">
                  <Button
                    class="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary"
                  >
                    ${detailedServiceList[j]}
                  </Button>
              </a>`
            }
          }

          tabData.push([trimService, detailedServiceList.join(" ")])
        }

      }

      this.setState({tabData: tabData})
    })
  }
  
  render() {
    let content = "";

    if (this.state.tabData){
      const tabs = this.state.tabData.map(([label, text], i) => {
        content = this.state.active === i ? text : content;  
        return <li 
                 className={this.state.active === i ? "tab active" : "tab" } 
                 key={label} 
                 num={i}
                 onClick={this.clickHandler}>
          {label}
        </li>;
      });
      
      return ( 
        <section className="tabs">
          <menu>
            <ul>
              {tabs}
            </ul>
          </menu>
          <div>
            {renderHTML(content)}
          </div>
        </section>);
    }

    return <LinearProgress />
  }
}
