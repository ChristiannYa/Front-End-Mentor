document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.cart-btn');
    const cartItems = document.querySelector('.cart-items');
    const emptyPlaceholder = document.querySelector('.empty-placeholder');
    const totalPriceDiv = document.querySelector('.total-price');
    const confirmDiv = document.querySelector('.confirm');
    let totalPrice = 0;

    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const wrapper = button.closest('.item-info-wrapper');
            const clickButton = wrapper.querySelector('.cart-btn-click');
            const amountPlaceholder = clickButton.querySelector('.amount-placeholder');
            const itemName = wrapper.querySelector('.item-name').textContent;
            const itemPrice = parseFloat(wrapper.querySelector('.item-price').textContent.replace('$', ''));

            button.style.display = 'none';
            clickButton.style.visibility = 'visible';
            updateCount(clickButton, amountPlaceholder, itemName, itemPrice, 1);
        });
    });

    function updateCount(clickButton, amountPlaceholder, itemName, itemPrice, change) {
        let count = parseInt(amountPlaceholder.textContent) + change;
        amountPlaceholder.textContent = count;

        if (count === 0) {
            clickButton.style.visibility = 'hidden';
            clickButton.previousElementSibling.style.display = 'flex';
            removeFromCart(itemName, itemPrice);
        } else {
            updateCart(itemName, itemPrice, count);
        }
        updateTotalPrice(itemPrice * change);
        updateConfirmButton();
    }

    function updateCart(itemName, itemPrice, count) {
        let cartItem = cartItems.querySelector(`[data-item="${itemName}"]`);
        if (!cartItem) {
            cartItem = document.createElement('div');
            cartItem.setAttribute('data-item', itemName);
            cartItem.innerHTML = `
          <p>${itemName}</p>
          <p class="item-count">${count}</p>
          <p>$${(itemPrice * count).toFixed(2)}</p>
        `;
            cartItems.appendChild(cartItem);
        } else {
            cartItem.querySelector('.item-count').textContent = count;
            cartItem.querySelector('p:last-child').textContent = `$${(itemPrice * count).toFixed(2)}`;
        }
        emptyPlaceholder.style.display = 'none';
        cartItems.style.display = 'block';
    }

    function removeFromCart(itemName, itemPrice) {
        const cartItem = cartItems.querySelector(`[data-item="${itemName}"]`);
        if (cartItem) {
            const count = parseInt(cartItem.querySelector('.item-count').textContent);
            updateTotalPrice(-itemPrice * count);
            cartItems.removeChild(cartItem);
        }
        if (cartItems.children.length === 0) {
            emptyPlaceholder.style.display = 'block';
            cartItems.style.display = 'none';
        }
        updateConfirmButton();
    }

    function updateTotalPrice(change) {
        totalPrice += change;
        totalPriceDiv.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

    function updateConfirmButton() {
        if (cartItems.children.length > 0) {
            if (!confirmDiv.querySelector('button')) {
                const confirmButton = document.createElement('button');
                confirmButton.textContent = 'Confirm Order';
                confirmButton.addEventListener('click', confirmOrder);
                confirmDiv.appendChild(confirmButton);
            }
        } else {
            const confirmButton = confirmDiv.querySelector('button');
            if (confirmButton) {
                confirmDiv.removeChild(confirmButton);
            }
        }
    }

    function confirmOrder() {
        alert(`Total: $${totalPrice.toFixed(2)}`);
        // Here you can add more functionality for order confirmation
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.cart-btn-click')) {
            const clickButton = e.target.closest('.cart-btn-click');
            const wrapper = clickButton.closest('.item-info-wrapper');
            const amountPlaceholder = clickButton.querySelector('.amount-placeholder');
            const itemName = wrapper.querySelector('.item-name').textContent;
            const itemPrice = parseFloat(wrapper.querySelector('.item-price').textContent.replace('$', ''));

            if (e.target.alt === 'remove') {
                updateCount(clickButton, amountPlaceholder, itemName, itemPrice, -1);
            } else if (e.target.alt === 'add more') {
                updateCount(clickButton, amountPlaceholder, itemName, itemPrice, 1);
            }
        }
    });
});
