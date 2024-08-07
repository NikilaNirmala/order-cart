const itemContainerHTML = document.getElementById("item-container");
let listProducts = [];
let fruitBtn = document.getElementById("fruit");
let vegetableBtn = document.getElementById("vegetable");
let diaryBtn = document.getElementById("Diary");
let meatSeafoodBtn = document.getElementById("Meat-seafood");
let cookingBtn = document.getElementById("baking-cooking");

// add the json data to the HTML

// displaying the cart section
const cartInterfaceHTML = document.getElementById("cart-container");
const cartBtn = document.getElementById("cart-button");

cartBtn.addEventListener("click", () => {
    cartInterfaceHTML.classList.toggle("cart-display");
})

// adding items to the cart
const cartCounter = document.getElementById("counter");
const cartTableItemsHTML = document.getElementById("item-selection");
let carts = [];



itemContainerHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains("add-to-cart-btn")) {
        let product_info = positionClick.parentElement;
        let product_id = product_info.parentElement.dataset.id;
        addToCart(product_id)
    }
})

const addToCart = (product_id) => {
    let productPositionInCart = carts.findIndex((value) => value.product_id == product_id);

    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity : 1

        }]
    } else if (productPositionInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    } else {
        carts[productPositionInCart].quantity = carts[productPositionInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToHTML = () => {
    cartTableItemsHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0){
        carts.forEach(cart => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement("tr");
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newCart.classList.add("cart-item");
            newCart.innerHTML = '<td class="cart-item-image"><img src="'+ info.image +'" alt="'+ info.name +'" /></td><td class="cart-item-name"><h3>'+ info.name + '</h3></td><td class="cart-item-price"><h3>'+ info.price * cart.quantity +'</h3></td><td class="quantity"><span class="minus">&lt;</span><span class="counter">' + cart.quantity + '</span><span class="plus">&gt;</span></td><td><button id="delete" onclick="removeItemFromCart("${cart.product_id}")"><img src="./img/icons/deleteLogo.svg" alt="Remove item" /></button></td>';
            cartTableItemsHTML.appendChild(newCart);
        })
    }
}

const addCartToMemory = () => {
    localStorage.setItem("cart", JSON.stringify(carts));
}

const addDataToHTML = () => {
    itemContainerHTML.innerHTML = '';
    if(listProducts.length > 0) {

        listProducts.forEach(product => {
            let newProduct = document.createElement('section');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = '<section class="image"><img src="'+ product.image +'" alt="'+ product.name +'" /></section><section class="item-info"><h3 class="name">'+ product.name +'</h3><h3 class="price">Rs: ' + product.price + '.00</h3><button class="add-to-cart-btn">Add to Cart</button></section>';
            itemContainerHTML.appendChild(newProduct);
        })
    }
}

cartTableItemsHTML.addEventListener("click", (event) => {
    let positionClick = event.target
    if (positionClick.classList.contains("minus") || positionClick.classList.contains("plus"))
        product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if (positionClick.classList.contains("plus")) {
        type = 'plus';
    }
    changeQuantity();
})

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = carts[positionItemInCart];
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = carts[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    carts[positionItemInCart].quantity = changeQuantity;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    // get the data from the json
    fetch('./products/product.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();

        if (localStorage.getItem("cart")) {
            carts = JSON.parse(localStorage.getItem("cart"));
            addCartToHTML();
        }
    })
}


initApp();