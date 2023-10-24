//comment
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});

let iconCart = document.querySelector('.iconCart');
let clearCartButton = document.querySelector('.clear-cart-button');
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
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

let selectedTicketType = null;

//show datas product in list 
// function addDataToHTML(){
//     // remove datas default from HTML
//     let listProductHTML = document.querySelector('.listProduct');
//     listProductHTML.innerHTML = '';

//     // add new datas
//     if(products != null) // if has data
//     {
//         products.forEach(product => {
//             let newProduct = document.createElement('div');
//             newProduct.classList.add('item');
//             newProduct.innerHTML = 
//             `<img src="${product.image}" alt="">
//             <h2>${product.name}</h2>
//             <div class="price">€${product.price}</div>
//             <button onclick="addCart(${product.id})">Add To Cart</button>`;

//             listProductHTML.appendChild(newProduct);

//             listProductHTML.addEventListener('click', function(){
//                 if(cart.style.right == '-100%'){
//                     cart.style.right = '0';
//                     container.style.transform = 'translateX(-400px)';
//                 }else{
//                     cart.style.right = '-100%';
//                     container.style.transform = 'translateX(0)';
//                 }
//             })
//         });
//     }
// }
// // Function to save the selected ticket type
function saveSelectedTicketType() {
    // Get the select element
    const ticketTypeSelect = document.getElementById("ticketType");

    // Get the selected value (either "earlyBird" or "standard")
    selectedTicketType = ticketTypeSelect.value;

    // Display the selected ticket type
    const selectedTicketElement = document.getElementById("selectedTicket");
    selectedTicketElement.textContent = selectedTicketType;

    // You can use the 'selectedTicketType' variable as needed
    // For example, you can perform different actions based on the selection.
    // if (selectedTicketType === "") {
    //     // Do something for Early Bird ticket
    // } else if (selectedTicketType === "standard") {
    //     // Do something for Standard ticket
    // }
    //   else if (selectedTicketType === "earlyBird") {
    //     // Do something for Early Bird ticket
    // } 
    //   else if (selectedTicketType === "standard") {
    //     // Do something for Standard ticket
    // }
}


function addDataToHTML() {
    // remove datas default from HTML
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    // add new datas
    if (products != null) // if has data
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            
            // Create a container for the background effect
            let backgroundEffect = document.createElement('div');
            backgroundEffect.classList.add('item-bg');
            backgroundEffect.style.backgroundImage = `url(${product.image})`;

            newProduct.appendChild(backgroundEffect);

            // if needed for adding to selected ticket type bit
            // <p>Selected Ticket Type: <span id="selectedTicket"></span></p>
            // <button class=saveticket" onclick="saveSelectedTicketType()">Save Ticket Type</button>
            newProduct.innerHTML += 
            `<h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="price">${product.ticketDescription}</div>
            <button onclick="checkProductId('${product.name}')">Add To Cart</button>
            <label for="ticketType">Select Ticket Type:</label>
            <select id="ticketType">
                <option value="EarlyBird (Non-Member)">EarlyBird (Non-Member)</option>
                <option value="EarlyBird (Member)">EarlyBird (Member)</option>
                <option value="Standard (Non-Member)">Standard (Non-Member)</option>
                <option value="Standard (Member)">Standard (Member)</option>
            </select>
            <script src="script.js"></script>`;

            listProductHTML.appendChild(newProduct);

            let addButton = newProduct.querySelector('button');

            addButton.addEventListener('click', function(){
                if(cart.style.right == '-100%'){
                    cart.style.right = '0';
                    container.style.transform = 'translateX(-400px)';
                } else {
                    cart.style.right = '0%';
                    container.style.transform = 'translateX(-400px)';
                    event_container.style.transform = 'translateX(-150px)';
                }
            });
            
            const ticketSelection = document.getElementById("ticketType");
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
            
        });
    }
}

function clearCart() {
    listCart = []; // Empty the cart array
    document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; // Remove the cart cookie
    addCartToHTML(); // Refresh the cart view
}


//use cookie so the cart doesn't get lost on refresh page
let listCart = [];
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
checkCart();
function checkProductId(productName){
    console.log()
    const selectedProduct = products.find(product => product.name === productName);
    console.log(selectedProduct);
    const ticketSelection = document.getElementById("ticketType");
    const selectedValue = ticketSelection.value; // Get the selected value here

    let productID = null;
    let productQuantity = null;

    // if (selectedValue === "EarlyBird") {
    //     const earlyBirdID = selectedProduct.type.find(type => type.ticketType === "EarlyBird");
    //     productID = earlyBirdID ? earlyBirdID.id : null;
    //     productTicketType = earlyBirdID ? earlyBirdID.ticketType : null;
    //     productQuantity = earlyBirdID ? earlyBirdID.quantity : null;
    // } else if (selectedValue === "Standard") {
    //     const standardID = selectedProduct.type.find(type => type.ticketType === "Standard");
    //     productID = standardID ? standardID.id : null;
    //     productTicketType = standardID ? standardID.ticketType : null;
    //     productQuantity = standardID ? standardID.quantity : null;
    // }

    if (selectedValue === "EarlyBird (Non-Member)") {
        const earlyBirdNonMemberID = selectedProduct.type.find(type => type.ticketType === "EarlyBird (Non-Member)");
        productID = earlyBirdNonMemberID ? earlyBirdNonMemberID.id : null;
        productTicketType = earlyBirdNonMemberID ? earlyBirdNonMemberID.ticketType : null;
        productQuantity = earlyBirdNonMemberID ? earlyBirdNonMemberID.quantity : null;
    } else if (selectedValue === "EarlyBird (Member)") {
        const earlyBirdMemberID = selectedProduct.type.find(type => type.ticketType === "EarlyBird (Member)");
        productID = earlyBirdMemberID ? earlyBirdMemberID.id : null;
        productTicketType = earlyBirdMemberID ? earlyBirdMemberID.ticketType : null;
        productQuantity = earlyBirdMemberID ? earlyBirdMemberID : null;
    }
    else if (selectedValue === "Standard (Non-Member)") {
        const StandardNonMemberID = selectedProduct.type.find(type => type.ticketType === "Standard (Non-Member)");
        productID = StandardNonMemberID ? StandardNonMemberID.id : null;
        productTicketType = StandardNonMemberID ? StandardNonMemberID.ticketType : null;
        productQuantity = StandardNonMemberID ? StandardNonMemberID : null;
    }
    else if (selectedValue === "Standard (Member)") {
        const StandardMemberID = selectedProduct.type.find(type => type.ticketType === "Standard (Member)");
        productID = StandardMemberID ? StandardMemberID.id : null;
        productTicketType = StandardMemberID ? StandardMemberID.ticketType : null;
        productQuantity = StandardMemberID ? StandardMemberID : null;
    }

    if (productID !== null) {
        console.log("Product Name: " + selectedProduct.name);
        console.log("Product TicketType: " + productTicketType);
        console.log("Product ID: " + productID);
        console.log("Product Quantity: " + productQuantity);
        // Call the addCart function with the product ID and selected value
        addCart(productID, productTicketType, selectedValue);
    }
}


// function checkProductId(){
//     const ticketSelection = document.getElementById("ticketType");
//     const selectedValue = ticketSelection.value; // Get the selected value here
//     let productID = null;
//     let productQuantity = null;

//     products.forEach(product => {
//         if (selectedValue === "EarlyBird") {
//             const earlyBirdID = product.type.find(type => type.ticketType === "Early-bird");
//             // console.log("the name" + product.name)
//             productID = earlyBirdID ? earlyBirdID.id : null;
//             productQuantity =  earlyBirdID ? earlyBirdID.quantity : null;
//         } else if (selectedValue === "Standard") {
//             const standardID = product.type.find(type => type.ticketType === "Standard");
//             productID = standardID ? standardID.id : null;
//             productQuantity = standardID ? standardID.quantity : null;
//         }
    
//         if (productID !== null) {
//             console.log("Product Name: " + product.name);
//             console.log("Product ID: " + productID);
//             console.log("Product Quantity: " + productQuantity);
//             // addCart(productID, selectedValue);
//         }
//     })
// }



// function addCart($idProduct){
//     let productsCopy = JSON.parse(JSON.stringify(products));
//     //// If this product is not in the cart
//     if(!listCart[$idProduct]) 
//     {
//         listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
//         listCart[$idProduct].quantity = 1;
//     }else{
//         //If this product is already in the cart.
//         //I just increased the quantity
//         listCart[$idProduct].quantity++;
//     }
//     document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

//     addCartToHTML();
// }

// function addCart($idProduct){
//     console.log($idProduct);
//     let productsCopy = JSON.parse(JSON.stringify(products));
//     //// If this product is not in the cart
//     if(!listCart[$idProduct]) 
//     {
//         listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
//         console.log("listCart[$idProduct]", listCart[$idProduct]);
//         listCart[$idProduct].quantity = 1;
//         // listCart[$quantityProduct] = 1;
//     }else{
//         //If this product is already in the cart.
//         //I just increased the quantity
//         listCart[$idProduct].quantity++;
//         // listCart[$quantityProduct]++;
//     }
//     console.log(listCart[$idProduct]);
//     document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

//     addCartToHTML();
// }

// function addCart($idProduct) {
//     console.log($idProduct);
//     let productsCopy = JSON.parse(JSON.stringify(products));
    
//     // If this product is not in the cart
//     if (!listCart[$idProduct]) {
//         // Find the product with the given id in the products array
//         const productToAdd = productsCopy.find(product => product.type.id === $idProduct);
        
//         if (productToAdd) {
//             listCart[$idProduct] = productToAdd;
//             console.log("listCart[$idProduct]", listCart[$idProduct]);
//             listCart[$idProduct].quantity = 1;
//         }
//     } else {
//         // If this product is already in the cart.
//         // Increase the quantity
//         listCart[$idProduct].quantity++;
//     }
    
//     console.log(listCart[$idProduct]);
//     document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    
//     addCartToHTML();
// }

// function addCart($idProduct){
//     let productsCopy = JSON.parse(JSON.stringify(products));
//     console.log(products);
//     //// If this product is not in the cart
//     if(!listCart[$idProduct]) 
//     {
//         listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
//         listCart[$idProduct].quantity = 1;
//     }else{
//         //If this product is already in the cart.
//         //I just increased the quantity
//         listCart[$idProduct].quantity++;
//     }
//     document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

//     addCartToHTML();
// }

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
                        listCart[productTypeID].ticktype = productType.ticketType;
                        listCart[productTypeID].variablePrice = productType.price;
                        console.log("check here: " + listCart[productTypeID].ticktype);
                    } else {
                        // If the product type is already in the cart, increase the quantity
                        listCart[productTypeID].quantity++;
                    }
                }
                else{
                    console.log("Not a match" + productType.id);
                }
            }
        }
    } else {
        // If this product type is already in the cart, increase the quantity
        listCart[productTypeID].quantity++;
    }
    
    // console.log(listCart[$idProduct]);
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    
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
    function getPriceForSelectedType(product, selectedValue) {
        let price = null;
        // Check the selected ticket type and find the corresponding price
        if (selectedValue === "EarlyBird (Non-Member)") {
            const earlyBirdNonMemberPrice = product.type.find(type => type.ticketType === "EarlyBird (Non-Member)");
            price = earlyBirdNonMemberPrice ? earlyBirdNonMemberPrice.price : null;
        } else if (selectedValue === "EarlyBird (Member)") {
            const earlyBirdMemberPrice = product.type.find(type => type.ticketType === "EarlyBird (Member)");
            price = earlyBirdMemberPrice ? earlyBirdMemberPrice.price : null;
        } else if (selectedValue === "Standard (Non-Member)") {
            const standardNonMemberPrice = product.type.find(type => type.ticketType === "Standard (Non-Member)");
            price = standardNonMemberPrice ? standardNonMemberPrice.price : null;
        } else if (selectedValue === "Standard (Member)") {
            const standardMemberPrice = product.type.find(type => type.ticketType === "Standard (Member)");
            price = standardMemberPrice ? standardMemberPrice.price : null;
        }
        return price;
    }

    console.log("Real shi: " + selectedTicketType);

    // If there are products in the cart
    if (listCart) {
        Object.entries(listCart).forEach(([productTypeID, product]) => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');

                // Find the price for the selected ticket type
                let price = getPriceForSelectedType(product, selectedValue);

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

// Function to get the price based on the selected ticket type
// function getPriceForSelectedType(product, selectedValue) {
//     let price = null;
//     // Check the selected ticket type and find the corresponding price
//     if (selectedValue === "EarlyBird") {
//         const earlyBirdPrice = product.type.find(type => type.ticketType === "EarlyBird");
//         price = earlyBirdPrice ? earlyBirdPrice.price : null;
//     } else if (selectedValue === "Standard") {
//         const standardPrice = product.type.find(type => type.ticketType === "Standard");
//         price = standardPrice ? standardPrice.price : null;
//     }
//     return price;
// }

function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    // save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // reload html view cart
    addCartToHTML();
}