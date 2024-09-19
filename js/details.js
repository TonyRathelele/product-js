let products = null;
// Get data from the JSON file


async function fetchData() {
    try {
        const response = await fetch('js/products.json');
        const data = await response.json();
        products = data;
        showDetail();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();



function showDetail() {
    let detail = document.querySelector('.detail');
    let listProduct = document.querySelector('.listProduct');
    let productId = new URLSearchParams(window.location.search).get('id');
    let thisProduct = products.find(value => value.id == productId);

    // Redirect to the home page if the product does not exist
    if (!thisProduct) {
        window.location.href = "/";
        return;
    }

    detail.querySelector('.image img').src = thisProduct.image;
    detail.querySelector('.name').innerText = thisProduct.name;
    detail.querySelector('.price').innerText = 'R' + thisProduct.price;
    detail.querySelector('.description').innerText = thisProduct.description;
    detail.querySelector('.quantity').innerText = 'Availability: ' + thisProduct.quantity + ' in stock';
    detail.querySelector('.color').innerText = 'Colour Shown: ' + thisProduct.color;

    // Set the onclick event for the Add to Cart button
    detail.querySelector('.cart_add').onclick = () => addToCart(thisProduct.id, thisProduct.name);

    products.filter(value => value.id != productId).forEach(product => {
        let newProduct = document.createElement('a');
        newProduct.href = 'detail.html?id=' + product.id;
        newProduct.classList.add('item');
        newProduct.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <div class="price">R${product.price}</div>
        `;
        listProduct.appendChild(newProduct);
    });
}

function addToCart(id, name) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ id, name, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    toggleCart();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart__total').innerText = cartTotal;
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        // If cart is empty, show a message and hide cart container
        cartItems.innerHTML = '<p class="Empty">Your cart is empty.</p>';
        cartContainer.style.display = 'none'; // Optionally hide the entire cart container
        return;
    }



    cart.forEach(item => {
        const product = products.find(p => p.id === item.id); // Find the product details from the products list
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
        <div class="flex cart-item-details">
            <img src="${product.image}" alt="${product.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div style="font-weight: bold;">${product.name}</div>
                <div>Price: R ${product.price}</div>

            <div class="quantity-container">

                <button class="quantity-btn decrease-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <span class="quantity-number">${item.quantity}</span>
                <button class="quantity-btn increase-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-button"><img src="img/delete.png" alt="Delete"></button>
        </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Update the cart summary
    const subtotal = cart.reduce((acc, item) => {
        const product = products.find(p => p.id === item.id);
        return acc + (parseFloat(product.price.replace(',', '')) * item.quantity);
    }, 0);
    let discounts = 0;
    
    if (subtotal >= 5000) {
        discounts = subtotal * 0.10; // 10% of subtotal
    }
    const total = subtotal - discounts;

    document.getElementById('cartSubtotal').innerText = `R ${subtotal.toFixed(2)}`;
    document.getElementById('cartDiscounts').innerText = `R ${discounts.toFixed(2)}`;
    document.getElementById('cartTotal').innerText = `R ${total.toFixed(2)}`;
}

function increaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function decreaseQuantity(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== id);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function toggleCart() {
    const sidebarCart = document.getElementById('sidebarCart');
    sidebarCart.classList.toggle('active');
}


function toggleCart() {
    const sidebarCart = document.getElementById('sidebarCart');
    sidebarCart.classList.toggle('active');
}

//stripe
document.querySelector('.checkout-button').addEventListener('click', async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
    });

    const session = await response.json();
    const stripe = Stripe('pk_test_51OYBmkCaB7daml66qkBTd5TEh2dxF1tkPPckQPccT7XKQGtIVENs9WyKhsVrSRykbqVyF5vOKLNssEsz3xBvi24h00Y2A4ZkgE'); // Replace with your Stripe public key

    stripe.redirectToCheckout({ sessionId: session.id });
});



// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
});