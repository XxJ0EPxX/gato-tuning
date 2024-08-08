const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');

let allProducts = JSON.parse(localStorage.getItem('cart')) || [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Función para guardar el carrito en localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(allProducts));
};

// Función para mostrar el HTML del carrito
const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <button class="btn-decrease" data-title="${product.title}" data-color="${product.color}">-</button>
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <button class="btn-increase" data-title="${product.title}" data-color="${product.color}">+</button>
                <p class="titulo-producto-carrito">${product.title} - ${product.color}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
                data-title="${product.title}" data-color="${product.color}"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

        rowProduct.append(containerProduct);

        // Parse the price correctly with 'S/.'
        total += product.quantity * parseInt(product.price.slice(3));
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `S/. ${total}`;
    countProducts.innerText = totalOfProducts;
};

// Mostrar/Ocultar carrito
btnCart.addEventListener('click', () => {
    const isHidden = containerCartProducts.classList.toggle('hidden-cart');
    if (isHidden) {
        console.log('El carrito está oculto');
    } else {
        console.log('El carrito está visible');
    }
});

// Agregar al carrito
productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;
        const colorInput = product.querySelector('.selected-color');
        const selectedColor = colorInput ? colorInput.value : 'Sin color';

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('.price').textContent,
            color: selectedColor
        };

        const exists = allProducts.some(
            p => p.title === infoProduct.title && p.color === infoProduct.color
        );

        if (exists) {
            allProducts = allProducts.map(p => {
                if (p.title === infoProduct.title && p.color === infoProduct.color) {
                    p.quantity++;
                }
                return p;
            });
        } else {
            allProducts.push(infoProduct);
        }

        showHTML();
        saveCartToLocalStorage();
    }
});

// Eliminar del carrito
rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent.split(' - ')[0];
        const color = product.querySelector('p').textContent.split(' - ')[1];

        allProducts = allProducts.filter(
            p => !(p.title === title && p.color === color)
        );

        showHTML();
        saveCartToLocalStorage();
    }
});

// Aumentar o disminuir cantidad del producto
rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('btn-increase')) {
        const title = e.target.dataset.title;
        const color = e.target.dataset.color;
        allProducts = allProducts.map(product => {
            if (product.title === title && product.color === color) {
                product.quantity++;
            }
            return product;
        });
    } else if (e.target.classList.contains('btn-decrease')) {
        const title = e.target.dataset.title;
        const color = e.target.dataset.color;
        allProducts = allProducts.map(product => {
            if (product.title === title && product.color === color && product.quantity > 1) {
                product.quantity--;
            }
            return product;
        });
    }
    showHTML();
    saveCartToLocalStorage();
});

// Cargar carrito desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', showHTML);

// Funcionalidad para enviar el pedido a WhatsApp
const sendToWhatsApp = document.querySelector('#send-to-whatsapp');

sendToWhatsApp.addEventListener('click', () => {
    let message = 'Hola, quiero hacer un pedido:\n\n';
    allProducts.forEach(product => {
        message += `Producto: ${product.title}\nColor: ${product.color}\nCantidad: ${product.quantity}\nPrecio: ${product.price}\n\n`;
    });

    const total = valorTotal.innerText;
    message += `Total a pagar: ${total}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=51925855117&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

// Funcionalidad de búsqueda
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.container-items .item');
    items.forEach(item => {
        const title = item.querySelector('.info-product h2').textContent.toLowerCase();
        if (title.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Funcionalidad de selección de color
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
        // Obtener el contenedor de colores y el input oculto
        const colorOptions = this.parentElement;
        const selectedColorInput = colorOptions.querySelector('.selected-color');

        // Actualizar el valor del color seleccionado
        selectedColorInput.value = this.getAttribute('data-color');

        // Actualizar el estado de selección visual
        colorOptions.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');

        // Mostrar mensaje de selección (opcional)
        console.log(`Color seleccionado: ${this.getAttribute('data-color')}`);
    });
});

//carrusel
document.querySelectorAll('.carousel').forEach(carousel => {
    const prevButton = carousel.querySelector('.carousel-prev');
    const nextButton = carousel.querySelector('.carousel-next');
    const images = carousel.querySelector('.carousel-images');
    const imageCount = images.children.length;
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        images.style.transform = `translateX(${offset}%)`;
    }

    function showNextImage() {
        currentIndex = (currentIndex < imageCount - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageCount - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', showNextImage);

    // Mover automáticamente el carrusel
    setInterval(showNextImage, 3000); // Cambia la imagen cada 3 segundos
});

// Example JavaScript to add class based on page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html')) {
        document.body.classList.add('home-page');
    } else if (window.location.pathname.includes('store.html')) {
        document.body.classList.add('store-page');
    }
});