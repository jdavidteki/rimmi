import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Firebase from "../../Firebase/firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    SafeAreaView, 
    View, 
    StyleSheet, 
    Text, 
    FlatList, 
    TouchableHighlight, 
} from 'react-native';

import "./Appointments.css"

class ConnectedAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allApmts: [],
            upComApmts: [],
            loadedNego: false,
        };
    }

    componentDidMount() {
        this.fetchApmts()
    }

    fetchApmts = () => {
        Firebase.getAllApmts().
        then((val)=> {

            let apmts = [{
                "Subject": "sujecy",
                "StartTime": "2020-01-29T18:00:00",
                "ClientID": "mEuLV2ldS0dltTAU6u4zmbx2Yxw1",
            }]
            let upComing = []

            for (var i = 0; i < val.length; i++) {
                for (var j=0; j<Object.values(val[i]).length; j++){
                    if (Object.values(val[i])[j]["ClientID"] == this.props.loggedInUser.uid){
                        
                        var event = Object.values(val[i])[j]
                        var eventDate = new Date(Date.parse(event["StartTime"].split("T")[0].replace(/-/g, " ")))
                        var todaysDate = new Date();
                        todaysDate.setHours(0, 0, 0, 0);

                        console.log(eventDate, todaysDate)
                        if(todaysDate <= eventDate){
                            apmts.push(Object.values(val[i])[j])  
                        }else{
                            upComing.push(Object.values(val[i])[j])  
                        }
                    }
                }
            }
      
            this.setState({
                allApmts: apmts,
                upComApmts: upComing,
            });
        })
    }

    onPress = (item) =>{}

    renderItem({item, onPress}) {
        return (
            <TouchableHighlight onPress={onPress}>
                <View style={styles.item}>
                    <Text>{item["Subject"]}</Text>
                    <Text>{String(new Date(Date.parse(item["StartTime"].split("T")[0].replace(/-/g, " "))))}</Text>
                    <Text>{item["Message"]}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        if (this.state.allApmts.length > 0){
            return (
                <div className="Appointments-area-container">
                    <Text style={styles.title}>Upcoming Appointments</Text>
                    <SafeAreaView style={styles.container}>
                        <FlatList
                            data={this.state.allApmts}
                            renderItem={({ item }) => 
                                <this.renderItem 
                                    onPress={() => this.onPress(item)}
                                    item={item} 
                                />
                            }
                            keyExtractor={item => item["Subject"]}
                        />
                    </SafeAreaView>
                    <Text style={styles.title}>Completed Appointments</Text>
                    <SafeAreaView style={styles.container}>
                        <FlatList
                            data={this.state.upComApmts}
                            renderItem={({ item }) => 
                                <this.renderItem 
                                    onPress={() => this.onPress(item)}
                                    item={item} 
                                />
                            }
                            keyExtractor={item => item["Subject"]}
                        />
                    </SafeAreaView>
                </div>
            );
        }
        

        return (<CircularProgress 
            className="circleStatic" 
            size={60}
            style={{
              position: 'absolute', left: '50%', top: '50%',
            }}
          />);
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
    item: {
      backgroundColor: '#d5f3f5',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      width: '40%',
    },
    title: {
      fontSize: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
});

const mapStateToProps = state => {
    return {
        loggedInUser: state.loggedInUser,
    };
};

const Appointments = withRouter(connect(mapStateToProps)(ConnectedAppointments));
export default Appointments;