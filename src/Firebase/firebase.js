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
    return new Promise(resolve => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          console.warn('Email with new password has been sent');
          resolve(true);
        }).catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              console.warn('Invalid email address format');
              break;
            case 'auth/user-not-found':
              console.warn('User with this email does not exist');
              break;
            default:
              console.warn('Check your internet connection');
          }
          resolve(false);
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

  addApmts = (serviceID, apmtsObject) => {
    console.log("serviceID", serviceID, apmtsObject)
    return new Promise((resolve, reject) => {
      this.db().
      ref('/appointments/' + serviceID + '/').
      push({
        start: apmtsObject.start,
        end: apmtsObject.end,
        id: apmtsObject.id,
        text: apmtsObject.text
      }).
      then(() => {
        resolve(true)
      }).catch(error =>{
        reject(error)
      })
    })
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