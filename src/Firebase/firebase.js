import firebase from "firebase";
import config from "./config.js";

class Firebase {

  enoughInStock = {
    enough: true,
    name: '',
    noItemsLeft: 0,
  };

  initializeApp = () =>{
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
  };

  db = () => {
    return firebase.database()
  }

  storage = () => {
    return firebase.storage()
  }
    
  userLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              console.warn('Invalid email address format.');
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              console.warn('Invalid email address or password');
              break;
            default:
              console.warn('Check your internet connection');
          }
          reject(error);
        }).then(user => {
          resolve(user);
      });
    })
  };

  createFirebaseAccount = (name, email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        let err =''
        switch (error.code) {
          case 'auth/email-already-in-use':
          err = 'This email address is already taken';
            break;
          case 'auth/invalid-email':
          err = 'Invalid e-mail address format';
            break;
          case 'auth/weak-password':
          err = 'Password is too weak';
            break;
          default:
          err = 'Check your internet connection';
        }
        reject(err);
      }).then(info => {
        if (info) {
          firebase.auth().currentUser.updateProfile({
            displayName: name
          });
          resolve(info);
        }
      });
    });
  };

  sendEmailWithPassword = (email) => {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          console.warn('Email with new password has been sent');
          resolve(true);
        }).catch(error => {
          let errorString = ''

          switch (error.code) {
            case 'auth/invalid-email':
              errorString  = 'Invalid email address format'
              console.warn(errorString);
              break;
            case 'auth/user-not-found':
              errorString = 'User with this email does not exist'
              console.warn(errorString);
              break;
            default:
              errorString = 'Check your internet connection'
              console.warn(errorString);
          }
          reject(errorString);
        });
    })
  };

  getAllServices = () => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/vendors/').
      once('value').
      then(snapshot => {
        if (snapshot.val()){
            resolve(Object.values(snapshot.val()))
          }else{
            resolve({})
        }
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  getApmtsByID = (serviceID) => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/appointments/'+serviceID+'/').
      once('value').
      then(snapshot => {
        if (snapshot.val()){
            resolve(Object.values(snapshot.val()))
          }else{
            resolve({})
        }
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  addApmts = (serviceID, clientID, apmtsObject) => {
    let desc = ""
    if (apmtsObject.Description != undefined){
      desc = apmtsObject.Description
    }

    return new Promise((resolve, reject) => {
      this.db().
      ref('/appointments/' + serviceID + '/').
      push({
        StartTime: JSON.stringify(apmtsObject.StartTime).replace(/['"]+/g, '').replace('.000Z', ''),
        EndTime: JSON.stringify(apmtsObject.EndTime).replace(/['"]+/g, '').replace('.000Z', ''),
        Id: serviceID,
        Subject: apmtsObject.Subject,
        Message: desc,
        ClientID: clientID,
        //TODO: find a better way to implement this timing
        stString: JSON.stringify(apmtsObject.StartTime).replace(/['"]+/g, '').replace('.000Z', ''),
        etString: JSON.stringify(apmtsObject.EndTime).replace(/['"]+/g, '').replace('.000Z', ''),
      }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        reject(error)
      })
    })
  }

  cancelApmts = (vendorID, apmtsObject) => {
    var  db = this.db()
    var query = this.db().ref('/appointments/'+vendorID).orderByKey();
    query.once("value")
      .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var pkey = childSnapshot.key; 
        var chval = childSnapshot.val();

        if((chval.Subject == apmtsObject.Subject) && 
           (chval.StartTime == apmtsObject.stString) &&
           (chval.EndTime == apmtsObject.etString)
        ){
          db.ref("appointments/" + vendorID + "/").
          child(pkey).
          remove();
          return true;
        }
      });
    });
  }

  fetchUserProfile = (uid) => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/profiles/' + uid).
      once('value').
      then(snapshot => {
        resolve(snapshot.val())
      }).
      catch(error => {
        reject(error)
      })
    })
  }

  createUserProfile = (profile) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    return new Promise((resolve, reject) => {
      this.db().
      ref('/profiles/' + profile.uid + '/').
      set({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        password: profile.password,
        dateJoined: today,
        avatar: `https://firebasestorage.googleapis.com/v0/b/rimmi-ff8d1.appspot.com/o/images%2F${profile.uid}.jpeg?alt=media&token=86d4ac39-d703-416a-a257-f209a64b0cb4`
      }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        reject(error)
      })
    })
  }


  vendorSignUp = (vendor) => {
    console.log("vendor", vendor)
    return new Promise((resolve, reject) => {
      this.db().
      ref('/vendors/' + vendor.uid + '/').
      set({
        VendorID: vendor.uid,
        Services: vendor.services,
        Category: vendor.category,
        OfficeZip: vendor.officeZip,
        OfficeState: vendor.officeState,
        OfficeCity: vendor.officeCity,
        OfficeLine1: vendor.officeLine1,
        Twitter: vendor.twitterUsername,
        Facebook: vendor.facebookUsername,
        Description: vendor.discription,
        MainPhone: vendor.mainPhone,
        FirstName: vendor.firstName,
        LastName: vendor.lastName,
        latitude: 8.129319, //need to set the google api to billable for us to geocode https://console.cloud.google.com/google/maps-apis/metrics?project=lovefamz
        longitide: 6.999504,
      }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        reject(error)
      })
    })
  }

  getAllServiceDetails = () => {
    return new Promise((resolve, reject) => {
      this.db().
      ref('/services/').
      once('value').
      then(snapshot => {
        if (snapshot.val()){
            resolve(snapshot.val())
          }else{
            resolve({})
        }
      }).
      catch(error => {
        reject(error)
      })
    })
  }
}

export default new Firebase();