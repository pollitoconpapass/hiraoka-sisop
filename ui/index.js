// --- CONFIGURACIÓN API ---
const API_URL = 'http://localhost:3000';

// --- ESTADO DE LA APLICACIÓN ---
const state = {
    user: JSON.parse(localStorage.getItem('electro_user')) || null, 
    cart: JSON.parse(localStorage.getItem('electro_cart')) || [],
    products: [],
    categories: [], 
    orders: [], // Lista de ordenes
    currentView: 'login', 
    selectedProduct: null,
    productReviews: []
};

// Si ya hay usuario guardado, ir directo a productos
if (state.user && state.currentView === 'login') {
    state.currentView = 'products';
}

// --- SERVICIOS API (Fetch Wrapper) ---
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);

        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error en la petición');
        return data;
    } catch (error) {
        console.error('API Error:', error);
        alert(error.message);
        return null;
    }
}

// --- FUNCIONES DE NAVEGACIÓN ---
async function navigate(view, data = null) {
    state.currentView = view;
    
    if (view === 'products') {
        await fetchProducts();
    } else if (view === 'productDetail' && data) {
        state.selectedProduct = data;
        await fetchProductDetails(data._id);
    } else if (view === 'orders') {
        await fetchOrders();
    }

    render();
}

// --- LÓGICA DE DATOS ---

async function fetchProducts() {
    const result = await apiCall('/products/list?limit=50'); 
    if (result && result.products) {
        state.products = result.products;
    }
}

async function fetchProductDetails(productId) {
    const reviewResult = await apiCall(`/reviews/product/${productId}?status=published`);
    state.productReviews = reviewResult ? reviewResult.reviews : [];

    if (state.productReviews.length > 0) {
        const reviewsWithComments = await Promise.all(state.productReviews.map(async (review) => {
            const comments = await apiCall(`/comments/review/${review._id}`);
            return { ...review, replies: comments || [] };
        }));
        state.productReviews = reviewsWithComments;
    }
}

async function fetchCategories() {
    const cats = await apiCall('/categories/list');
    if (cats) state.categories = cats;
}

async function fetchOrders() {
    let endpoint = '/orders/list';
    // Si NO es admin, filtra por usuario
    if (state.user.role !== 'admin' && state.user.role !== 'Admin') {
        endpoint += `?user_id=${state.user._id}`;
    }
    const result = await apiCall(endpoint);
    if (result && result.orders) {
        state.orders = result.orders;
    }
}

// --- LÓGICA CARRITO ---
function addToCart(product) {
    const existing = state.cart.find(item => item.product._id === product._id);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ product: product, quantity: 1 });
    }
    saveCart();
    alert('Producto agregado al carrito');
    render();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.product._id !== productId);
    saveCart();
    render();
}

function updateCartQuantity(productId, newQty) {
    if (newQty < 1) return;
    const item = state.cart.find(item => item.product._id === productId);
    if (item) {
        item.quantity = Number.parseInt(newQty);
        saveCart();
        render();
    }
}

function clearCart() {
    state.cart = [];
    saveCart();
    render();
}

function saveCart() {
    localStorage.setItem('electro_cart', JSON.stringify(state.cart));
}

function getCartTotal() {
    return state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

function getCartCount() {
    return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- RENDERIZADO PRINCIPAL ---
function render() {
    const app = document.getElementById('app');
    app.innerHTML = ''; 

    if (!state.user && (state.currentView === 'login' || state.currentView === 'register')) {
        app.appendChild(createAuthPage(state.currentView));
    } else if (!state.user) {
        state.currentView = 'login';
        app.appendChild(createAuthPage('login'));
    } else {
        app.appendChild(createNavbar());
        const main = document.createElement('main');
        main.className = "flex-grow container mx-auto p-4 fade-in";
        
        switch(state.currentView) {
            case 'products':
                main.appendChild(createProductGrid());
                break;
            case 'productDetail':
                main.appendChild(createProductDetail());
                break;
            case 'cart':
                main.appendChild(createCartView());
                break;
            case 'orders':
                main.appendChild(createOrdersView());
                break;
            default:
                main.appendChild(createProductGrid());
        }
        
        app.appendChild(main);
        app.appendChild(createFooter());
    }
}

// --- COMPONENTES UI ---

function createNavbar() {
    const isAdmin = state.user.role && state.user.role.toLowerCase() === 'admin';
    const nav = document.createElement('nav');
    nav.className = "bg-white shadow-md border-b-4 border-primary px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-40";
    nav.innerHTML = `
        <div class="flex items-center gap-2 cursor-pointer" onclick="navigate('products')">
            <i class="fa-solid fa-plug text-primary text-2xl"></i>
            <h1 class="text-2xl font-bold tracking-tight">Electro<span class="text-primary">Store</span></h1>
        </div>
        <div class="flex items-center gap-6">
            <button onclick="navigate('orders')" class="text-gray-600 hover:text-primary font-medium text-sm">
                ${isAdmin ? 'Gestionar Pedidos' : 'Mis Pedidos'}
            </button>
            
            ${!isAdmin ? `
            <button onclick="navigate('cart')" class="relative text-gray-600 hover:text-primary transition">
                <i class="fa-solid fa-shopping-cart text-xl"></i>
                ${state.cart.length > 0 ? 
                `<span class="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    ${getCartCount()}
                </span>` : ''}
            </button>
            ` : ''}

            <div class="text-right hidden md:block border-l pl-4 border-gray-300">
                <p class="text-sm font-semibold">${state.user.name}</p>
                <p class="text-xs text-primary uppercase font-bold tracking-wider">${isAdmin ? 'Admin' : 'Cliente'}</p>
            </div>
            <button onclick="handleLogout()" class="text-gray-400 hover:text-black transition" title="Cerrar Sesión">
                <i class="fa-solid fa-right-from-bracket text-xl"></i>
            </button>
        </div>
    `;
    return nav;
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.className = "bg-secondary text-white py-6 text-center text-sm mt-auto";
    footer.innerHTML = `
        <p>&copy; 2025 ElectroStore. Todos los derechos reservados.</p>
    `;
    return footer;
}

function createAuthPage(type) {
    const container = document.createElement('div');
    container.className = "min-h-screen flex items-center justify-center bg-gray-100 fade-in";
    const isLogin = type === 'login';
    
    container.innerHTML = `
        <div class="bg-white p-8 md:p-12 rounded-lg shadow-lg w-full max-w-md border-t-4 border-primary">
            <div class="text-center mb-8">
                <i class="fa-solid fa-plug text-primary text-4xl mb-2"></i>
                <h2 class="text-3xl font-bold text-secondary">ElectroStore</h2>
                <p class="text-gray-500 mt-2">${isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</p>
            </div>
            
            <form onsubmit="${isLogin ? 'handleLogin(event)' : 'handleRegister(event)'}" class="space-y-4">
                ${!isLogin ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input type="text" id="auth-name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                </div>
                ` : ''}
                <div>
                    <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input type="email" id="auth-email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" id="auth-password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                </div>
                
                <button type="submit" class="w-full bg-primary text-white py-3 rounded hover:bg-red-700 transition font-semibold shadow-lg shadow-red-200">
                    ${isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
            </form>

            <div class="mt-6 text-center text-sm text-gray-600">
                ${isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <a href="#" onclick="state.currentView='${isLogin ? 'register' : 'login'}'; render()" class="text-primary font-bold hover:underline">
                    ${isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </a>
            </div>
        </div>
    `;
    return container;
}

// --- VISTA DE PRODUCTOS ---
function createProductGrid() {
    const container = document.createElement('div');
    const isAdmin = state.user.role && state.user.role.toLowerCase() === 'admin';

    const header = document.createElement('div');
    header.className = "flex justify-between items-center mb-8";
    header.innerHTML = `
        <h2 class="text-3xl font-bold text-secondary">Catálogo</h2>
        ${isAdmin ? 
        `<button onclick="openProductModal()" class="bg-secondary text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            <i class="fa-solid fa-plus mr-2"></i> Nuevo Producto
        </button>` : ''}
    `;
    container.appendChild(header);

    if (state.products.length === 0) {
        container.innerHTML += `<div class="text-center py-20 bg-white rounded shadow"><p class="text-gray-500">No hay productos disponibles.</p></div>`;
        return container;
    }

    const grid = document.createElement('div');
    grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";

    state.products.forEach(product => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer group flex flex-col";
        card.onclick = (e) => {
            if(!e.target.closest('.add-btn')) navigate('productDetail', product);
        };
        
        const imgSrc = product.primary_image || 'https://via.placeholder.com/400x300?text=No+Image';

        card.innerHTML = `
            <div class="h-48 overflow-hidden relative">
                <img src="${imgSrc}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                <div class="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                    $${Number.parseFloat(product.price).toFixed(2)}
                </div>
            </div>
            <div class="p-4 flex-grow flex flex-col">
                <h3 class="font-bold text-lg text-secondary mb-1 truncate">${product.name}</h3>
                <div class="mt-auto pt-4 flex items-center justify-between">
                    <span class="text-yellow-400 text-sm">
                        <i class="fa-solid fa-star"></i> ${product.ratings ? product.ratings.avg : 0} 
                    </span>
                    <span class="text-primary text-sm font-semibold">Ver más &rarr;</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
    return container;
}

// --- VISTA DETALLE PRODUCTO ---
function createProductDetail() {
    const product = state.selectedProduct;
    const isAdmin = state.user.role && state.user.role.toLowerCase() === 'admin';
    const container = document.createElement('div');
    
    const backBtn = document.createElement('button');
    backBtn.className = "mb-4 text-gray-500 hover:text-primary flex items-center gap-2 transition";
    backBtn.onclick = () => navigate('products');
    backBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Volver al catálogo`;
    container.appendChild(backBtn);

    const imgSrc = product.primary_image || 'https://via.placeholder.com/800x600?text=No+Image';

    const content = document.createElement('div');
    content.className = "bg-white rounded-lg shadow-lg overflow-hidden";
    content.innerHTML = `
        <div class="md:flex">
            <div class="md:w-1/2">
                <img src="${imgSrc}" alt="${product.name}" class="w-full h-96 object-cover">
            </div>
            <div class="md:w-1/2 p-8 flex flex-col justify-center relative">
                ${isAdmin ? 
                `<button onclick="openProductModal('${product._id}')" class="absolute top-4 right-4 text-gray-400 hover:text-primary p-2 border border-gray-200 rounded-full">
                    <i class="fa-solid fa-pen"></i>
                </button>` : ''}
                
                <p class="text-sm text-gray-500 uppercase tracking-wide mb-1">${product.category_id?.name || 'Electrodoméstico'}</p>
                <h2 class="text-3xl font-bold text-secondary mb-2">${product.name}</h2>
                <p class="text-sm text-gray-400 mb-4">SKU: ${product.sku || 'N/A'}</p>
                
                <div class="text-4xl text-primary font-bold mb-6">$${Number.parseFloat(product.price).toFixed(2)}</div>
                <p class="text-gray-600 mb-8 leading-relaxed">${product.description || ''}</p>
                
                <div class="flex gap-4">
                    <button onclick="handleAddToCartFromDetail('${product._id}')" class="flex-1 bg-secondary text-white py-4 rounded font-bold hover:bg-gray-800 transition shadow-lg">
                        Añadir al Carrito
                    </button>
                    ${!isAdmin ? `<button onclick="openReviewModal('${product._id}')" class="px-6 border-2 border-primary text-primary font-bold rounded hover:bg-red-50 transition">
                        Calificar
                    </button>` : ''}
                </div>
            </div>
        </div>
    `;
    container.appendChild(content);

    // Sección Reseñas (Igual que antes)
    const reviewsSection = document.createElement('div');
    reviewsSection.className = "mt-8 bg-white p-8 rounded-lg shadow-md";
    
    let reviewsHTML = `
        <div class="flex justify-between items-end mb-6 border-b pb-4">
            <h3 class="text-2xl font-bold text-secondary">Reseñas y Opiniones</h3>
            <div class="text-yellow-500 text-xl font-bold">
                <i class="fa-solid fa-star"></i> ${product.ratings?.avg || 0} 
                <span class="text-gray-400 text-sm font-normal">(${state.productReviews.length} opiniones)</span>
            </div>
        </div>
        <div class="space-y-6">
    `;

    if (state.productReviews.length === 0) {
        reviewsHTML += `<p class="text-gray-500 italic">No hay reseñas para este producto aún.</p>`;
    } else {
        state.productReviews.forEach(review => {
            const userName = review.user_id ? review.user_id.name : 'Usuario';
            reviewsHTML += `
                <div class="border-b border-gray-100 pb-6 last:border-0">
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                                ${userName.charAt(0)}
                            </div>
                            <div>
                                <span class="font-bold text-secondary block leading-none">${userName}</span>
                                <span class="text-xs text-gray-400">${review.title || ''}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end gap-1">
                            <div class="text-yellow-400 text-xs">${getStars(review.rating)}</div>
                            ${isAdmin ? `<button onclick="moderateReview('${review._id}')" class="text-red-400 hover:text-red-600 text-xs">Ocultar</button>` : ''}
                        </div>
                    </div>
                    <p class="text-gray-600 mb-3 mt-2">${review.body}</p>
                        ${review.replies && review.replies.length > 0 ? review.replies.map(reply => `
                        <div class="ml-8 mt-2 p-3 bg-gray-50 border-l-2 border-primary rounded text-sm relative">
                            <span class="font-bold text-primary block text-xs mb-1">Admin</span>
                            ${reply.body}
                        </div>
                    `).join('') : ''}
                    ${isAdmin && (!review.replies || review.replies.length === 0) ? `
                        <button onclick="openReplyModal('${product._id}', '${review._id}')" class="text-xs text-primary font-semibold hover:underline mt-2 ml-8">
                            Responder
                        </button>
                    ` : ''}
                </div>
            `;
        });
    }
    
    reviewsHTML += `</div>`;
    reviewsSection.innerHTML = reviewsHTML;
    container.appendChild(reviewsSection);

    return container;
}

// --- VISTA DEL CARRITO ---
function createCartView() {
    const container = document.createElement('div');
    container.innerHTML = `<h2 class="text-3xl font-bold text-secondary mb-6">Tu Carrito</h2>`;

    if (state.cart.length === 0) {
        container.innerHTML += `
            <div class="bg-white p-8 rounded shadow text-center">
                <i class="fa-solid fa-cart-shopping text-gray-300 text-6xl mb-4"></i>
                <p class="text-gray-500 mb-4">Tu carrito está vacío.</p>
                <button onclick="navigate('products')" class="text-primary font-bold hover:underline">Ir a comprar</button>
            </div>
        `;
        return container;
    }

    const flexContainer = document.createElement('div');
    flexContainer.className = "lg:flex gap-8";

    // Lista de items
    const itemList = document.createElement('div');
    itemList.className = "lg:w-2/3 space-y-4";
    
    state.cart.forEach(item => {
        const div = document.createElement('div');
        div.className = "bg-white p-4 rounded shadow flex items-center justify-between";
        const img = item.product.primary_image || 'https://via.placeholder.com/100';
        
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <img src="${img}" class="w-20 h-20 object-cover rounded bg-gray-100">
                <div>
                    <h3 class="font-bold text-secondary">${item.product.name}</h3>
                    <p class="text-primary font-bold">$${item.product.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <input type="number" min="1" value="${item.quantity}" 
                    onchange="updateCartQuantity('${item.product._id}', this.value)"
                    class="w-16 border rounded p-1 text-center">
                <button onclick="removeFromCart('${item.product._id}')" class="text-gray-400 hover:text-red-500">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        itemList.appendChild(div);
    });

    // Resumen de Orden
    const summary = document.createElement('div');
    summary.className = "lg:w-1/3 mt-8 lg:mt-0";
    
    const total = getCartTotal();
    
    summary.innerHTML = `
        <div class="bg-white p-6 rounded shadow sticky top-24">
            <h3 class="text-xl font-bold mb-4 border-b pb-2">Resumen</h3>
            <div class="flex justify-between mb-2">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-bold">$${total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between mb-6 text-xl text-primary font-bold">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            
            <form onsubmit="handleCheckout(event)" class="space-y-4">
                    <div>
                    <label class="block text-xs font-bold text-gray-500">Método de Pago</label>
                    <select id="checkout-payment" class="w-full border p-2 rounded">
                        <option value="tarjeta">Tarjeta de Crédito / Débito</option>
                        <option value="yape">Yape / Plin</option>
                        <option value="efectivo">Pago contra entrega</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500">Notas Adicionales</label>
                    <textarea id="checkout-notes" rows="2" class="w-full border p-2 rounded" placeholder="Instrucciones de entrega..."></textarea>
                </div>
                <button type="submit" class="w-full bg-secondary text-white py-3 rounded hover:bg-gray-800 transition font-bold">
                    Pagar Ahora
                </button>
            </form>
        </div>
    `;

    flexContainer.appendChild(itemList);
    flexContainer.appendChild(summary);
    container.appendChild(flexContainer);

    return container;
}

// --- VISTA DE PEDIDOS (ORDERS) ---
function createOrdersView() {
    const container = document.createElement('div');
    const isAdmin = state.user.role && state.user.role.toLowerCase() === 'admin';
    
    container.innerHTML = `
        <h2 class="text-3xl font-bold text-secondary mb-6">${isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}</h2>
    `;

    if (state.orders.length === 0) {
        container.innerHTML += `<p class="text-gray-500">No hay pedidos registrados.</p>`;
        return container;
    }

    const list = document.createElement('div');
    list.className = "space-y-4";

    state.orders.forEach(order => {
        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded shadow border-l-4 " + getStatusColor(order.order_status);
        
        // Formatear items
        const itemsHtml = order.items.map(i => `
            <div class="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                <span>${i.quantity}x ${i.name}</span>
                <span class="font-medium">$${i.subtotal.toFixed(2)}</span>
            </div>
        `).join('');

        // Control Admin
        let adminControls = '';
        if (isAdmin) {
            adminControls = `
                <div class="mt-4 pt-4 border-t flex gap-2 justify-end">
                    <select onchange="handleUpdateOrderStatus('${order._id}', this.value)" class="text-xs border p-1 rounded bg-gray-50">
                        <option value="En Proceso" ${order.order_status === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="Verificado" ${order.order_status === 'Verificado' ? 'selected' : ''}>Verificado</option>
                        <option value="Cancelado" ${order.order_status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="md:flex justify-between items-start mb-4">
                <div>
                    <span class="text-xs font-bold uppercase tracking-wide text-gray-400">ID: ${order._id}</span>
                    <div class="font-bold text-lg">Total: $${order.totals.grand_total.toFixed(2)}</div>
                    <div class="text-sm text-gray-500">Fecha: ${new Date(order.created_at).toLocaleDateString()}</div>
                    ${isAdmin ? `<div class="text-sm text-primary font-bold mt-1">Cliente: ${order.user_id ? order.user_id.name : 'Desconocido'}</div>` : ''}
                </div>
                <div class="mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusBg(order.order_status)}">
                    ${order.order_status}
                </div>
            </div>
            
            <div class="bg-gray-50 p-3 rounded text-gray-600 mb-2">
                <p class="text-xs font-bold mb-2">ITEMS:</p>
                ${itemsHtml}
            </div>
            
            ${order.notes ? `<p class="text-xs text-gray-500 italic mt-2">Nota: ${order.notes}</p>` : ''}
            ${adminControls}
        `;
        list.appendChild(card);
    });

    container.appendChild(list);
    return container;
}


// --- HANDLERS ---
function handleAddToCartFromDetail(productId) {
    // Buscamos el producto en el state general
    const product = state.products.find(p => p._id === productId) || state.selectedProduct;
    addToCart(product);
}

async function handleCheckout(e) {
    e.preventDefault();
    
    if (state.cart.length === 0) return;

    const paymentMethod = document.getElementById('checkout-payment').value;
    const notes = document.getElementById('checkout-notes').value;

    // Preparar payload para /orders/create
    const items = state.cart.map(item => ({
        product_id: item.product._id,
        quantity: item.quantity
    }));

    const payload = {
        user_id: state.user._id,
        items: items,
        payment: { method: paymentMethod },
        notes: notes,
        shipping: 0,
        discount: 0,
        tax: 0
    };

    const result = await apiCall('/orders/create', 'POST', payload);

    if (result) {
        alert('¡Orden creada exitosamente!');
        clearCart();
        navigate('orders');
    }
}

async function handleUpdateOrderStatus(orderId, newStatus) {
    // endpoint: orderRoute.put('/:id/status')
    const result = await apiCall(`/orders/${orderId}/status`, 'PUT', { order_status: newStatus });
    if(result) {
        await fetchOrders();
        render(); // refresh
    }
}


async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const user = await apiCall('/users/login', 'POST', { email, password_hash: password });
    if (user) {
        state.user = user;
        localStorage.setItem('electro_user', JSON.stringify(user));
        navigate('products');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('auth-name').value;
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const newUser = await apiCall('/users/create', 'POST', { name, email, password_hash: password, role: 'cliente', status: 'active' });
    if (newUser) {
        alert('Registro exitoso. Inicia sesión.');
        state.currentView = 'login';
        render();
    }
}

function handleLogout() {
    state.user = null;
    state.cart = [];
    localStorage.removeItem('electro_user');
    localStorage.removeItem('electro_cart');
    state.currentView = 'login';
    render();
}


async function handleProductSubmit(e, id) {
    e.preventDefault();
    const payload = {
        sku: document.getElementById('p-sku').value,
        name: document.getElementById('p-name').value,
        price: Number.parseFloat(document.getElementById('p-price').value),
        primary_image: document.getElementById('p-image').value,
        images: [document.getElementById('p-image').value],
        description: document.getElementById('p-desc').value,
        brand: document.getElementById('p-brand').value,
        category_id: document.getElementById('p-category').value || null
    };
    let result;
    if (id && id !== 'null' && id !== '') {
        result = await apiCall(`/products/admin/update/${id}`, 'PUT', payload);
    } else {
        result = await apiCall('/products/admin/create', 'POST', payload);
    }
    if (result) {
        closeModal();
        await fetchProducts();
        if(state.currentView === 'productDetail') state.selectedProduct = result;
        render();
    }
}

async function moderateReview(reviewId) {
    if(!confirm('¿Ocultar reseña?')) return;
    const result = await apiCall(`/reviews/${reviewId}/admin/moderate`, 'PUT', { status: 'rejected', reason: 'Admin', moderator_id: state.user._id });
    if (result) {
        await fetchProductDetails(state.selectedProduct._id);
        render();
    }
}

async function handleReplySubmit(e, productId, reviewId) {
    e.preventDefault();
    const text = document.getElementById('r-text').value;
    const result = await apiCall('/comments/create', 'POST', {
        review_id: reviewId,
        product_id: productId,
        user_id: state.user._id,
        parent_id: reviewId,
        body: text,
    });
    if (result) {
        closeModal();
        await fetchProductDetails(productId);
        render();
    }
}

async function handleNewReview(e, productId) {
    e.preventDefault();
    const payload = { product_id: productId, user_id: state.user._id, title: document.getElementById('rev-title').value, rating: Number.parseInt(document.getElementById('rev-rating').value), body: document.getElementById('rev-body').value, pros: "", cons: "" };
    const result = await apiCall('/reviews/create', 'POST', payload);
    if (result) {
        alert('Reseña enviada.');
        closeModal();
        await fetchProductDetails(productId);
        render();
    }
}

// --- MANEJO DE MODALES ---
function closeModal() { document.getElementById('modal-container').classList.add('hidden'); }
async function openProductModal(productId = null) {
    if (state.categories.length === 0) await fetchCategories();
    const isEdit = productId !== null;
    const product = isEdit ? state.products.find(p => p._id === productId) : { name: '', price: '', description: '', primary_image: '', sku: '', brand: '', category_id: '' };
    const catOptions = state.categories.map(c => `<option value="${c._id}" ${product.category_id && (product.category_id === c._id || product.category_id._id === c._id) ? 'selected' : ''}>${c.name}</option>`).join('');
    document.getElementById('modal-content').innerHTML = `
        <h3 class="text-xl font-bold mb-4 text-secondary">${isEdit ? 'Editar' : 'Nuevo'} Producto</h3>
        <form onsubmit="handleProductSubmit(event, '${isEdit ? productId : ''}')" class="space-y-3">
            <div class="grid grid-cols-2 gap-2"><div><label class="block text-xs font-bold text-gray-500">SKU</label><input type="text" id="p-sku" value="${product.sku||''}" class="w-full border p-2 rounded"></div><div><label class="block text-xs font-bold text-gray-500">Marca</label><input type="text" id="p-brand" value="${product.brand||''}" class="w-full border p-2 rounded"></div></div>
            <div><label class="block text-xs font-bold text-gray-500">Nombre</label><input type="text" id="p-name" value="${product.name}" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-xs font-bold text-gray-500">Categoría</label><select id="p-category" class="w-full border p-2 rounded"><option value="">Sel. Categoría</option>${catOptions}</select></div>
            <div><label class="block text-xs font-bold text-gray-500">Precio</label><input type="number" step="0.01" id="p-price" value="${product.price}" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-xs font-bold text-gray-500">Imagen URL</label><input type="url" id="p-image" value="${product.primary_image||''}" required class="w-full border p-2 rounded"></div>
            <div><label class="block text-xs font-bold text-gray-500">Descripción</label><textarea id="p-desc" rows="3" required class="w-full border p-2 rounded">${product.description}</textarea></div>
            <button type="submit" class="w-full bg-primary text-white py-2 rounded font-bold">Guardar</button>
        </form>`;
    document.getElementById('modal-container').classList.remove('hidden');
}
function openReplyModal(productId, reviewId) {
    document.getElementById('modal-content').innerHTML = `<h3 class="text-xl font-bold mb-4">Responder</h3><form onsubmit="handleReplySubmit(event, '${productId}', '${reviewId}')"><textarea id="r-text" rows="3" class="w-full border p-2 mb-4" required></textarea><button type="submit" class="w-full bg-primary text-white py-2 rounded">Enviar</button></form>`;
    document.getElementById('modal-container').classList.remove('hidden');
}
function openReviewModal(productId) {
    document.getElementById('modal-content').innerHTML = `<h3 class="text-xl font-bold mb-4">Reseña</h3><form onsubmit="handleNewReview(event, '${productId}')" class="space-y-3"><input id="rev-title" placeholder="Título" class="w-full border p-2" required><select id="rev-rating" class="w-full border p-2"><option value="5">5 ★</option><option value="4">4 ★</option><option value="3">3 ★</option><option value="2">2 ★</option><option value="1">1 ★</option></select><textarea id="rev-body" placeholder="Opinión" rows="3" class="w-full border p-2" required></textarea><button type="submit" class="w-full bg-primary text-white py-2 rounded">Enviar</button></form>`;
    document.getElementById('modal-container').classList.remove('hidden');
}

// --- UTILIDADES ---
function getStars(r){let s='';for(let i=1;i<=5;i++)s+=i<=r?'<i class="fa-solid fa-star"></i>':'<i class="fa-regular fa-star"></i>';return s;}
function getStatusColor(s){
    if(s==='Pendiente') return 'border-yellow-400';
    if(s==='Verificado' || s==='Enviado') return 'border-blue-500';
    if(s==='Entregado') return 'border-green-500';
    return 'border-red-500';
}
function getStatusBg(s){
    if(s==='Pendiente') return 'bg-yellow-400';
    if(s==='Verificado' || s==='Enviado') return 'bg-blue-500';
    if(s==='Entregado') return 'bg-green-500';
    return 'bg-red-500';
}

// Iniciar
if (state.user) {
    fetchProducts().then(() => render());
} else {
    render();
}