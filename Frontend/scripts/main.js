document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadProducts();
    updateCartCount();
    updateCartDisplay();
});

function checkLoginStatus() {
    fetch('/api/auth/status')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById('login-link').style.display = 'none';
            } else {
                document.getElementById('login-link').style.display = 'inline';
            }
        })
        .catch(error => console.error('Error checking login status:', error));
}

function loadProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            const productsSection = document.getElementById('products');
            productsSection.innerHTML = ''; // Clear existing products
            data.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product-item';
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: ${product.price} kr</p>
                    <button onclick="addToCart(${product.id}, '${product.name}', '${product.image}', ${product.price})">Add to Cart</button>
                `;
                productsSection.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

let cart = [];

function addToCart(productId, productName, productImage, productPrice) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity++;
    } else {
        cart.push({ id: productId, name: productName, image: productImage, price: productPrice, quantity: 1 });
    }
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    document.getElementById('cart-count').innerText = 'Cart';
}

function updateCartDisplay() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.innerHTML = '';

    if (cart.length === 0) {
        cartDropdown.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <button class="remove-item" onclick="removeFromCart(${item.id})">X</button>
            </div>
        `;
        cartDropdown.appendChild(productElement);
        total += item.price * item.quantity;
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `<p>Total: ${total} kr</p>`;
    cartDropdown.appendChild(totalElement);

    const checkoutButton = document.createElement('button');
    checkoutButton.innerText = 'Checkout';
    cartDropdown.appendChild(checkoutButton);
}