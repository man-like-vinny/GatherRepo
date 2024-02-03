let listCart = [];
let returntoCart = document.querySelector('.returnCart');
var host = location.origin.replace(/^http/, 'ws')

function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}

checkCart();
addCartToHTML();

function addCartToHTML() {
    // clear data default
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;

    // if there are products in the Cart
    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img src="${product.staticImage}">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">Selected Ticket: ${product.ticktype}</div>
                    </div>
                    <div class="quantity">x${product.quantity}</div>
                    <div class="returnPrice">€${product.variablePrice * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
                fee = (0.01845 * (product.variablePrice * product.quantity) + 0.3075) * 100
                totalPrice = Math.round(totalPrice + (product.variablePrice * product.quantity * 100) + fee)/100;
                console.log("check total price here: " + totalPrice);
            }
        });
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = "€" + totalPrice;

    //updateCartOnServer(listCart);
}

// returntoCart.addEventListener('click', function() {
//     const validCart = listCart.filter(item => item !== null);
//     validCart.forEach(item => {
//       item.ticketQuantity = item.ticketQuantity + item.quantity;       
//     });

//     updateCartOnServer(validCart)
//     clearCart();

//     // You can choose to clear the cart here or handle it as needed
//     clearCart();
// });

returntoCart.addEventListener('click', function() {
    // Perform a fetch to get updated product data
    fetch('/getProducts')
    .then(response => response.json())
    .then(updatedData => {
        const validCart = listCart.filter(item => item !== null);

        // Update item.ticketQuantity values with the latest data
        validCart.forEach(item => {
            // Find the product with the matching name
            const matchingProduct = updatedData.find(product => product.name === item.name);

            if (matchingProduct) {
                // Find the corresponding ticketType
                const matchingTicket = matchingProduct.type.find(ticket => ticket.ticketType === item.ticktype);
                console.log(matchingTicket);
                if (matchingTicket) {
                    // Update item.ticketQuantity with the value from the matching ticket
                    item.ticketQuantity = matchingTicket.ticketQuantity;
                    console.log(matchingTicket.ticketQuantity);
                }
            }
        });

        // Now that item.ticketQuantity values are updated, you can perform calculations
        validCart.forEach(item => {
            item.ticketQuantity = item.ticketQuantity + item.quantity;
        });

        console.log(validCart);

        // Clear the cart locally or handle it as needed

        // Update the page or perform any additional actions with the updated data
        // ...

        // Call updateCartOnServer after all operations are complete
        updateCartOnServer(validCart);
        delayTimer(2000);
    });
});

// returntoCart.addEventListener('click', function() {
//     const validCart = listCart.filter(item => item !== null);
//     validCart.forEach(item => {
//       item.ticketQuantity = item.ticketQuantity + item.quantity;       
//     });

//     updateCartOnServer(validCart)
//     clearCart();

//     // You can choose to clear the cart here or handle it as needed
//     clearCart();
// });

// returntoCart.addEventListener('click', function() {
//     try {
//         // Perform a fetch to get updated product data
//         const response = fetch('/getProducts');
//         const updatedData = response.json();

//         const validCart = listCart.filter(item => item !== null);

//         // Update item.ticketQuantity values with the latest data from the fetch
//         validCart.forEach(item => {
//             const matchingProduct = updatedData.find(product => product.name === item.name);
//             if (matchingProduct) {
//                 const matchingTicket = matchingProduct.type.find(ticket => ticket.ticketType === item.ticktype);
//                 if (matchingTicket) {
//                     item.ticketQuantity = matchingTicket.ticketQuantity;
//                     console.log(matchingTicket.ticketQuantity);
//                 }
//             }
//         });


//         validCart.forEach(item => {
//             item.ticketQuantity = item.ticketQuantity + item.quantity;
//         });

//         // Now that item.ticketQuantity values are updated, you can proceed with calculations

//         // Clear the cart locally or handle it as needed
//         updateCartOnServer(validCart);
//         clearCart();

//         // Perform any other calculations or actions

//         // After all calculations are completed, you can redirect to another page
//         window.location.href = '/events.html';
//     } catch (error) {
//         console.error('Error:', error);
//         // Handle any errors that occur during the process
//     }
// });



// returntoCart.addEventListener('click', function() {
//     // Perform a fetch to get updated product data
//     fetch('/getProducts')
//     .then(response => response.json())
//     .then(updatedData => {
//         const validCart = listCart.filter(item => item !== null);
//         validCart.forEach(item => {
//             const matchingItem = updatedData.find(product => product.name === item.name);
//             if (matchingItem) {
//                 item.ticketQuantity = matchingItem.ticketQuantity;
//             }
//         });

//         // Clear the cart locally or handle it as needed
//         clearCart();

//         // Update the page or perform any additional actions with the updated data
//         // ...

//         // Now, after all operations are complete, call updateCartOnServer
//         updateCartOnServer(validCart);
//     });
// });

function clearCart() {
    listCart = []; // Empty the cart array
    document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Remove the cart cookie
}

//------------------------------------------updating cart logic below------------------------------------------------------------
//listCart = []
// function updateCartOnServer(listCart) {
//     // Send a request to the server to update the cart in MongoDB
//     fetch('/api/updateCart', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ cart: listCart }),
//     })
//     .then(response => response.json())
//     .then(data => {
//     })
// }

function updateCartOnServer(cart) {
    // Send a WebSocket message to update the cart on the server
    // const ws = new WebSocket('wss://www.eventifyed.com:5000'); // Replace with your WebSocket server URL
    const ws = new WebSocket(host); // Replace with your WebSocket server URL
  
    ws.addEventListener('open', () => {
      console.log('WebSocket connection is open.');

      const message = JSON.stringify({
        action: 'updateCart',
        cart: cart,
        requestFetch: true,
      });
      ws.send(message);
    });

    ws.addEventListener('ping', () => {
        // When a ping message is received from the server, respond with a pong
        ws.pong();
        console.log('Sent a ping to the server.');
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
      if(data.action == 'numberOfClients'){
        const numberOfClients = data.count;
        console.log(`Number of connected clients: ${numberOfClients}`);
      }
      else if (data.action === 'cartUpdated') {
        // Handle the case where the cart has been updated by another user.
        // You can update the client's cart and UI here.
        console.log('Cart updated by another user');
        //alert('Another user updated the cart');

        if (data.requestReload) {
            // Reload the page when requested by the server
            window.location.reload();
          }
        //checkCart(); // Update the cart on the client side
      }
    });
}

function startTimer() {
    const startTime = new Date().getTime();
    const timerDuration = 10 * 60 * 1000; // 1 minute in milliseconds
  
    const timerInterval = setInterval( () => {
      const currentTime = new Date().getTime();
      const timeRemaining = startTime + timerDuration - currentTime;
  
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        try {
          handleTimerExpiration();
          // All calculations and API calls are complete, redirect to events.html
          //clearCart();
          delayTimer(2000);
        } catch (error) {
          console.error('Error during calculations:', error);
        }
      } else {
        // Update the timer display with the time remaining.
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        document.getElementById('timer-display').textContent = `${minutes}:${seconds}`;
      }
    }, 1000);
  }
  
  function handleTimerExpiration() {
    fetch('/getProducts')
    .then(response => response.json())
    .then(updatedData => {
        const validCart = listCart.filter(item => item !== null);

        // Update item.ticketQuantity values with the latest data
        validCart.forEach(item => {
            // Find the product with the matching name
            const matchingProduct = updatedData.find(product => product.name === item.name);

            if (matchingProduct) {
                // Find the corresponding ticketType
                const matchingTicket = matchingProduct.type.find(ticket => ticket.ticketType === item.ticktype);
                console.log(matchingTicket);
                if (matchingTicket) {
                    // Update item.ticketQuantity with the value from the matching ticket
                    item.ticketQuantity = matchingTicket.ticketQuantity;
                    console.log(matchingTicket.ticketQuantity);
                }
            }
        });

        // Now that item.ticketQuantity values are updated, you can perform calculations
        validCart.forEach(item => {
            item.ticketQuantity = item.ticketQuantity + item.quantity;
        });

      updateCartOnServer(validCart);
    });
  };

  function delayTimer(delay){
    setTimeout(function() {
        console.log("delay taken place");
        window.location.href = '/events.html';
    }, delay);
  }
  

// function startTimer() {
//   const startTime = new Date().getTime();
//   const timerDuration = 1 * 60 * 1000; // 15 minutes in milliseconds

//   const timerInterval = setInterval(() => {
//     const currentTime = new Date().getTime();
//     const timeRemaining = startTime + timerDuration - currentTime;
    
//     if (timeRemaining <= 0) {
//         clearInterval(timerInterval);
//         // Timer expired, handle the release of tickets here.
//         // You can make an API call to your server to release tickets.
//         //   console.log(listCart)
//         //   const validCart = listCart.filter(item => item !== null);
//         //   validCart.forEach(item => {
//         //     item.ticketQuantity = item.staticQuantity;       
//         //   });
//         fetch('/getProducts')
//         .then(response => response.json())
//         .then(updatedData => {
//             const validCart = listCart.filter(item => item !== null);

//             // Update item.ticketQuantity values with the latest data
//             validCart.forEach(item => {
//                 // Find the product with the matching name
//                 const matchingProduct = updatedData.find(product => product.name === item.name);

//                 if (matchingProduct) {
//                     // Find the corresponding ticketType
//                     const matchingTicket = matchingProduct.type.find(ticket => ticket.ticketType === item.ticktype);
//                     console.log(matchingTicket);
//                     if (matchingTicket) {
//                         // Update item.ticketQuantity with the value from the matching ticket
//                         item.ticketQuantity = matchingTicket.ticketQuantity;
//                         console.log(matchingTicket.ticketQuantity);
//                     }
//                 }
//             });

//             // Now that item.ticketQuantity values are updated, you can perform calculations
//             validCart.forEach(item => {
//                 item.ticketQuantity = item.ticketQuantity + item.quantity;
//             });

//             updateCartOnServer(validCart)
//             window.location.href = '/events.html';
//         });
//     } else {
//       // Update the timer display with the time remaining.
//       const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
//       document.getElementById('timer-display').textContent = `${minutes}:${seconds}`;
//     }
//   }, 1000);
// }

// Call the startTimer function when the page loads
// window.onload = checkCart();
// window.onload = updateCartOnServer(listCart);
// window.onload = startTimer;

window.onload = () => {
    //checkCart();
    updateCartOnServer(listCart);
    startTimer();
  };
