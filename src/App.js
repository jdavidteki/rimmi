import React, { Component } from "react";
import Header from "./Components/Header/Header.js";
import Searcher from "./Components/Searcher/Searcher.js";
import ServiceList from "./Components/ServiceList/ServiceList.js";
import Footer from "./Components/Footer/Footer.js";
import { StyleSheet } from 'react-native';
import { Switch, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Details from "./Components/Details/Details";
import Profile from "./Components/Profile/Profile";
import Schedular from "./Components/Schedular/Schedular";

import "./App.css";

//TODO: change evrything product to service
//investigage why its a pain to upload json to firebase

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <div className="content">
            <Switch>
              <Route path="/rimmi" exact component={Searcher} />
              <Route path="/rimmi/servicelist/" component={ServiceList} />
              <Route path="/rimmi/login" component={Login} />
              <Route path="/rimmi/signup" component={SignUp} />
              <Route path="/rimmi/details/:id" component={Details} />
              <Route path="/rimmi/profile" component={Profile} />
              <Route path="/rimmi/schedular/:id" component={Schedular} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
                )}
              />
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

