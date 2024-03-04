const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
app.use(express.json());

// Serve your HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

var WebSocketServer = require("ws").Server
// var server = http.createServer(app)
const server = app.listen(port, () => console.log(`Node server listening on port ${port}`));
// server.listen(port, () => console.log(`Node server listening on port ${port}`))

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

require("dotenv").config();

const {KindeClient, GrantType} = require("@kinde-oss/kinde-nodejs-sdk");

const options = {
    domain: process.env.KINDE_DOMAIN,
    clientId: process.env.KINDE_CLIENT_ID,
    clientSecret: process.env.KINDE_CLIENT_SECRET,
    redirectUri: process.env.KINDE_REDIRECT_URI,
    logoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI,
    grantType: GrantType.PKCE
};

const kindeClient = new KindeClient(options);

// Middleware to check if the user is authenticated
const isAuthenticatedMiddleware = async (req, res, next) => {
  const isAuthenticated = await kindeClient.isAuthenticated(req);

  if (isAuthenticated) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page
    res.redirect("/login");
  }
};

// Login route with authentication middleware
app.get("/login", kindeClient.login(), (req, res) => {
  return res.redirect("https://www.eventifyed.com/dashboard.html");
});

// Register route with authentication middleware
app.get("/register", kindeClient.register(), (req, res) => {
  return res.redirect("/");
});

// Callback route with authentication middleware
app.get("/callback", kindeClient.callback(), (req, res) => {
  return res.redirect("/");
});

// Logout route
app.get("/logout", kindeClient.logout());

// Dashboard route with authentication middleware
app.get("/dashboard.html", isAuthenticatedMiddleware, (req, res) => {
  // User is authenticated, render the dashboard.html or perform other actions
  res.send("Welcome to the dashboard!");
});

const mongoURI = 'mongodb+srv://vinayakunnithan:Vinayak1@gather.fgw0v5i.mongodb.net/products'; // Update with your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for your data
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    type: [
        {
            ticketType: String,
            price: Number,
            ticketQuantity: Number,
            id: Number
        }
    ],
    ticketDescription: String,
    image: String,
    staticImage: String
});

const Product = mongoose.model('Product', productSchema, 'events');

// // Route to get all products
app.get('/getProducts', async (req, res) => {
  try {
    console.log('Accessed /getProducts route'); // Add this log statement

    const products = await Product.find({}); // Find all products in the collection

    console.log('Products fetched:', products); // Add this log statement

    // Send the products as JSON
    res.json(products);
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// WebSocket server

let numberOfClients = 0;
const clients = new Set();

wss.on('connection', (ws) => {
  // Handle incoming WebSocket messages
  console.log('A client has connected.');
  
  numberOfClients++;
  console.log("Clients connected: " + numberOfClients);
  broadcastNumberOfClients();
  clients.add(ws);

    // Define a function to send ping messages to clients
  function sendPing() {
    ws.ping();
  }

  // Set up a ping interval to periodically send ping messages
  const pingInterval = setInterval(sendPing, 30000); // Send a ping every 30 seconds

  ws.on('pong', () => {
    // This callback is executed when the client responds to a ping with a pong.
    // You can use this to track that the client is still responsive.
    console.log('Received a pong from the client.');
  });
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.action === 'updateCart') {
        const cart = data.cart;

        // Filter out items that are not null
        const validCart = cart.filter(item => item !== null);

        // Prepare an array of update operations
        const updateOperations = validCart.map(item => {
          const { name, ticktype, ticketQuantity } = item;
          console.log(name, ticktype, ticketQuantity);
          return {
            updateOne: {
              filter: { name: name, 'type.ticketType': ticktype },
              update: { $set: { 'type.$.ticketQuantity': ticketQuantity } },
            },
          };
        });

        // Execute the update operations
        Product.bulkWrite(updateOperations);

        // Notify all connected clients about the updated cart
        clients.forEach((client) => {
          // if (client !== ws && client.readyState === WebSocket.OPEN) {
          //   client.send(JSON.stringify({ action: 'cartUpdated' }));
          if (client.readyState === WebSocketServer.OPEN) {
            client.send(JSON.stringify({ action: 'cartUpdated'}));
          }
        });
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
    }
  });

  ws.on('close', () => {
    console.log('A client has disconnected.');

    // Decrement the number of connected clients and notify all clients
    numberOfClients--;
    broadcastNumberOfClients();
    console.log("Clients connected: " + numberOfClients)
    clearInterval(pingInterval);
  });
});

function broadcastNumberOfClients() {
  // Send the current number of connected clients to all clients
  const message = JSON.stringify({
    action: 'numberOfClients',
    count: numberOfClients,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(message);
    }
  });
}

const stripe = require("stripe")('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');

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let totalAmountCents = 0; // Initialize total amount to zero

  totalAmountCents = items.reduce((total, item) => {
    if(item.inclFee == "True"){
      return Math.round(total + item.price * item.quantity + item.fee);
    }
    else{
      return total + (item.price * item.quantity);
    }
  }, 0);

  console.log("Total amount cents: " + totalAmountCents);

  //reduceQuantity(items);

  return totalAmountCents;
};

const chargeCustomer = async (customerId) => {
  // Lookup the payment methods available for the customer
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  try {
    // Charge the customer and payment method immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
    });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed
    console.log("Error code is: ", err.code);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
  // and attach the PaymentMethod to a new Customer
  const customer = await stripe.customers.create();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: "off_session",
    amount: calculateOrderAmount(items),
    currency: "eur",
    description: items.map(item => `${item.id} : ${item.description} x ${item.quantity}`).join('\n'),
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    payment_method_types: ["card"], // Specify the payment method types
    automatic_payment_methods: {
      enabled: false,
    },
  });

  console.log(paymentIntent);

  totalAmountCents = 0;

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});