
let isUserLoggedIn=false;
let customer=[];
let products;
let cart = [];
let subtotal = 0; // Initialize subtotal
const issue="due to server issues"
function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Validate inputs
    const isPasswordValid = validateUnique(password, "Password", 8, 32,"login");
    const isUsernameValid = validateUnique(username, "Username", 3, 15,"login");

    if (isUsernameValid && isPasswordValid) {
        // Proceed with API call if validation passed
        axios.get('http://localhost:3000/api/login', {
            params: {
                username: username,
                password: password
            }

        }
    )
     .then(function(response) {
            // Check if login was successful based on response data
            if (response.data.success) {
                console.log(response.data);
                isUserLoggedIn = true;
                document.getElementById('loginbutton').style.display = 'none';
                showSection("Colpg");
            } else {
                // Handle login failure when success is false
                console.error('Login failed: ', response.data.message);
                document.getElementById('loginerror').innerHTML = "Login Failed";
            }
        })
        .catch(function(error) {
             console.error(error.message);
             document.getElementById('loginerror').innerHTML = "Login Failed";
        })

    }
}
function submitSignUp() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const phoneNumber = document.getElementById('newPhone').value;
    // Validate inputs
    const isPhoneNumberValid=validateNumber(phoneNumber, "Phone Number", 5, 15, "signup")
    const isPasswordValid = validateUnique(password, "Password", 8, 32,"signup");
    const isEmailValid = validateEmail(email, "Email", 5, 320,"signup");
    const isUsernameValid = validateUnique(username, "Username", 3, 15,"signup");

    if (isUsernameValid && isPasswordValid && isEmailValid &&isPhoneNumberValid) {
        // Proceed with API call if validation passed
        axios.get('http://localhost:3000/api/signup', {
            params: {
                username: username,
                email: email,
                password: password,
                phoneNumber:phoneNumber
            }
        })
         .then(function(response) {
            // Check if sign-up was successful based on response data
            if (response.data.success) {
                console.log(response.data);
                switchToLogin(); // Navigate to login or next step
            } else {
                // Handle sign-up failure when success is false
                console.error('Sign-up failed: ', response.data.message);
                document.getElementById('signuperror').innerHTML = "Sign-Up Failed: " + response.data.message;
            }
        })
        .catch(function(error) {
             console.error(error.message);
            document.getElementById('signuperror').innerHTML = `SignUp Failed ${issue}`;
        })
        
    }
}
function submitNewPassword() {
    
    const phoneRecall = document.getElementById('phoneRecall').value;
     const replacedPassword = document.getElementById('replacedPassword').value;
     const isPasswordValid=validateUnique(replacedPassword, "Password", 8, 32,"forgot");
   if(isPasswordValid){
        // Proceed with API call if validation passed
        axios.get('http://localhost:3000/api/forgot', {
            params: {
                phoneRecall:phoneRecall,
                replacedPassword:replacedPassword
            }
        })
         .then(function(response) {
            // Check if it was successful based on response data
            if (response.data.success) {
                console.log(response.data);
                switchToLogin(); // Navigate to login or next step
            } else {
                // Handle sign-up failure when success is false
                console.error('retrieval failed: ', response.data.message);
                document.getElementById('forgoterror').innerHTML = "Retreival Failed: " + response.data.message;
            }
        })
        .catch(function(error) {
             console.error(error.message);
            document.getElementById('forgoterror').innerHTML = "Retrieve Failed";
        })
    }
    
    
}
function fetchCategories(category_id) {
    axios.get("http://localhost:3000/api/categories/" + category_id + "/products")
        .then(function(response) {
            products = response.data; // Store the fetched products
            var output = ""; // Initialize output variable

            // Loop through the products array and create img elements
            for (var i = 0; i < products.length; i++) {
                output += `<div class="product-item">
                    <img src="./images/${products[i].image_url}" class="product-image" onclick="hideProducts(${i})">
                    <p class="product-name">${products[i].product_name}</p>
                    <p class="product-price">${products[i].price}</p>
                </div>`;
            }

            // Display the products in the categories section
            document.getElementById("categories").innerHTML = output;
            document.getElementById("categories").style.display = "grid";
            document.getElementById("Colpg").style.display = "none"; // Hide the element with id 'Colpg'
        })
        .catch(function(error) {
            console.error('Error fetching categories:', error.message);
           
        });
}
function fetchUserSearch() {
    let search=document.getElementById('search').value
    axios.get('http://localhost:3000/api/search',
      {  params :{
        search:search
      }
        
    })
        .then(function(response) {
            products = response.data; // Store the fetched products
            var output = ""; // Initialize output variable

            // Loop through the products array and create img elements
            for (var i = 0; i < products.length; i++) {
                output += `<div class="product-item">
                    <img src="./images/${products[i].image_url}" class="product-image" onclick="hideProducts(${i})">
                    <p class="product-name">${products[i].product_name}</p>
                    <p class="product-price">${products[i].price}</p>
                </div>`;
            }

            // Display the products in the categories section
            document.getElementById("searchContainer").innerHTML = output;
            showSection('Searchpg')
        })
        .catch(function(error) {
            console.error('Error fetching categories:', error.message);
       
        });
}
function hideProducts(index) {
    var allProductItems = document.getElementsByClassName('product-item');

    for (var i = 0; i < allProductItems.length; i++) {
        allProductItems[i].style.display = 'none'; // Hide each product item
    }

    displaySingleImage(products[index]); // Display the selected product's details
}
function displaySingleImage(singleProd) {
    var output = `<img src="./images/${singleProd.image_url}" class="expanded-image">
    <div class="product-details">
        <h1 class="expanded-product-name">${singleProd.product_name}</h1>
        <h2 class="expanded-product-price">${singleProd.price}</h2>
        <h3 class="expanded-product-description">${singleProd.description}</h3>
        <button class="add-to-cart-button" onclick="addToCart('${singleProd.product_id}')">Add to Cart</button>
    </div>`;

    document.getElementById("expandedPg").innerHTML = output;
    document.getElementById("expandedPg").style.display = "flex"; // Show the expanded product view
}
function addToCart(product_id) {

    let product2cart = null;

    // The product we're adding to the cart
    for(let i = 0; i < products.length; i++) {
        if(products[i].product_id == product_id) {
            product2cart = products[i];
        }
    }

    // If product not found
    if(product2cart === null) {
        // Something wrong
     
    }

    // Assume product is not yet in cart
    let productInCartIndex = -1;
    
    // Check if product isallready in cart
    for (let i = 0; i< cart.length; i++) {
        // It is 
        if (cart[i].product_id == product_id) {
            
            // Set to index of cart
            productInCartIndex = i;
        }
    }
    
    // Product is already in cart: update the quantity + 1
    if (productInCartIndex !== -1) {
        cart[productInCartIndex].quantity++;
    } 
    // Product not yet in cart
    else {
        
        // Add quantity key to product object
        product2cart.quantity = 1;

        // Add product object to cart array
        cart.push(product2cart);
    }

    // showSection("Cartpg")
}
function updatetotal(price, quantity) {
    // Calculate total for a single product
    let totalProdPrice = price * quantity;
    return totalProdPrice.toFixed(2); // Return with 2 decimal places
}
function calculateSubtotal() {
    let subtotal = 0; // Initialize subtotal to 0 at the start

    // Loop through all cart items
    for (let i = 0; i < cart.length; i++) {
        // Only add to subtotal if the quantity is greater than 0
        if (cart[i].quantity > 0) {
            subtotal += parseFloat(cart[i].price) * parseInt(cart[i].quantity); // Calculate total for each product
        }
    }

    // Display subtotal in the appropriate element
    document.getElementById('subtotal').innerHTML = subtotal.toFixed(2); // Assumes you have an element with id 'subtotal'

    return subtotal;
}
function loadCartPageContent() {
    
    let output = "";

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].quantity == 0) {
            // do not display the image with no quantity
         
        } else {
            output += `<div class="cart-details">
                <img src="./images/${cart[i].image_url}" class="product-image">
                <p class="product-price" 
                id="totalprice-${cart[i].product_id}">${updatetotal(parseFloat(cart[i].price), parseInt(cart[i].quantity))}
                </p>
                <div>
                <button onclick="increase(${i})">+</button>
                <p class="quantityButton" id="quantity-${cart[i].product_id}">${cart[i].quantity}</p>
                <button onclick="decrease(${i})">-</button>
                </div>
            </div>`;
        }
         document.getElementById('hiddenCart').style.display="flex"
    }

    document.getElementById('cartContainer').innerHTML = output;
   
    calculateSubtotal(); // Update the subtotal whenever the cart content is loaded or updated
}
function increase(index) {
    cart[index].quantity++; // Increase the quantity

    // Update the quantity and product total in the DOM
    document.getElementById(`quantity-${cart[index].product_id}`).innerHTML = cart[index].quantity;
    document.getElementById(`totalprice-${cart[index].product_id}`).innerHTML = updatetotal(parseFloat(cart[index].price), parseInt(cart[index].quantity));
    
    calculateSubtotal(); // Recalculate subtotal when quantity changes
}
function decrease(index) {
    if (cart[index].quantity > 0) {
        cart[index].quantity--; // Decrease the quantity
    }

    // Update the quantity and product total in the DOM
    document.getElementById(`quantity-${cart[index].product_id}`).innerHTML = cart[index].quantity;
    document.getElementById(`totalprice-${cart[index].product_id}`).innerHTML = updatetotal(parseFloat(cart[index].price), parseInt(cart[index].quantity));

    // Hide the product if quantity is 0
    if (cart[index].quantity === 0) {
        document.getElementsByClassName('cart-details')[index].style.display = "none";
        
    }

    calculateSubtotal(); // Recalculate subtotal when quantity changes
}
function handleCheckout() {
    if (isUserLoggedIn) { 
        const lastname = document.getElementById('lastname').value;
        const firstname = document.getElementById('firstname').value;
        const address1 = document.getElementById('address1').value;
        const address2 = document.getElementById('address2').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const postal_code = document.getElementById('postal_code').value;
        const country = document.getElementById('country').value;
        const phone_number = document.getElementById('phone_number').value;

             // Perform validation for each input field
             const isPaymentMethodValid = validateRadioButton('paymentMethod', 'Payment Method', 'checkout');
              // code arranged backward so that errors come in order
                const isPhoneNumberValid = validateNumber(phone_number, "Phone Number", 5, 15, "checkout");
                const isCountryValid = validateString(country, "Country", 2, 50, "checkout");
                const isPostalCodeValid = validateNumber(postal_code, "Postal Code", 4, 10, "checkout");
                const isStateValid = validateString(state, "State", 2, 50, "checkout");
                const isCityValid = validateString(city, "City", 2, 50, "checkout");
                const isAddress1Valid = validateString(address1, "Address 1", 5, 100, "checkout");
                const isLastnameValid = validateString(lastname, "Last Name", 2, 50, "checkout");
                const isFirstnameValid = validateString(firstname, "First Name", 2, 50, "checkout");

        // Check if all validations passed
        if (isFirstnameValid && isLastnameValid && isAddress1Valid && isCityValid && isStateValid && isPostalCodeValid && isCountryValid && isPhoneNumberValid &&isPaymentMethodValid) {
            // Proceed with API call if all validations passed
            axios.get('http://localhost:3000/api/checkout', {
                params: {
                    firstname: firstname,
                    lastname: lastname,
                    address1: address1,
                    address2: address2, // Optional field
                    city: city,
                    state: state,
                    postal_code: postal_code,
                    country: country,
                    phone_number: phone_number
                }
            })
            .then(response => {
            console.log('Checkout successful:', response.data);

                placeOrder();  // Proceed to place order only after successful checkout
            })
            .catch(error => {
                
                
            });
        }
    } else {
        showSection('Loginpg');  // Redirect to login if the user is not logged in
    }
}
function placeOrder() {
var productIds = [];
var quantities = [];
var prices = [];
for (var i = 0; i < cart.length; i++) {
  productIds.push(cart[i].product_id);
  quantities.push(cart[i].quantity);
  prices.push(cart[i].price);
}

var queryString = '';
for (var i = 0; i < productIds.length; i++) {
  queryString += `product_id=${productIds[i]}&quantity=${quantities[i]}&price=${prices[i]}`;
  if (i < productIds.length - 1) {
    queryString += '&';
  }
}
console.log(queryString)

axios.get(`http://localhost:3000/api/orders?${queryString}`)
  .then(function(response) {
    
      handlePayment()
  })
  .catch(function(error) {
    console.error('Error placing order:', error.message);
    
  });
   
}

function handlePayment() {
    let amount=parseFloat(document.getElementById('subtotal').innerHTML)+5
    console.log(amount);
    
    let paymentMethod;
    let radios = document.getElementsByName('paymentMethod');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            paymentMethod = radios[i].value;
            break;
        }
    }
   
    let method = paymentMethod;
   


axios.get('http://localhost:3000/api/payment', {
        params: {
            method:method,
            amount:amount
        }
    })
    .then(response => {
          showSection('Orderpg')
        console.log(response.data)
  
        

    })
    .catch(error => {
        console.error('payment failed:', error);
      
    });
   
    
}
function generateReceipt() {
     axios.get('http://localhost:3000/api/receipt')

  .then(response => {
    //  response contains 'receiptHtml'
    document.getElementById('receipt').innerHTML = response.data.receiptHtml;
  })
  .catch(error => {
    console.error('Error fetching receipt:', error);
  });
    
}
// document.getElementById("products").style.display = "none";

