// Sports Store Landing Page JavaScript
class SportStore {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.products = [
            {
                id: 1,
                name: "Professional Running Shoes",
                price: 149.99,
                description: "High-performance running shoes with advanced cushioning technology.",
                icon: "fas fa-running"
            },
            {
                id: 2,
                name: "Premium Gym Equipment Set",
                price: 299.99,
                description: "Complete home gym setup with dumbbells, resistance bands, and more.",
                icon: "fas fa-dumbbell"
            },
            {
                id: 3,
                name: "Professional Soccer Ball",
                price: 49.99,
                description: "FIFA-approved soccer ball used by professional players worldwide.",
                icon: "fas fa-futbol"
            },
            {
                id: 4,
                name: "Basketball Shoes",
                price: 179.99,
                description: "High-top basketball shoes with superior ankle support and grip.",
                icon: "fas fa-basketball-ball"
            },
            {
                id: 5,
                name: "Tennis Racket Pro",
                price: 199.99,
                description: "Professional-grade tennis racket with carbon fiber construction.",
                icon: "fas fa-table-tennis"
            },
            {
                id: 6,
                name: "Yoga Mat & Accessories",
                price: 79.99,
                description: "Premium yoga mat with carrying strap and meditation accessories.",
                icon: "fas fa-spa"
            }
        ];
        this.init();
    }

    init() {
        this.renderProducts();
        this.updateCartDisplay();
        this.setupEventListeners();
        this.setupNavigation();
        this.animateOnScroll();
    }

    // Product Rendering
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            productCard.classList.add('loading');
            productsGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" data-product-id="${product.id}">
                Add to Cart
            </button>
        `;

        // Add hover animations
        card.addEventListener('mouseenter', () => {
            this.animateProductCard(card, 'hover');
        });

        card.addEventListener('mouseleave', () => {
            this.animateProductCard(card, 'unhover');
        });

        return card;
    }

    animateProductCard(card, action) {
        const image = card.querySelector('.product-image');
        if (action === 'hover') {
            image.style.transform = 'scale(1.1) rotate(5deg)';
        } else {
            image.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    // Cart Functionality
    addToCart(productId) {
        const product = this.products.find(p => p.id === parseInt(productId));
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.animateAddToCart(productId);
        this.showCartNotification();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== parseInt(productId));
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.renderCartItems();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }

        this.updateCartTotal();
    }

    updateCartTotal() {
        const cartTotal = document.getElementById('cartTotal');
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = '';
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="remove-item" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    // Cart Animations
    animateAddToCart(productId) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`).closest('.product-card');
        const cartBtn = document.getElementById('cartBtn');
        
        // Animate product card
        productCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            productCard.style.transform = 'scale(1)';
        }, 150);

        // Animate cart button
        cartBtn.classList.add('cart-animation');
        setTimeout(() => {
            cartBtn.classList.remove('cart-animation');
        }, 300);

        // Create flying animation
        this.createFlyingAnimation(productCard, cartBtn);
    }

    createFlyingAnimation(fromElement, toElement) {
        const flyingIcon = document.createElement('div');
        flyingIcon.innerHTML = '<i class="fas fa-plus"></i>';
        flyingIcon.style.cssText = `
            position: fixed;
            z-index: 9999;
            font-size: 1.5rem;
            color: #e74c3c;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        flyingIcon.style.left = fromRect.left + fromRect.width / 2 + 'px';
        flyingIcon.style.top = fromRect.top + fromRect.height / 2 + 'px';

        document.body.appendChild(flyingIcon);

        requestAnimationFrame(() => {
            flyingIcon.style.left = toRect.left + toRect.width / 2 + 'px';
            flyingIcon.style.top = toRect.top + toRect.height / 2 + 'px';
            flyingIcon.style.opacity = '0';
            flyingIcon.style.transform = 'scale(0.3)';
        });

        setTimeout(() => {
            document.body.removeChild(flyingIcon);
        }, 800);
    }

    showCartNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = 'Item added to cart!';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Storage Functions
    saveCartToStorage() {
        localStorage.setItem('sportstore-cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('sportstore-cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Event Listeners
    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            }

            // Remove from cart buttons
            if (e.target.closest('.remove-item')) {
                const productId = e.target.closest('.remove-item').getAttribute('data-product-id');
                this.removeFromCart(productId);
            }
        });

        // Cart sidebar toggle
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');

        cartBtn.addEventListener('click', () => {
            this.openCart();
        });

        closeCart.addEventListener('click', () => {
            this.closeCart();
        });

        cartOverlay.addEventListener('click', () => {
            this.closeCart();
        });

        // CTA button scroll to products
        const ctaButton = document.querySelector('.cta-button');
        ctaButton.addEventListener('click', () => {
            document.getElementById('products').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.renderCartItems();
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigation
    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scroll for navigation links
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

    // Scroll Animations
    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animation
        document.querySelectorAll('.feature-card, .product-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Header scroll effect
    setupHeaderScroll() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const store = new SportStore();
    
    // Setup header scroll effect
    store.setupHeaderScroll();
    
    // Add loading animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add some utility functions for enhanced UX
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced scroll to top functionality
window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.header');
    
    if (scrollTop > 300) {
        if (!document.querySelector('.scroll-to-top')) {
            const scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            `;
            
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            scrollBtn.addEventListener('mouseenter', () => {
                scrollBtn.style.transform = 'scale(1.1)';
                scrollBtn.style.background = '#c0392b';
            });
            
            scrollBtn.addEventListener('mouseleave', () => {
                scrollBtn.style.transform = 'scale(1)';
                scrollBtn.style.background = '#e74c3c';
            });
            
            document.body.appendChild(scrollBtn);
        }
    } else {
        const scrollBtn = document.querySelector('.scroll-to-top');
        if (scrollBtn) {
            scrollBtn.remove();
        }
    }
}, 100));