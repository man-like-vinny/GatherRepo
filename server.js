// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const app = express();
// const port = 3000; // You can change the port number as needed
// const mongoURI = 'mongodb+srv://vinayakunnithan:Vinayak1@gather.fgw0v5i.mongodb.net/checkoutusers'; // Update with your MongoDB URI

// // Connect to MongoDB
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Define a schema for your data
// const checkoutSchema = new mongoose.Schema({
//     name: String,
//     phone: String,
//     address: String,
//     country: String,
//     city: String,
// });

// const Checkout = mongoose.model('Checkout', checkoutSchema);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname));

// // Serve your HTML file
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// // Define a route to handle form submissions
// app.post('/submit', (req, res) => {
//     const { name, phone, address, country, city } = req.body;

//     const newCheckout = new Checkout({
//         name,
//         phone,
//         address,
//         country,
//         city,
//     });

//     newCheckout.save()
//         .then(() => {
//             console.log('Received data:', req.body);
//             res.status(200).send('Data saved to MongoDB');
//         })
//         .catch((err) => {
//             console.error('Error saving to MongoDB:', err);
//             res.status(500).send('Error saving data');
//         });
// });

// app.get('/getCheckouts', (req, res) => {
//     Checkout.find({}, 'name phone address')
//         .then((data) => {
//             res.json(data);
//         })
//         .catch((err) => {
//             console.error('Error retrieving data:', err);
//             res.status(500).send('Error retrieving data');
//         });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://vinayakunnithan:Vinayak1@gather.fgw0v5i.mongodb.net/checkoutusers'; // Update with your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for your data
const checkoutSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    country: String,
    city: String,
    totalquantity: Number,
    totalprice: Number
});

const Checkout = mongoose.model('Checkout', checkoutSchema);
const stripe = require("stripe")('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');

app.use(express.json());
app.use(express.static(__dirname));

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
    const { name, phone, address, country, city, totalquantity, totalprice } = req.body;

    const newCheckout = new Checkout({
        name,
        phone,
        address,
        country,
        city,
        totalquantity,
        totalprice,
    });

    newCheckout.save()
        .then(() => {
            console.log('Received data:', req.body);
            res.status(200).send('Data saved to MongoDB');
        })
        .catch((err) => {
            console.error('Error saving to MongoDB:', err);
            res.status(500).send('Error saving data');
        });
});

app.get('/getCheckouts', (req, res) => {
    Checkout.find({}, 'name phone address')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.error('Error retrieving data:', err);
            res.status(500).send('Error retrieving data');
        });
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let totalAmountCents = 0; // Initialize total amount to zero

  totalAmountCents = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  console.log("Total amount cents: " + totalAmountCents);

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
    description: items.map(item => `${item.id} (${item.description}) x ${item.quantity}`).join('\n'),
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


app.listen(port, () => console.log(`Node server listening on port ${port}`));