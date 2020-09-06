import React, { Component } from "react";
import renderHTML from 'react-render-html';

import "./Tabs.css"

// const TAB_DATA = [
//   ["about", "lorem ipsum dolor sit amet"],
//   ["contact", `<a href="facebook.com">jesuye</a> Curabitur \n in augue erat. Vestibulum in fermentum ante, sit amet consectetur neque. Maecenas tempor nisl sollicitudin, blandit sapien ut, fermentum metus.`],
//   ["portfolio", "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam aliquam, nisi vitae maximus tincidunt, justo leo auctor neque, et fermentum ante libero ac libero."],
//   ["cool stuff", ""]
// ];

export class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0
    }
  }
  
  clickHandler = (e) => {
    this.setState({
      active: parseInt(e.currentTarget.attributes.num.value)
    })
  }

  buildTabDataFromServices(){
    let services = this.props.data.split(",")
    let tabData = []

    for (var i=0; i<services.length; i++){
      let trimService = services[i].trim()

      if( trimService != ""){
        tabData.push([trimService, trimService])
      }
    }

    return tabData
  }
  
  render() {
    let content = "";
    let TAB_DATA = this.buildTabDataFromServices()

    const tabs = TAB_DATA.map(([label, text], i) => {
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
}
