const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});

let iconCart = document.querySelector('.iconCart');
let clearCartButton = document.querySelector('.clear-cart-button');
let checkoutButton = document.querySelector('.checkout')
let cart = document.querySelector('.cart');
let container = document.querySelector('.navbar');
let event_container = document.querySelector('.listProduct');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function(){
    if(cart.style.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
        event_container.style.transform = 'translateX(-150px)';
    }else{
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
        event_container.style.transform = 'translateX(0)';
    }
})

close.addEventListener('click', function (){
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
    event_container.style.transform = 'translateX(0)';
})

clearCartButton.addEventListener('click', function() {
    clearCart();
});

let products = null;
// get data from file json
fetch('/getProducts')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

let listCart = [];

checkoutButton.addEventListener('click', function(){
    if (listCart.length === 0) {
        // Don't do anything or show a message to the user indicating that the cart is empty.
        window.alert("Cart Empty!")
        //return;
    }
    else{
        window.location.href = '/checkout.html';
    }
})

checkoutButton.addEventListener('mouseover', function() {
    if (listCart.length === 0) {
        checkoutButton.style.backgroundColor = 'red';
    } else {
        checkoutButton.style.backgroundColor = 'green'; // Change to green if listCart is not empty
    }
});

checkoutButton.addEventListener('mouseout', function() {
    checkoutButton.style.backgroundColor = 'rgb(29, 101, 193)'
});


//---------websocket---------------
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.addEventListener('open', () => {
  console.log('WebSocket connection is open.');
  // You can now use this WebSocket connection for real-time communication.
  // For example, you can listen for messages from the server and send messages.
});

ws.addEventListener('ping', () => {
    // When a ping message is received from the server, respond with a pong
    ws.pong();
    console.log('Sent a ping from the client.');
  });

ws.addEventListener('close', (event) => {
  if (event.wasClean) {
    console.log(`WebSocket connection closed cleanly, code: ${event.code}, reason: ${event.reason}`);
  } else {
    console.error('WebSocket connection abruptly closed');
  }
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.action === 'numberOfClients') {
      // Handle the number of connected clients
      const numberOfClients = data.count;
      console.log(`Number of connected clients: ${numberOfClients}`);
    } else if (data.action === 'cartUpdated') {
      // Handle other actions, e.g., cart updates
      console.log('Cart updated by another user');
      
      // Check if the server requests a fetch to update the content
      if (data.requestFetch) {
        // Perform a fetch to update the products data
        fetch('/getProducts')
          .then(response => response.json())
          .then(updatedData => {
            // Update the products data with the fetched data
            products = updatedData;
            // Call the addDataToHTML function to update the page content
            //addDataToHTML();
          });
      }
    }
  });

// let products = null;

// // Establish a WebSocket connection
// const socket = new WebSocket('ws://localhost:5000');

// // Listen for WebSocket connection open event
// socket.addEventListener('open', (event) => {
//     console.log('WebSocket connection opened');
//     // Send a request for product data
//     socket.send(JSON.stringify({ action: 'getProducts' }));
// });

// // Listen for messages from the WebSocket server
// socket.addEventListener('message', (event) => {
//     const message = JSON.parse(event.data);

//     if (message.action === 'updateProducts') {
//         // Update the products data with the new data received from the server
//         products = message.data;
//         addDataToHTML();
//     }
// });

// // Function to send a request for updated product data
// function requestProductUpdate() {
//     socket.send(JSON.stringify({ action: 'getProducts' }));
// }

let selectedTicketType = null;

// // Function to save the selected ticket type
function saveSelectedTicketType() {
    // Get the select element
    const ticketTypeSelect = document.getElementById("ticketType");

    // Get the selected value (either "earlyBird" or "standard")
    selectedTicketType = ticketTypeSelect.value;

    // Display the selected ticket type
    const selectedTicketElement = document.getElementById("selectedTicket");
    selectedTicketElement.textContent = selectedTicketType;
}


function addDataToHTML() {
    // remove datas default from HTML
    let listProductHTML = document.querySelector('.listEvents');
    listProductHTML.innerHTML = '';

    const selectedProduct = products.find(product => product.name == currentFileName);
    // const selectedProduct = products.find(product => product.eventID == globalProductID);
    console.log(selectedProduct.appliedID);
    const ProductPriceOptionOne = selectedProduct.type.find(type => type.ticketType === selectedProduct.option1);
    //const ProductPriceOptionTwo = selectedProduct.type.find(type => type.ticketType === selectedProduct.option2);
    
    //console.log(ProductPriceOptionTwo.ticketQuantity);
    if(ProductPriceOptionOne.ticketQuantity == 0)
    {
        ProductPriceOptionOne.productAvailability = "Sold Out";
    }
    else{
        ProductPriceOptionOne.productAvailability = "Available";
    }
    // if(ProductPriceOptionTwo.ticketQuantity == 0)
    // {
    //     ProductPriceOptionTwo.productAvailability = "Sold Out";
    // }
    // else
    // {
    //     ProductPriceOptionTwo.productAvailability = "Available";
    // }
    console.log(selectedProduct);

        if(selectedProduct) {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            
            // Create a container for the background effect
            let backgroundEffect = document.createElement('div');
            backgroundEffect.classList.add('item-bg');
            backgroundEffect.style.backgroundImage = `url(${selectedProduct.image})`;

            newProduct.appendChild(backgroundEffect);

            // Create a video element for the product.image
            // let videoElement = document.createElement('video');
            // videoElement.src = product.image;
            // videoElement.muted = true; // Mute the audio
            // videoElement.autoplay = true; // Play the video automatically
            // videoElement.loop = true; // Loop the video
            // videoElement.style.width = '100%'; // Set the video width using CSS
            // videoElement.style.height = 'auto'; // Set the video height using CSS
            // newProduct.appendChild(videoElement);

            // if needed for adding to selected ticket type bit
            // <p>Selected Ticket Type: <span id="selectedTicket"></span></p>
            // <button class=saveticket" onclick="saveSelectedTicketType()">Save Ticket Type</button>
            
            let descriptionElement = document.createElement('div');
            descriptionElement.classList.add('description');
            descriptionElement.innerHTML +=
                `<h2>${selectedProduct.name}</h2>
                <div class="price">${selectedProduct.ticketDescription}</div>
                <div class="timing_header">Date and Time</div>
                <div class="timing">${selectedProduct.eventTime}</br></div>
                <div class="location_header">Location</div>
                <div class="location">${selectedProduct.eventLocation}</div>
                <div class="ticketHeading">Ticket Options</div>
                <div class="ticketRules">Tickets are sold on a <strong>first come first served</strong> basis.<br>*Payment gateway charges will apply for sales/refunds.</div>
                <table class ="ticketSection" width="100%" style="position: relative; top: 450px;" border="0" cellspacing="0" cellpadding="4">
                    <tbody>
                        <tr style="background-color: #efefef; color:black;">
                            <td width="30%" style="position: relative; left: 19px;"><strong>Ticket Selection</strong></td>
                            <td width="15%"><strong>Price</strong></td>
                            <td width="25%"><strong>Ticket Status</strong></td>
                            <td width="25%"></td>
                        </tr>
                        <tr style="color:black; position: relative; top: 5px;">
                            <td style="position: relative; left: 20px;"><strong>${selectedProduct.option1}</strong></td>
                            <td><strong>€${ProductPriceOptionOne.price}</strong></td>
                            <td>
                                <strong>
                                ${ProductPriceOptionOne.productAvailability}
                                </strong>
                                </td>
                            <td style="position: relative;">
                                <button class="addtoCart2" onclick="checkProductId('${selectedProduct.name}', '${selectedProduct.option1}')">Add To Cart</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <label for="ticketType">Select Ticket Type:</label>
                <select style="opacity:0;" id="ticketType">
                    <option value="${selectedProduct.option1}">${selectedProduct.option1}</option>
                </select>
                <script src="script.js"></script>`;

            listProductHTML.appendChild(newProduct);
            listProductHTML.appendChild(descriptionElement);

            let addButtons = descriptionElement.querySelectorAll('button');
            addButtons.forEach(function (addButton) {
                addButton.addEventListener('click', function(){
                    if(cart.style.bottom == '-100%'){
                        cart.style.right = '0';
                        container.style.transform = 'translateX(-400px)';
                    } 
                    else {
                        cart.style.right = '0%';
                        container.style.transform = 'translateX(-400px)';
                        event_container.style.transform = 'translateX(-150px)';
                    }
                });
            });
            
            const ticketSelection = document.getElementById("ticketType");
            const ticketQuantityDesc = document.getElementById("ticketqty");
            ticketSelection.addEventListener("change", function() {
                const selectedValue = ticketSelection.value;
                console.log("Selected Value: " + selectedValue);
                // const selectedProduct = product.name;

                const selectedProductName = ticketSelection.parentElement.querySelector('h2').textContent;
                console.log("selectedProductName: " + selectedProductName);
                const selectedProduct = products.find(product => product.name === selectedProductName);
            
                if (selectedProduct) {
                    // Now 'selectedProduct' contains the product information based on the selected ticket type.
                    // You can use this information to update the cart view or perform any other actions.
                    console.log("Selected Product:", selectedProduct);
                    
                    // You can also get the price for the selected ticket type
                    selectedTicketType = selectedProduct.type.find(type => type.ticketType === selectedValue);
                    console.log("Selected TicketType: " + selectedTicketType);
                    if (selectedTicketType) {
                        console.log("Selected TicketType: " + selectedTicketType.ticketType);
                        console.log("Price: €" + selectedTicketType.price);
                    } else {
                        console.log("Price not found for the selected ticket type.");
                    }
                } else {
                    console.log("Product not found for the selected ID.");
                }
            });
            
        };
    }

function clearCart() {
    listCart = []; // Empty the cart array
    document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Remove the cart cookie
    addCartToHTML(); // Refresh the cart view
}


//use cookie so the cart doesn't get lost on refresh page

function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }
}
clearCart();
checkCart();

function navigateProduct() {
    //window.location.href = "SangeethaArangu.html";
}
fetch('/getProducts')
.then(response => response.json())
.then(data => {
    products = data;
    console.log("done")
    addEventToHTML();
})

function checkProductId(productName, productOption){
    console.log()
    const selectedProduct = products.find(product => product.name === productName);
    console.log(selectedProduct);
    const ticketSelection = document.getElementById("ticketType");
    const selectedValue = ticketSelection.value; // Get the selected value here
    console.log("option1:" + selectedProduct.option1)

    let productID = null;
    let productQuantity = null;


    if (productOption === selectedProduct.option1) {
        const earlyBirdNonMemberID = selectedProduct.type.find(type => type.ticketType === selectedProduct.option1);
        productID = earlyBirdNonMemberID ? earlyBirdNonMemberID.id : null;
        productTicketType = earlyBirdNonMemberID ? earlyBirdNonMemberID.ticketType : null;
        productQuantity = earlyBirdNonMemberID ? earlyBirdNonMemberID.ticketQuantity : null;
    } else if (productOption === selectedProduct.option2) {
        const earlyBirdMemberID = selectedProduct.type.find(type => type.ticketType === selectedProduct.option2);
        productID = earlyBirdMemberID ? earlyBirdMemberID.id : null;
        productTicketType = earlyBirdMemberID ? earlyBirdMemberID.ticketType : null;
        productQuantity = earlyBirdMemberID ? earlyBirdMemberID.ticketQuantity : null;
    }
    // else if (selectedValue === "Standard (Non-Member)") {
    //     const StandardNonMemberID = selectedProduct.type.find(type => type.ticketType === "Standard (Non-Member)");
    //     productID = StandardNonMemberID ? StandardNonMemberID.id : null;
    //     productTicketType = StandardNonMemberID ? StandardNonMemberID.ticketType : null;
    //     productQuantity = StandardNonMemberID ? StandardNonMemberID : null;
    // }
    // else if (selectedValue === "Standard (Member)") {
    //     const StandardMemberID = selectedProduct.type.find(type => type.ticketType === "Standard (Member)");
    //     productID = StandardMemberID ? StandardMemberID.id : null;
    //     productTicketType = StandardMemberID ? StandardMemberID.ticketType : null;
    //     productQuantity = StandardMemberID ? StandardMemberID : null;
    // }

    if (productID !== null) {
        console.log("Product Name: " + selectedProduct.name);
        console.log("Product TicketType: " + productTicketType);
        console.log("Product ID: " + productID);
        console.log("Product Quantity: " + productQuantity);
        // Call the addCart function with the product ID and selected value
        if(productQuantity == 0){
            window.alert("The " + productTicketType + " ticket is sold out for this event.");
            

        }
        else{
            addCart(productID, productTicketType, selectedValue);
        }
    }
}

function addCart(productTypeID, productTicketType) {
    let productsCopy = JSON.parse(JSON.stringify(products));

    // If this product type is not in the cart
    if (!listCart[productTypeID]) {
        for (const product of productsCopy) {
            for (const productType of product.type) {
                if (productType.id == productTypeID) {
                    console.log("Match" + productType.id);
                    if (!listCart[productTypeID]) {
                        listCart[productTypeID] = product;
                        listCart[productTypeID].quantity = 1;
                        listCart[productTypeID].ticketQuantity = productType.ticketQuantity;
                        listCart[productTypeID].staticQuantity = productType.ticketQuantity;
                        listCart[productTypeID].ticktype = productType.ticketType;
                        listCart[productTypeID].variablePrice = productType.price;
                        console.log("check here: " + listCart[productTypeID].ticktype);

                        if (listCart[productTypeID].ticketQuantity > 0) {
                            listCart[productTypeID].ticketQuantity--;
                            console.log("updated quantity: " + listCart[productTypeID].ticketQuantity);
                        } 
                        
                        else {
                            console.log("Max tickets reached");

                        }

                    } 
                    
                    else {
                        // If the product type is already in the cart, increase the quantity
                        if (listCart[productTypeID].ticketQuantity > 0) {
                            // listCart[productTypeID].quantity++;
                            // #listCart[productTypeID].ticketQuantity--;
                            console.log("updated quantity: " + listCart[productTypeID].ticketQuantity);
                        } else {
                            console.log("Max tickets reached");
                        }
                    }
                }
                else{
                    console.log("Not a match" + productType.id);
                }
            }
        }
    } else {
        // If this product type is already in the cart, increase the quantity
        if (listCart[productTypeID].ticketQuantity > 0) {
            listCart[productTypeID].quantity++;
            listCart[productTypeID].ticketQuantity--;
            console.log("updated quantity: " + listCart[productTypeID].ticketQuantity);
        } else {
            console.log("Max tickets reached");
        }
    }

    console.log(listCart);
    
    // console.log(listCart[$idProduct]);
    document.cookie = "listCart=" + JSON.stringify(listCart);
    addCartToHTML();
}


addCartToHTML();
function addCartToHTML() {
    // Clear the default data
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    // Get the selected ticket type from the HTML select element
    const ticketSelection = document.getElementById("ticketType");
    const selectedValue = ticketSelection.value;

    // Define a function to get the price for the selected ticket type
    // function getPriceForSelectedType(product, selectedValue) {
    //     let price = null;
    //     const selectedProduct = products.find(product => product.name === "Daffodils New-Year Party");
    //     // Check the selected ticket type and find the corresponding price
    //     if (selectedValue === selectedProduct.option1) {
    //         const earlyBirdNonMemberPrice = product.type.find(type => type.ticketType === selectedProduct.option1);
    //         price = earlyBirdNonMemberPrice ? earlyBirdNonMemberPrice.price : null;
    //     } else if (selectedValue === selectedProduct.option2) {
    //         const earlyBirdMemberPrice = product.type.find(type => type.ticketType === selectedProduct.option2);
    //         price = earlyBirdMemberPrice ? earlyBirdMemberPrice.price : null;
    //     }
    //     // } else if (selectedValue === "Standard (Non-Member)") {
    //     //     const standardNonMemberPrice = product.type.find(type => type.ticketType === "Standard (Non-Member)");
    //     //     price = standardNonMemberPrice ? standardNonMemberPrice.price : null;
    //     // } else if (selectedValue === "Standard (Member)") {
    //     //     const standardMemberPrice = product.type.find(type => type.ticketType === "Standard (Member)");
    //     //     price = standardMemberPrice ? standardMemberPrice.price : null;
    //     // }
    //     return price;
    // }

    // If there are products in the cart
    if (listCart) {
        Object.entries(listCart).forEach(([productTypeID, product]) => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');

                // Find the price for the selected ticket type
                //let price = getPriceForSelectedType(product, selectedValue);

                //note that listCart[productTypeID].ticktype is also known as product.ticktype

                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">€${product.variablePrice} / ${product.ticktype}</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${productTypeID}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${productTypeID}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
                console.log("product quantity: " + product.quantity);
                console.log("product ticket type: " + listCart[productTypeID].ticktype);
            }
        });
    }
    totalHTML.innerText = totalQuantity;
}

function changeQuantity($idProduct, $type) {
    switch ($type) {
        case '+':
            if (listCart[$idProduct].ticketQuantity > 0) {
                listCart[$idProduct].quantity++;
                listCart[$idProduct].ticketQuantity--;

                if (listCart[$idProduct].ticketQuantity === 0) {
                    console.log("Max tickets reached");
                }
            } else {
                console.log("Max tickets reached");
            }
            break;
        case '-':
            listCart[$idProduct].quantity--;
            listCart[$idProduct].ticketQuantity++;

            // if quantity <= 0 then remove product in cart
            if (listCart[$idProduct].quantity <= 0) {
                delete listCart[$idProduct];
                console.log(listCart);
                listCart = [];
            } else if (listCart[$idProduct].ticketQuantity === 0) {
                console.log("Max tickets reached");
            }
            break;
        default:
            break;
    }
    // save new data in the cookie
    document.cookie = "listCart=" + JSON.stringify(listCart);
    // reload the HTML view cart
    addCartToHTML();
}



// function changeQuantity($idProduct, $type){
//     switch ($type) {
//         case '+':
//             listCart[$idProduct].quantity++;
//             listCart[$idProduct].ticketQuantity--;

//             if(listCart[$idProduct].ticketQuantity == 0){
//                 console.log("Max tickets reached")
//             }

//             break;
//         case '-':
//             listCart[$idProduct].quantity--;
//             listCart[$idProduct].ticketQuantity++;

//             // if quantity <= 0 then remove product in cart
//             if(listCart[$idProduct].quantity <= 0){
//                 delete listCart[$idProduct];
//             }
//             else if(listCart[$idProduct].ticketQuantity == 0){
//                 console.log("Max tickets reached")
//             }
            
//             break;
    
//         default:
//             break;
//     }
//     // save new data in cookie
//     document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
//     // reload html view cart
//     addCartToHTML();
// }