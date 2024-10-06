const http = require('http');
const url = require('url');
const mysql = require('mysql2');
// const path = require('path');
// const fs = require('fs');
// const PDFDocument = require('pdfkit');



// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'web',
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    
    // Set CORS headers for allowing cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Parse the URL to determine the requested route
    const pathname = parsedUrl.pathname;
        // Handle different API routes based on the path
        if (pathname.startsWith('/api/login')) {
            handleLogin(req, res);
        } else if (pathname.startsWith( '/api/signup')) {
            handleSignUp(req, res);
        } else if (pathname.startsWith('/api/forgot')) {
            handleForgotPassword(req, res);
        } else if (pathname.startsWith('/api/search')) {
            handleSearch(req, res);
        } else if (pathname.startsWith('/api/categories/')) {
            handleCategories(req, res);
        } else if (pathname.startsWith('/api/checkout')) {
            handleCheckout(req, res, customerId);
        } else if (pathname.startsWith('/api/orders')) {
            handleOrders(req, res, customerId, addressId);
        } else if (pathname.startsWith('/api/payment')) {
            handlePayment(req, res, orderId);
        } else if (pathname.startsWith('/api/receipt')) {
            generateReceipt(orderId, addressId, customerId, res)
        }else {
            // No route found, returning 404 error
            console.log(`No route found for ${pathname}`);
            res.write('Not Found');
            res.end();
        }// Create the HTTP server

});

let customerId;
let addressId;
let orderId;

// Function to handle search functionality
function handleSearch(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const searchTerm = parsedUrl.searchParams.get('search').toLowerCase(); // Get search term from URL

    // SQL query to search products by name or category
    const sqlQuery = `SELECT p.product_id, p.image_url, p.product_name, p.description, p.price 
                      FROM products AS p 
                      JOIN product_categories AS pc ON p.product_id = pc.product_id 
                      JOIN categories AS c ON c.category_id = pc.category_id 
                      WHERE LOWER(p.product_name) LIKE ? OR LOWER(c.category_name) LIKE ?`;

    let products = [];
    // Execute the SQL query
    db.query(sqlQuery, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.write(JSON.stringify({ message: 'Internal Server Error' }));
            res.end();
        } else {
            console.log(results);

            // Create a product object for each unique product ID
            for (let i = 0; i < results.length; i++) {
                const productId = results[i].product_id;
                // Search for products
                const existingProduct = products.find(product => product.product_id === productId);
                // If prod doesnt exist
                if (!existingProduct) {
                    const product = {
                        image_url: results[i].image_url,
                        product_name: results[i].product_name,
                        description: results[i].description,
                        price: results[i].price,
                        product_id: results[i].product_id
                    };
                    products.push(product);
                }
            }

            // Send results as a JSON response
            res.write(JSON.stringify(products));
            res.end();
        }
    });
}

// Function to handle login functionality
function handleLogin(req, res) {
    // Parse query parameters from the URL
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const username = parsedUrl.searchParams.get('username');
    const password = parsedUrl.searchParams.get('password');

    // Check if the user exists and the password matches
    db.query(
        'SELECT * FROM customers WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error(err);
                res.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                res.end();
            } else if (results.length > 0) {
                // If login is successful, store the customer ID
                customerId = results[0].customer_id;
                console.log(customerId);

                // Send a success response
                res.write(JSON.stringify({ success: true, message: 'Login successful' }));
                res.end();
            } else {
                // Send an error if the credentials are invalid
                res.write(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                res.end();
            }
        }
    );
}
// Function to handle signup functionality
function handleSignUp(req, res) {
    // Parse query parameters from the URL
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const username = parsedUrl.searchParams.get('username');
    const email = parsedUrl.searchParams.get('email');
    const password = parsedUrl.searchParams.get('password');
    const phoneNumber = parsedUrl.searchParams.get('phoneNumber');
    console.log(phoneNumber);

    // Insert new user into the database
    db.query(
        'INSERT INTO customers (username, email, password, phone_number) VALUES (?, ?, ?, ?)',
        [username, email, password, phoneNumber],
        (err, results) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ success: false, message: "Duplicate email or password" }));
                res.end();
            } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ success: true, message: 'Sign-up successful' }));
                res.end();
            }
        }
    );
}

function handleForgotPassword(req, res) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const recalledPhoneNum = parsedUrl.searchParams.get('phoneRecall');
    const newPassword = parsedUrl.searchParams.get('replacedPassword');

    // Check if phone number and new password are provided
    if (!recalledPhoneNum || !newPassword) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ success: false, message: 'Phone number and new password are required' }));
        res.end();
        return;
    }

    // Update the password in the database where the phone number matches
    const updatePasswordQuery = `UPDATE customers SET password = ? WHERE phone_number = ?`;

    db.query(updatePasswordQuery, [newPassword, recalledPhoneNum], (err, results) => {
        if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
            res.end();
        } else if (results.affectedRows === 0) {
            // Handle case where no rows were affected (phone number not found)
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ success: false, message: 'Phone number not found' }));
            res.end();
        } else {
            // Password update successful
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ success: true, message: 'Password updated successfully' }));
            res.end();
        }
    });
}

function handleCategories(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathElements = req.url.split("/");
    // Extract the category ID from the pathElements array
    let category_id = pathElements[3];
    category_id = parseInt(category_id); // Convert the category ID to an integer
    // Create an empty array to store the filtered products
    let products = [];
    // Query the database for products based on the category ID
    db.query(
        `SELECT p.product_id, p.image_url,p.product_name,p.description,p.price FROM products as p 
         JOIN product_categories as pc ON p.product_id = pc.product_id
         JOIN categories as c ON c.category_id = pc.category_id
         WHERE c.category_id = ?`,
        [category_id],
        (err, results) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            } else {
                // Loop through the results and collect product IDs
                // Assuming 'results' is an array of rows
                  for (let i = 0; i < results.length; i++) {
                      // Create a product object for each row
                      const product = {
                          image_url: results[i].image_url,
                          product_name: results[i].product_name,
                          description: results[i].description,
                          price: results[i].price,
                          product_id: results[i].product_id
                      };

                      // Push the product object into the products array
                      products.push(product);
                  }

            



            // Send the list of products as a JSON response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products)); 
            }
        }
    );
}
function handleCheckout(req, res, customerId) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    // Extract query parameters from the URL
    const firstname = parsedUrl.searchParams.get('firstname');
    const lastname = parsedUrl.searchParams.get('lastname');
    const address1 = parsedUrl.searchParams.get('address1');
    const address2 = parsedUrl.searchParams.get('address2');
    const city = parsedUrl.searchParams.get('city');
    const state = parsedUrl.searchParams.get('state');
    const postal_code = parsedUrl.searchParams.get('postal_code');
    const country = parsedUrl.searchParams.get('country');
    const phone_number = parsedUrl.searchParams.get('phone_number');

    // Update customer information with firstname, lastname, and phone_number
    db.query(
        `UPDATE customers SET firstname=?, lastname=?, phone_number=? WHERE customer_id=?`,
        [firstname, lastname, phone_number, customerId],
        function checkout(err, results) {
            if (err) {
                console.error(err);
                // Send a 500 error response for any server issues
                res.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                res.end();
                return;
            }

            // Insert the new address information for the customer
            db.query(
                `INSERT INTO addresses (customer_id, address_line1, address_line2, city, state, postal_code, country)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [customerId, address1, address2, city, state, postal_code, country],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        // Send a 500 error response for address insertion issues
                        res.write(JSON.stringify({ success: false, message: 'Internal Server Error' }));
                        res.end();
                        return;
                    }

                    // Store the newly created address ID
                    addressId = results.insertId;
                    console.log(addressId);
                    // Send a success response once everything is successful
                    res.write(JSON.stringify({ message: 'Checkout successful' }));
                    res.end();
                }
            );
        }
    );
}

function handleOrders(req, res, customerId, addressId) {
    // Insert a new order linked to the customer and their address
    db.query(
        `INSERT INTO orders (customer_id, address_id) VALUES (?, ?)`,
        [customerId, addressId],
        function (err, results) {
            if (err) {
                console.error(err);
                // Send a an error response for order creation issues
                res.write(JSON.stringify({ message: 'Internal Server Error' }));
                res.end();
                return;
            }

            // Store the newly created order ID
            orderId = results.insertId;

            // Extract product, quantity, and price details from the request URL
            const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
            const productIds = parsedUrl.searchParams.getAll('product_id');
            const quantities = parsedUrl.searchParams.getAll('quantity');
            const prices = parsedUrl.searchParams.getAll('price');

            const orderDetailsValues = [];

            // Prepare the values for inserting order details
            for (let i = 0; i < productIds.length; i++) {
                const productId = productIds[i];
                const quantity = quantities[i];
                const price = prices[i];

                // Add each order detail to the array
                orderDetailsValues.push([orderId, productId, quantity, price]);
            }

            // Insert all order details in one query
            const orderDetailsQuery = `INSERT INTO order_details (order_id, product_id, quantity, price) VALUES ?`;

            db.query(orderDetailsQuery, [orderDetailsValues], function (err, results) {
                if (err) {
                    console.error(err);
                    // Send a 500 error response for order detail insertion issues
                    res.write(JSON.stringify({ message: 'Internal Server Error while inserting order details' }));
                    res.end();
                    return;
                }

                // Send a success response once the order and details are added
                res.write(JSON.stringify({ message: 'Order and order details successfully added' }));
                res.end();
            });
        }
    );
}

function handlePayment(req,res,orderId) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const method=parsedUrl.searchParams.get('method')
    const amount=parsedUrl.searchParams.get('amount')
    console.log(amount)
    db.query(
        `INSERT INTO payment_methods (method_name) VALUE(?)`,
        [method],
        function(err,results) {
             if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
            else{
                const paymentID=results.insertId
                db.query(
                    `INSERT INTO transactions (order_id, payment_method_id, amount)
                     VALUES (?,?,?);`,
                     [orderId,paymentID,amount],
                    function (err, results) {
           
                 res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Payment successful and PDF generated' }));
                        }
            )
            }
            
        }
    )
}
function generateReceipt(orderId, addressId, customerId, res) {
  db.query(
    `SELECT o.order_id, o.customer_id, a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country,
            od.product_id, od.quantity, od.price, p.product_name
     FROM orders o
     JOIN addresses a ON o.address_id = a.address_id
     JOIN order_details od ON o.order_id = od.order_id
     JOIN products p ON od.product_id = p.product_id
     WHERE o.order_id = ?`,
    [orderId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
      } else {
        const order = results[0];
        const address = {
          line1: order.address_line1,
          line2: order.address_line2,
          city: order.city,
          state: order.state,
          postalCode: order.postal_code,
          country: order.country,
        };

        let orderDetailsHtml = '';
        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          orderDetailsHtml += `
            <li>
              <strong>${item.product_name}</strong> - Quantity: ${item.quantity}, Price: $${item.price}
            </li>
          `;
        }

        const receiptHtml = `
          <h2>Order Receipt</h2>
          <p>Order ID: ${orderId}</p>
          <p>Customer ID: ${customerId}</p>
          <h3>Shipping Address</h3>
          <p>${address.line1}</p>
          <p>${address.line2}</p>
          <p>${address.city}, ${address.state} ${address.postalCode}</p>
          <p>${address.country}</p>
          
          <h3>Order Details</h3>
          <ul>
            ${orderDetailsHtml}
          </ul>
        `;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ receiptHtml }));
      }
    }
  );
}



 // Start the server
 const PORT = 3000;
 server.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});
