import React from 'react'

class ServicePin extends React.Component {

  render(){
    return(
        <div>
            <img
            src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/256/map-marker-icon.png"
            style={{ height: this.props.style.height, width: this.props.style.width }}
            />
        </div>
    )
  }
}

export default ServicePin