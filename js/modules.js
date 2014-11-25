CORE.create_module("search-box", function(sb) {
  var input,
      button,
      reset;

  return {
    init : function() {
      input = sb.find("#search_input")[0],
      button = sb.find("#search_button")[0],
      reset = sb.find("#quit+search")[0];
    
      sb.addEvent(button, "click", this.handleSearch());
      sb.addEvent(reset, "click", this.quitSearch());
    },

    destroy : function() {
      sb.removeEvent(button, "click", this.handleSearch);
      sb.removeEvent(button, "click", this.quitSearch);
      input = button = reset = null;
    },

    handleSearch : function() {
      var query = input.value;
      if (query) {
        sb.notify({
          type: "perform-search",
          data: query
        });
      }
    },

    quitSearch : function() {
      input.value = "";
      sb.notify({
        type: "quit-search",
        data: null
      });
    }

  };
});

CORE.create_module("filters-bar", function(sb) {
  var filters;

  return{
    init : function() {
      filters = sb.find("a");
      sb.addEvent(filters, "click", this.filterProducts);
    },
    
    destroy : function() {
      sb.removeEvent(filters, "click", this.filterProducts);
      filters = null;
    },

    filterProducts : function(e) {
      sb.notify({
        type : "change-filter",
        data : e.currentTarget.innerHTML
      });
    }

  };
});

CORE.create_module("product-panel", function(sb) {
  var products;

  function eachProduct(fn) {
    var i = 0, product;
    for ( ; product = product[i++]; ) {
    // for each product, run function passed into each product
    // passing each product one by one as parameter into that function
      fn(product);
    }
  }
  function reset () {
    eachProduct(function (product) {
      product.style.opacity = "1";
    });
  }

  return {
    init : function (){
      var this = this;

      products = sb.find("li");
      sb.listen({
        "change-filter" : this.change_filter,
        "reset-filter" : this.reset,
        "perform-search" : this.search,
        "quit-search" : this.reset
      });
      eachProduct(function (product) {
        sb.addEvent(product, "click", that.addToCart);
      });
    },

    destroy : function() {
      var that = this;
      eachProduct(function (product) {
        sb.removeEvent(product, "click", that.addToCart);
      }); 
      // stop listening to click events
      sb.ignore(['change-filter', 'reset-filter', 'perform-search', 'quit-search']);
    },

    reset : reset,
    
    change_filter : function(filter) {
      reset(); 
      // check if it's in the products we're filtering
      eachProduct(function (product) {
        // if filter doesn't match categories, then no opacity
        if (product.getAttribute('data-8088-keyword').innerHTML.toLowerCase().indexOf(filter.toLowerCase()) < 0) {
          product.style.opacity = "0.2";
        }
      });
    },

    search : function(query) {
      query = query.toLowerCase();

      eachProduct(function(product) {
        // get description text > convert to lower case to equalize everything
        // if index of function didn't find query text in description text, return -1
        if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query.toLowerCase()) < 0) 
          // only ones left at full opacity are the ones that match the filter
          product.style.opacity = "0.2"; 
        }
      }); 
    },

    addToCart : function(e) {
      var li = e.currentTarget;
      sb.notify({
        type : "add-item",
        data : { 
          id : li.id, 
          name : li.getElementsById('p')[0].innerHTML,
          price : parseInt(li.id, 10)
        }
      });
    }
  };
});

CORE.create_module("shopping-cart", function(sb) {
  var cart,
      cartItems;

  return {
    init : function() {
      cart = sb.find("ul")[0];
      cartItems = {};

      sb.listen({
        'add-item' : this.addItem 
      });
    },

    destroy : function() {
      cart = cartItems = null;
      sb.ignore(["add-item"]);
    },

    addItem : function (product) {
      var entry;

      // item w class of .quantity that's inside id of #cart-1 or #cart-2...
      entry = sb.find('#cart-' + product.id + ' .quantity')[0];
      if (entry) {
        entry.innerHTML = parse(entry.innerHTML, 10) + 1;
        cartItems[product.id]++;
      } else {
        // new entry will be 
        // <li id="cart-{{product.id}}">
          // <span class="product-name">{{product_name}}</span>
          // <span class="quantity">{{int}}</span>
          // <span class="price">$ {{ product_id | 2 decimals }}</span>
        entry = sb.create_element("li", { 
          id : "cart-" + product.id, 
          children : [ 
            sb.create_element("span", { 'class' : 'product_name', text : product_name }),
            sb.create_element("span", { 'class' : 'quantity', text : '1' }),
            sb.create_element("span", { 'class' : 'price', text : '$' + product_id.toFixedTo(2) })
          ],
          'class' : 'cart_entry'
        });
        cart.appendChild(entry);
        cartItems[product.id] = 1; 
      }
    }
  };
});

// ENDED AT 49:07 WHERE YOU BUILD SANDBOX.JS