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
            upComingApmts: [],
            prevApmts: [],
            loadedNego: false,
        };
    }

    componentDidMount() {
        this.fetchApmts()
    }

    fetchApmts = () => {
        Firebase.getAllApmts().
        then((val)=> {

            let upComingApmts = []
            let prevApmts = []

            for (var i = 0; i < val.length; i++) {
                for (var j=0; j<Object.values(val[i]).length; j++){
                    if (Object.values(val[i])[j]["ClientID"] == this.props.loggedInUser.uid){
                        
                        var event = Object.values(val[i])[j]
                        var eventDate = new Date(Date.parse(event["StartTime"].split("T")[0].replace(/-/g, " ")))
                        var todaysDate = new Date();
                        todaysDate.setHours(0, 0, 0, 0);

                        console.log(eventDate, todaysDate)
                        if(todaysDate <= eventDate){
                            upComingApmts.push(Object.values(val[i])[j])  
                        }else{
                            prevApmts.push(Object.values(val[i])[j])  
                        }
                    }
                }
            }
      
            this.setState({
                upComingApmts: upComingApmts,
                prevApmts: prevApmts,
            });
        })
    }

    onPress = (item) =>{}

    renderItem({item, onPress}) {
        return (
            <TouchableHighlight onPress={onPress}>
                <View className="Appointment-item" style={styles.item}>
                    <Text>{item["Subject"]}</Text>
                    <Text>{String(new Date(Date.parse(item["StartTime"].split("T")[0].replace(/-/g, " "))))}</Text>
                    <Text>{item["Message"]}</Text>
                    <Text>Vendor ID: {item["Id"]}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <div className="Appointments-area-container">
                
                {this.state.upComingApmts.length > 0 ? 
                    (
                        <div>
                            <Text style={styles.title}>Upcoming Appointments</Text>
                            <SafeAreaView style={styles.container}>
                                <FlatList
                                    data={this.state.upComingApmts}
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
                    ):(
                        <CircularProgress 
                            className="circleStatic" 
                            size={60}
                            style={{
                            position: 'absolute', left: '50%', top: '50%',
                            }}
                        />
                    )
                }

                {this.state.prevApmts.length > 0 ?
                (
                    <div>
                        <Text style={styles.title}>Previous Appointments</Text>
                        <SafeAreaView style={styles.container}>
                            <FlatList
                                data={this.state.prevApmts}
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
                ):(
                    <div></div>
                )}
            </div>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 15,
      backgroundColor: '#fff',
    },
    item: {
      backgroundColor: '#f5f5f5',
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