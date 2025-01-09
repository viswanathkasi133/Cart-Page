document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            let subtotal = 0;
            data.items.forEach(item => {
                const itemTotal = item.final_line_price / 100;
                subtotal += itemTotal;

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p>Price: ₹${(item.price / 100).toLocaleString()}</p>
                        <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-id="${item.id}"></p>
                        <p>Subtotal: ₹${itemTotal.toLocaleString()}</p>
                        <button class="remove-item" data-id="${item.id}">🗑️</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
            totalElement.textContent = `₹${subtotal.toLocaleString()}`;

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = this.getAttribute('data-id');
                    const itemElement = this.closest('.cart-item');
                    itemElement.remove();
                    updateTotals();
                });
            });

            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('change', function() {
                    const itemId = this.getAttribute('data-id');
                    const newQuantity = parseInt(this.value);
                    updateTotals();
                });
            });

            function updateTotals() {
                let newSubtotal = 0;
                document.querySelectorAll('.cart-item').forEach(item => {
                    const price = parseFloat(item.querySelector('.item-details p:nth-child(2)').textContent.replace('Price: ₹', '').replace(/,/g, ''));
                    const quantity = parseInt(item.querySelector('input[type="number"]').value);
                    newSubtotal += price * quantity;
                });
                subtotalElement.textContent = `₹${newSubtotal.toLocaleString()}`;
                totalElement.textContent = `₹${newSubtotal.toLocaleString()}`;
            }
        })
        .catch(error => console.error('Error fetching cart data:', error));
});