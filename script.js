document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.cart-btn');
    const itemsContainer = document.querySelector('.items-container');
    const cartSelectionWrapper = document.querySelector('.cart-selection-wrapper');
    const emptyPlaceholder = document.querySelector('.empty-placeholder');
    let totalPrice = 0;

    cartButtons.forEach(button => {
        button.addEventListener('click', handleCartButtonClick);
    });

    function handleCartButtonClick(event) {
        const button = event.currentTarget;
        const itemWrapper = button.closest('.item-info-wrapper');
        const itemName = itemWrapper.querySelector('.item-name').textContent;
        const itemPrice = parseFloat(itemWrapper.querySelector('.item-price').textContent.replace('$', ''));

        if (button.classList.contains('active')) {
            updateItemQuantity(button, itemName, itemPrice);
        } else {
            addItemToCart(button, itemName, itemPrice);
        }
    }

    function addItemToCart(button, itemName, itemPrice) {
        button.classList.add('active');
        button.innerHTML = `
        <img src="assets/images/icon-decrement-quantity.svg" alt="Decrease" class="decrease miniBtn">
        <span class="quantity text-preset-4b">1</span>
        <img src="assets/images/icon-increment-quantity.svg" alt="Increase" class="increase miniBtn">
      `;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
        <span class="item-name">${itemName}</span>
        <span class="item-price">$${itemPrice.toFixed(2)}</span>
        <span class="item-quantity">x1</span>
        <span class="item-total">$${itemPrice.toFixed(2)}</span>
        <img src="assets/images/icon-remove-item.svg" alt="Delete" class="delete-item-btn">
      `;

        itemsContainer.appendChild(cartItem);
        itemsContainer.style.display = 'block';
        emptyPlaceholder.style.display = 'none';

        button.querySelector('.decrease').addEventListener('click', (e) => updateItemQuantity(button, itemName, itemPrice, -1, e));
        button.querySelector('.increase').addEventListener('click', (e) => updateItemQuantity(button, itemName, itemPrice, 1, e));
        cartItem.querySelector('.delete-item-btn').addEventListener('click', () => removeItemFromCart(button, cartItem));

        updateTotalPrice(itemPrice);
    }

    function updateItemQuantity(button, itemName, itemPrice, change = 0, event) {
        if (event) event.stopPropagation();

        const quantityElement = button.querySelector('.quantity');
        let quantity = parseInt(quantityElement.textContent);

        if (change !== 0) {
            quantity += change;
        }

        if (quantity > 0) {
            quantityElement.textContent = quantity;
            const cartItem = Array.from(itemsContainer.children).find(item => item.querySelector('.item-name').textContent === itemName);
            cartItem.querySelector('.item-quantity').textContent = `x${quantity}`;
            cartItem.querySelector('.item-total').textContent = `$${(itemPrice * quantity).toFixed(2)}`;

            updateTotalPrice(itemPrice * change);
        } else {
            removeItemFromCart(button, Array.from(itemsContainer.children).find(item => item.querySelector('.item-name').textContent === itemName));
        }
    }

    function removeItemFromCart(button, cartItem) {
        button.classList.remove('active');
        button.innerHTML = `
        <img src="assets/images/icon-add-to-cart.svg" alt="shopping cart icon">
        <p class="text-preset-4b">Add to Cart</p>
      `;

        const itemTotal = parseFloat(cartItem.querySelector('.item-total').textContent.replace('$', ''));
        updateTotalPrice(-itemTotal);

        itemsContainer.removeChild(cartItem);

        if (itemsContainer.children.length === 0) {
            itemsContainer.style.display = 'none';
            emptyPlaceholder.style.display = 'block';
        }
    }

    function updateTotalPrice(change) {
        totalPrice += change;
        totalPrice = Math.max(0, totalPrice); // Ensure total price never goes below 0

        let totalPriceElement = cartSelectionWrapper.querySelector('.total-price');
        let deliveryInfo = cartSelectionWrapper.querySelector('.delivery-info');
        let confirmOrderButton = cartSelectionWrapper.querySelector('.confirm-order');

        if (totalPrice > 0) {
            if (!totalPriceElement) {
                totalPriceElement = document.createElement('p');
                totalPriceElement.classList.add('total-price');
                cartSelectionWrapper.appendChild(totalPriceElement);
            }
            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
            totalPriceElement.style.display = 'block';

            if (!deliveryInfo) {
                deliveryInfo = document.createElement('div');
                deliveryInfo.classList.add('delivery-info');
                deliveryInfo.textContent = 'This is a natural delivery';
                cartSelectionWrapper.appendChild(deliveryInfo);
            }

            if (!confirmOrderButton) {
                confirmOrderButton = document.createElement('button');
                confirmOrderButton.classList.add('confirm-order');
                confirmOrderButton.classList.add('text-preset-3');
                confirmOrderButton.textContent = 'Confirm Order';
                cartSelectionWrapper.appendChild(confirmOrderButton);
            }
        } else {
            if (totalPriceElement) totalPriceElement.style.display = 'none';
            if (deliveryInfo) cartSelectionWrapper.removeChild(deliveryInfo);
            if (confirmOrderButton) cartSelectionWrapper.removeChild(confirmOrderButton);
        }
    }
});
