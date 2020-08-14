import React, { Component } from "react";
import Header from "./Components/Header/Header.js";
import Searcher from "./Components/Searcher/Searcher.js";
import ProductList from "./Components/ProductList/ProductList.js";
import Result from "./Components/Result/Result.js";
import Footer from "./Components/Footer/Footer.js";
import { StyleSheet } from 'react-native';
import { Switch, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";

import "./App.css";

//TODO: change evrything product to service

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <div className="content">
            <Switch>
              <Route path="/" exact component={Searcher} />
              <Route path="/productlist/" component={ProductList} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
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

