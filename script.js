document.addEventListener('DOMContentLoaded', function () {
    const cartButtons = document.querySelectorAll('.cart-btn');
    const cartItems = document.querySelector('.cart-items');
    const emptyPlaceholder = document.querySelector('.empty-placeholder');

    cartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const itemWrapper = this.closest('.item-info-wrapper');
            const itemName = itemWrapper.querySelector('.item-name').textContent;
            const itemPrice = itemWrapper.querySelector('.item-price').textContent;

            // Create a new cart item element
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
          <p class="cart-item-name">${itemName}</p>
          <p class="cart-item-price">${itemPrice}</p>
        `;

            // Add the new item to the cart
            cartItems.appendChild(cartItem);

            // Hide the empty placeholder if it's visible
            if (emptyPlaceholder.style.display !== 'none') {
                emptyPlaceholder.style.display = 'none';
            }
        });
    });
});
