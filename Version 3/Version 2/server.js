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
const port = 5500;

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});