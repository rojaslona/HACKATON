class SportStore {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.products = [
            {
                id: 1,
                name: "Zapatillas de Running Profesionales",
                price: 149.99,
                description: "Zapatillas de alto rendimiento con tecnología avanzada de amortiguación.",
                icon: "fas fa-running",
                stock: 15,
                rating: 4.8
            },
            {
                id: 2,
                name: "Set de Equipamiento de Gimnasio Premium",
                price: 299.99,
                description: "Gimnasio completo en casa con mancuernas, bandas de resistencia y más.",
                icon: "fas fa-dumbbell",
                stock: 8,
                rating: 4.9
            },
            {
                id: 3,
                name: "Balón de Fútbol Profesional",
                price: 49.99,
                description: "Balón de fútbol aprobado por la FIFA, usado por jugadores profesionales en todo el mundo.",
                icon: "fas fa-futbol",
                stock: 25,
                rating: 4.7
            },
            {
                id: 4,
                name: "Zapatillas de Baloncesto",
                price: 179.99,
                description: "Zapatillas de baloncesto de caña alta con excelente soporte y agarre.",
                icon: "fas fa-basketball-ball",
                stock: 12,
                rating: 4.6
            },
            {
                id: 5,
                name: "Raqueta de Tenis Pro",
                price: 199.99,
                description: "Raqueta de tenis profesional con construcción de fibra de carbono.",
                icon: "fas fa-table-tennis",
                stock: 6,
                rating: 4.8
            },
            {
                id: 6,
                name: "Esterilla de Yoga y Accesorios",
                price: 79.99,
                description: "Esterilla de yoga premium con correa y accesorios para meditación.",
                icon: "fas fa-spa",
                stock: 20,
                rating: 4.5
            }
        ];
        
        this.init();
    }

    init() {
        console.log('Inicializando SportZone...');
        
        // Render products immediately (no loading state)
        this.renderProducts();
        this.updateCartDisplay();
        this.setupEventListeners();
        this.setupNavigation();
        
        console.log('SportZone inicializado correctamente');
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        
        if (!productsGrid) {
            console.error('Elemento productsGrid no encontrado');
            return;
        }

        console.log('Renderizando productos...');
        
        // Clear any loading states
        productsGrid.innerHTML = '';
        
        // Render products directly
        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            productsGrid.appendChild(productCard);
        });
        
        console.log('Productos renderizados:', this.products.length);
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div class="product-image">
                <i class="${product.icon}"></i>
                ${product.stock < 10 ? '<span class="low-stock-badge">¡Pocas unidades!</span>' : ''}
            </div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${this.generateStarRating(product.rating)}
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock">${this.getStockText(product.stock)}</div>
                </div>
                <button 
                    class="add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}" 
                    data-product-id="${product.id}"
                    ${product.stock === 0 ? 'disabled' : ''}
                >
                    <span class="btn-text">
                        ${product.stock === 0 ? 'Agotado' : 'Añadir al carrito'}
                    </span>
                    <i class="fas fa-shopping-cart btn-icon"></i>
                </button>
            </div>
        `;

        return card;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHTML = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        
        return `<div class="stars">${starsHTML}</div>`;
    }

    getStockText(stock) {
        if (stock === 0) return '<span class="out-of-stock">Sin stock</span>';
        if (stock < 5) return `<span class="low-stock">Solo ${stock} disponibles</span>`;
        return `<span class="in-stock">${stock} disponibles</span>`;
    }

    addToCart(productId) {
        console.log('Añadiendo al carrito:', productId);
        
        const product = this.products.find(p => p.id === parseInt(productId));
        if (!product) {
            console.error('Producto no encontrado:', productId);
            return;
        }

        if (product.stock === 0) {
            this.showNotification('Este producto está agotado', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                this.showNotification('No hay suficiente stock disponible', 'error');
                return;
            }
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showNotification('Producto añadido al carrito', 'success');
    }

    removeFromCart(productId) {
        console.log('Eliminando del carrito:', productId);
        
        this.cart = this.cart.filter(item => item.id !== parseInt(productId));
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.renderCartItems();
        this.showNotification('Producto eliminado del carrito', 'success');
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toFixed(2);
        }
    }

    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-animation">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Tu carrito está vacío</h3>
                    <p>¡Descubre nuestros increíbles productos deportivos!</p>
                    <button class="continue-shopping-btn" onclick="document.getElementById('products').scrollIntoView({behavior: 'smooth'})">
                        Seguir comprando
                    </button>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = '';
        this.cart.forEach((item, index) => {
            const cartItem = this.createCartItem(item);
            cartItems.appendChild(cartItem);
        });
    }

    createCartItem(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <i class="${item.icon}"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-product-id="${item.id}" data-action="decrease">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn plus" data-product-id="${item.id}" data-action="increase">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    Subtotal: $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
            <button class="remove-item" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        return cartItem;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('sportzone-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const saved = localStorage.getItem('sportzone-cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    setupEventListeners() {
        // Event delegation for clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
                const button = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
                const productId = button.getAttribute('data-product-id');
                if (productId && !button.disabled) {
                    this.addToCart(productId);
                }
            }

            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const productId = button.getAttribute('data-product-id');
                if (productId) {
                    this.removeFromCart(productId);
                }
            }

            if (e.target.classList.contains('qty-btn') || e.target.closest('.qty-btn')) {
                const button = e.target.classList.contains('qty-btn') ? e.target : e.target.closest('.qty-btn');
                const productId = button.getAttribute('data-product-id');
                const action = button.getAttribute('data-action');
                if (productId && action) {
                    this.updateCartQuantity(productId, action);
                }
            }
        });

        // Cart sidebar
        const cartBtn = document.getElementById('cartBtn');
        const closeCart = document.getElementById('closeCart');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.openCart());
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                document.getElementById('products').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    updateCartQuantity(productId, action) {
        const item = this.cart.find(item => item.id === parseInt(productId));
        if (!item) return;

        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                this.removeFromCart(productId);
                return;
            }
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.renderCartItems();
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderCartItems();
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Inicializando SportZone...');
        window.store = new SportStore();
        console.log('SportZone inicializado exitosamente!');
    } catch (error) {
        console.error('Error inicializando SportZone:', error);
    }
});
