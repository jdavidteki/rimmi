import Firebase from "./Firebase/firebase.js";

class Api {
  constructor(props) {
    Firebase.initializeApp()
  }

  getItemUsingID(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Firebase.getAllServices().
        then(val => {
          var allProducts = []

          for (var i = 0; i < val.length; i++) {
            allProducts.push(val[i])
          }

          let res = allProducts.filter(x => x.VendorID === id);
          resolve(res.length === 0 ? null : res[0]);
        })
      }, 500);
    });
  }

  sortByPrice(data, sortval) {
    if (sortval !== "lh" && sortval !== "hl") return data;

    let items = [...data];

    if (sortval === "lh") {
      items.sort((a, b) => a.price - b.price);
    } else {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }

  searchItems({
    category = "All categories",
    term = "",
    sortValue = "lh",
    itemsPerPage = 10,
    usePriceFilter = "false",
    minPrice = 0,
    maxPrice = 1000,
    page = 1
  }) {
    
    // Turn this into a boolean
    usePriceFilter = usePriceFilter === "true" && true;
    
    return new Promise((resolve, reject) => {

      //TODO: modify this so that whole services are not always returned
      setTimeout(() => {
        Firebase.getAllServices().
        then(val => {
          var allProducts = []

          for (var i = 0; i < val.length; i++) {
            allProducts.push(val[i])
          }

          let data = allProducts.filter(item => {
            if (
              usePriceFilter &&
              (item.price < minPrice || item.price > maxPrice)
            ) {
              return false;
            }
  
            //TODO: use a.i to determine category parameters to be used so as to reduce filter times for scaling purposes
            // if (category === "popular") {
            //   return item.popular;
            // }
  
            if (category !== "All categories" && category !== item.Category)
              return false;
            
            if (term && !item.Services.toLowerCase().includes(term.toLowerCase()))
              return false;
  
            return true;
          });
  
          let totalLength = data.length;
  
          data = this.sortByPrice(data, sortValue);
  
          data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
          resolve({ data, totalLength });
        })
      }, 500);
    });
  }
}

export default new Api();
