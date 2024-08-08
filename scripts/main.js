document.addEventListener("DOMContentLoaded", () => {
    // Get necessary HTML elements
    const itemContainerHTML = document.getElementById("item-container");
    const cartInterfaceHTML = document.getElementById("cart-container");
    const cartBtn = document.getElementById("cart-button");
    const cartCounter = document.getElementById("counter");
    const cartTableItemsHTML = document.getElementById("item-selection");
    const totalAmountHTML = document.getElementById("total-amount");
    
    // Initialize cart and product list
    let listProducts = [];
    let carts = [];
    
    // Toggle cart display when cart button is clicked
    cartBtn.addEventListener("click", () => {
      cartInterfaceHTML.classList.toggle("cart-display");
    });
    
    // Add items to the cart when "Add to Cart" button is clicked
    itemContainerHTML.addEventListener("click", (event) => {
      const positionClick = event.target;
      if (positionClick.classList.contains("add-to-cart-btn")) {
        const productInfo = positionClick.parentElement;
        const productId = productInfo.parentElement.dataset.id;
        addToCart(productId);
      }
    });
    
    // Add a product to the cart or update its quantity
    const addToCart = (productId) => {
      const productPositionInCart = carts.findIndex((value) => value.product_id == productId);
      
      if (carts.length <= 0) {
        carts = [{ product_id: productId, quantity: 1 }];
      } else if (productPositionInCart < 0) {
        carts.push({ product_id: productId, quantity: 1 });
      } else {
        carts[productPositionInCart].quantity += 1;
      }
      addCartToHTML();
      updateCartCounter(); // Update the cart counter
      addCartToMemory();
    };
    
    // Update the cart table HTML
    const addCartToHTML = () => {
      cartTableItemsHTML.innerHTML = '';
      let totalQuantity = 0;
      let totalAmount = 0;
    
      if (carts.length > 0) {
        carts.forEach((cart) => {
          totalQuantity += cart.quantity;
          const newCart = document.createElement("tr");
          newCart.dataset.id = cart.product_id;
          const positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
          const info = listProducts[positionProduct];
          totalAmount += info.price * cart.quantity;
          newCart.classList.add("cart-item");
          newCart.innerHTML = `
            <td class="cart-item-image"><img src="${info.image}" alt="${info.name}" /></td>
            <td class="cart-item-name"><h3>${info.name}</h3></td>
            <td class="cart-item-price"><h3>${info.price * cart.quantity}</h3></td>
            <td class="quantity">
              <span class="minus">&lt;</span>
              <span class="counter">${cart.quantity}</span>
              <span class="plus">&gt;</span>
            </td>
            <td>
              <button class="remove-item-btn">
                <img src="./img/icons/deleteLogo.svg" alt="Remove item" />
              </button>
            </td>
          `;
          cartTableItemsHTML.appendChild(newCart);
        });
      }
      totalAmountHTML.textContent = `Total: Rs.${totalAmount}.00`;
    };
    
    // Update the cart counter based on the total quantity of items in the cart
    const updateCartCounter = () => {
      const totalQuantity = carts.reduce((sum, item) => sum + item.quantity, 0);
      cartCounter.textContent = totalQuantity;
    };
    
    // Save the current cart to local storage
    const addCartToMemory = () => {
      localStorage.setItem("cart", JSON.stringify(carts));
    };
    
    // Add products data to HTML
    const addDataToHTML = () => {
      itemContainerHTML.innerHTML = '';
      if (listProducts.length > 0) {
        listProducts.forEach((product) => {
          const newProduct = document.createElement('section');
          newProduct.classList.add('item');
          newProduct.dataset.id = product.id;
          newProduct.innerHTML = `
            <section class="image"><img src="${product.image}" alt="${product.name}" /></section>
            <section class="item-info">
              <h3 class="name">${product.name}</h3>
              <h3 class="price">Rs: ${product.price}.00</h3>
              <button class="add-to-cart-btn">Add to Cart</button>
            </section>`;
          itemContainerHTML.appendChild(newProduct);
        });
      }
    };
    
    // Handle clicks in the cart table for quantity changes and item removal
    cartTableItemsHTML.addEventListener("click", (event) => {
      const positionClick = event.target;
      if (positionClick.classList.contains("minus") || positionClick.classList.contains("plus")) {
        const productId = positionClick.parentElement.parentElement.dataset.id;
        const type = positionClick.classList.contains("plus") ? 'plus' : 'minus';
        changeQuantity(productId, type);
      } else if (positionClick.closest(".remove-item-btn")) {
        const productId = positionClick.closest("tr").dataset.id;
        removeItemFromCart(productId);
      }
    });
    
    // Change the quantity of an item in the cart
    const changeQuantity = (productId, type) => {
      const positionItemInCart = carts.findIndex((value) => value.product_id == productId);
      if (positionItemInCart >= 0) {
        switch (type) {
          case 'plus':
            carts[positionItemInCart].quantity += 1;
            break;
          default:
            const changeQuantity = carts[positionItemInCart].quantity - 1;
            if (changeQuantity > 0) {
              carts[positionItemInCart].quantity = changeQuantity;
            } else {
              carts.splice(positionItemInCart, 1);
            }
            break;
        }
      }
      addCartToHTML();
      updateCartCounter(); // Update the cart counter
      addCartToMemory();
    };
    
    // Remove an item from the cart
    const removeItemFromCart = (productId) => {
      const indexToRemove = carts.findIndex((item) => item.product_id === productId);
      if (indexToRemove !== -1) {
        carts.splice(indexToRemove, 1);
        addCartToHTML();
        updateCartCounter(); // Update the cart counter
        addCartToMemory();
      }
    };
    
    // Save the current cart as favorites
    const saveFavorite = () => {
      localStorage.setItem("favoriteCart", JSON.stringify(carts));
      alert("Added to favorites successfully!");
    };
    
    // Load and apply the favorite cart
    const loadFavorite = () => {
      const favoriteCart = JSON.parse(localStorage.getItem("favoriteCart"));
      if (favoriteCart) {
        carts = favoriteCart;
        addCartToHTML();
        updateCartCounter(); // Update the cart counter
        addCartToMemory();
        alert("Favorites applied successfully!");
      } else {
        alert("No favorites found.");
      }
    };
    
    // Event listeners for favorite actions
    document.getElementById("add-to-favorite").addEventListener("click", saveFavorite);
    document.getElementById("apply-favorite").addEventListener("click", loadFavorite);
    
    // Initialize the app by loading product data and cart from local storage
    const initApp = () => {
      fetch('./products/product.json')
        .then((response) => response.json())
        .then((data) => {
          listProducts = data;
          addDataToHTML();
          if (localStorage.getItem("cart")) {
            carts = JSON.parse(localStorage.getItem("cart"));
            addCartToHTML();
            updateCartCounter(); // Update the cart counter
          }
        });
    };
    
    initApp();
  });
  
  // Ensure the removeItemFromCart function is globally accessible
  window.removeItemFromCart = removeItemFromCart;
  