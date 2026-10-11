// Config Menu matches smart_canteen.c
const FOOD_MENU = [
    { id: 1, name: "Burger", price: 80.00, emoji: "🍔", desc: "Juicy grilled patty with fresh lettuce and house sauce." },
    { id: 2, name: "Pizza", price: 120.00, emoji: "🍕", desc: "Classic cheesy marinara pie baked to crisp perfection." },
    { id: 3, name: "Tea", price: 10.00, emoji: "🍵", desc: "Aromatic spiced hot milk tea to refresh your senses." },
    { id: 4, name: "Coffee", price: 15.00, emoji: "☕", desc: "Aromatic roasted hot robusta brew to fuel your day." },
    { id: 5, name: "Idli", price: 20.00, emoji: "🫓", desc: "Soft, fluffy steamed rice cakes served with sambar and chutney." },
    { id: 6, name: "Masala Dosa", price: 45.00, emoji: "🥞", desc: "Crispy golden rice crepe filled with spiced potato masala." },
    { id: 7, name: "Plain Dosa", price: 30.00, emoji: "🥞", desc: "Simple, crispy, and thin golden rice crepe served hot." },
    { id: 8, name: "Set Dosa", price: 40.00, emoji: "🥞", desc: "Soft, spongy thick rice crepes served in a set of three." },
    { id: 9, name: "Mini meals", price: 20.00, emoji: "🍱", desc: "Traditional platter with rice, papad, pickle, sambar, rasam, and buttermilk." },
    { id: 10, name: "Full meals", price: 30.00, emoji: "🍛", desc: "Hearty traditional meal featuring rice, chapathi, papad, pickle, sides, and buttermilk." },
    { id: 11, name: "Chapathi", price: 20.00, emoji: "🫓", desc: "Fresh, warm stoneground whole wheat flatbreads served with curry." },
    { id: 12, name: "Paratha", price: 30.00, emoji: "🫓", desc: "Flaky, layered golden-brown flatbread served with sides." },
    { id: 13, name: "Curd Rice", price: 20.00, emoji: "🍚", desc: "Cool, creamy rice seasoned with mustard seeds, curry leaves, and yogurt." },
    { id: 14, name: "Gobi Manchurian", price: 30.00, emoji: "🥦", desc: "Crispy batter-fried cauliflower florets tossed in a sweet and spicy sauce." },
    { id: 15, name: "Panipuri", price: 30.00, emoji: "🧆", desc: "Crisp puri shells filled with spiced potatoes, chickpeas, and flavored waters." },
    { id: 16, name: "Masala Puri", price: 30.00, emoji: "🍲", desc: "Crushed crispy puris drenched in a warm, spicy peas gravy, garnished with sev." },
    { id: 17, name: "Dahi puri", price: 35.00, emoji: "🧆", desc: "Crisp puris loaded with potato, sweet and tangy chutneys, yogurt, and fine sev." },
    { id: 18, name: "French Fries", price: 60.00, emoji: "🍟", desc: "Golden, crispy potato fries lightly salted and served with ketchup." },
    { id: 19, name: "Churmuri", price: 40.00, emoji: "🍿", desc: "Spicy, tangy puffed rice mixture tossed with onions, carrots, and peanuts." },
    { id: 20, name: "Masala Papad", price: 40.00, emoji: "🫓", desc: "Crispy roasted papad topped with a spiced onion, tomato, and cilantro salad." },
    { id: 21, name: "Veg Biryani", price: 40.00, emoji: "🍲", desc: "Fragrant long-grain basmati rice cooked with garden-fresh veggies and spices." },
    { id: 22, name: "Sandwich", price: 40.00, emoji: "🥪", desc: "Toasted double-decker sourdough filled with fresh garden greens." },
    { id: 23, name: "Medu Vada", price: 10.00, emoji: "🍩", desc: "Crispy, savory fried lentil donuts served with chutney and warm sambar." },
    { id: 24, name: "Samosa", price: 15.00, emoji: "🔺", desc: "Crispy golden triangle pastry pockets stuffed with spiced peas and potatoes." },
    { id: 25, name: "Kachori", price: 20.00, emoji: "🥮", desc: "Flaky, deep-fried pastry shell stuffed with spiced lentils and spices." }
];

// ==========================================
// CANTEEN KITCHEN SYSTEM STATE
// ==========================================
let state = {
    orders: [], // Array representing orders[100] in C
    front: 0,
    rear: -1,
    tokenNumber: 100,
    dailySales: 0.00,
    totalOrdersPlaced: 0,
    salesLogStream: [] // Mimics rows logged in sales.txt
};

// Temp customer cart
let cart = {};

// Theme Preference
let isLightMode = false;

// Active UI Section View
let activeView = 'customer';

// Initialize audio context lazily on user interaction
let audioCtx = null;

// ==========================================
// CORE APP BOOTSTRAP
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    renderFoodMenu();
    updateUI();
    
    // Start Clock Tick
    setInterval(updateClock, 1000);
    updateClock();

    // Attach keyboard event to modal if open
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeReceiptModal();
    });
});

// Update the header system clock
function updateClock() {
    const timeElem = document.getElementById('system-time');
    if (timeElem) {
        const now = new Date();
        timeElem.textContent = now.toTimeString().split(' ')[0];
    }
}

// ==========================================
// STORAGE PERSISTENCE MECHANICS
// ==========================================
function saveStateToStorage() {
    localStorage.setItem('smart_canteen_state', JSON.stringify(state));
    localStorage.setItem('smart_canteen_lightmode', JSON.stringify(isLightMode));
}

function loadStateFromStorage() {
    const savedState = localStorage.getItem('smart_canteen_state');
    if (savedState) {
        try {
            state = JSON.parse(savedState);
            // Ensure numbers are properly casted
            state.front = parseInt(state.front) || 0;
            state.rear = parseInt(state.rear) || 0;
            state.tokenNumber = parseInt(state.tokenNumber) || 100;
            state.dailySales = parseFloat(state.dailySales) || 0.00;
            state.totalOrdersPlaced = parseInt(state.totalOrdersPlaced) || 0;
            if (!Array.isArray(state.orders)) state.orders = [];
            if (!Array.isArray(state.salesLogStream)) state.salesLogStream = [];
        } catch (e) {
            console.error("Error parsing storage state:", e);
        }
    }

    const savedTheme = localStorage.getItem('smart_canteen_lightmode');
    if (savedTheme) {
        isLightMode = JSON.parse(savedTheme);
        if (isLightMode) {
            document.body.classList.add('light-mode');
            document.getElementById('theme-icon-light').style.display = 'block';
            document.getElementById('theme-icon-dark').style.display = 'none';
        }
    }
}

// ==========================================
// SOUND EFFECT GENERATOR (WEB AUDIO API)
// ==========================================
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playAudioChime(type) {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(330, now); // E4
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'place') {
            // High pitched success ding (C6 then G6)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.50, now); // C6
            osc.frequency.setValueAtTime(1567.98, now + 0.08, now + 0.25); // G6
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'serve') {
            // Rich kitchen service bell chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now); // A5
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        }
    } catch (e) {
        console.warn("Web Audio failed or was blocked:", e);
    }
}

// ==========================================
// CUSTOMER VIEW RENDERERS
// ==========================================
function renderFoodMenu() {
    const grid = document.getElementById('food-menu-grid');
    if (!grid) return;
    grid.innerHTML = '';

    FOOD_MENU.forEach(item => {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <div class="food-image-container">
                <span class="food-emoji">${item.emoji}</span>
                <span class="food-price-badge">Rs ${item.price.toFixed(2)}</span>
            </div>
            <div class="food-details">
                <h3 class="food-name">${item.name}</h3>
                <p class="food-description">${item.desc}</p>
                <div class="food-controls">
                    <div class="qty-selector">
                        <button class="qty-btn" onclick="updateCardQty(${item.id}, -1)" id="qty-dec-${item.id}" disabled>-</button>
                        <span class="qty-value" id="qty-val-${item.id}">0</span>
                        <button class="qty-btn" onclick="updateCardQty(${item.id}, 1)">+</button>
                    </div>
                    <button class="add-cart-btn" onclick="addSelectedToCart(${item.id})">Add</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updateCardQty(itemId, delta) {
    playAudioChime('click');
    const valElem = document.getElementById(`qty-val-${itemId}`);
    const decBtn = document.getElementById(`qty-dec-${itemId}`);
    
    let currentQty = parseInt(valElem.textContent) || 0;
    currentQty = Math.max(0, currentQty + delta);
    
    valElem.textContent = currentQty;
    decBtn.disabled = (currentQty <= 0);
}

function addSelectedToCart(itemId) {
    const valElem = document.getElementById(`qty-val-${itemId}`);
    const qty = parseInt(valElem.textContent) || 0;
    
    if (qty <= 0) return;
    
    const menuItem = FOOD_MENU.find(i => i.id === itemId);
    if (!menuItem) return;

    if (cart[itemId]) {
        cart[itemId].quantity += qty;
    } else {
        cart[itemId] = {
            id: itemId,
            name: menuItem.name,
            price: menuItem.price,
            quantity: qty,
            emoji: menuItem.emoji
        };
    }

    // Reset card UI counters
    valElem.textContent = "0";
    document.getElementById(`qty-dec-${itemId}`).disabled = true;

    playAudioChime('place');
    updateCartUI();
}

function removeCartItem(itemId) {
    playAudioChime('click');
    delete cart[itemId];
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const cartCount = document.getElementById('cart-item-count');
    const emptyState = document.getElementById('cart-empty-state');
    const checkoutBtn = document.getElementById('place-order-btn');
    
    const baseTotalElem = document.getElementById('cart-base-total');
    const finalTotalElem = document.getElementById('cart-final-total');

    const cartKeys = Object.keys(cart);
    let itemsCount = 0;
    let baseTotal = 0;

    // Clear previous items (except empty state helper)
    const activeItems = container.querySelectorAll('.cart-item');
    activeItems.forEach(item => item.remove());

    if (cartKeys.length === 0) {
        emptyState.style.display = 'flex';
        checkoutBtn.disabled = true;
    } else {
        emptyState.style.display = 'none';
        checkoutBtn.disabled = false;

        cartKeys.forEach(key => {
            const item = cart[key];
            const itemTotal = item.price * item.quantity;
            baseTotal += itemTotal;
            itemsCount += item.quantity;

            const row = document.createElement('div');
            row.className = 'cart-item';
            row.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.emoji} ${item.name}</span>
                    <span class="cart-item-meta">Rs ${item.price.toFixed(2)} &times; ${item.quantity}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span class="cart-item-price">Rs ${itemTotal.toFixed(2)}</span>
                    <button class="cart-item-remove" onclick="removeCartItem(${item.id})">&times;</button>
                </div>
            `;
            container.appendChild(row);
        });
    }

    cartCount.textContent = `${itemsCount} Item${itemsCount === 1 ? '' : 's'}`;
    baseTotalElem.textContent = `Rs ${baseTotal.toFixed(2)}`;
    finalTotalElem.textContent = `Rs ${baseTotal.toFixed(2)}`;
}

// ==========================================
// CANTEEN TRANSACTION & FIFO QUEUE ENGINE
// ==========================================
function checkoutOrder() {
    const cartKeys = Object.keys(cart);
    if (cartKeys.length === 0) return;

    // Prevent Queue Overflow Crash (mimicking `if (rear >= 99)` block in C)
    const pendingCount = (state.front > state.rear) ? 0 : (state.rear - state.front + 1);
    if (pendingCount + cartKeys.length > 99) {
        alert("Canteen Queue is Full! Cannot accept more orders right now.");
        return;
    }

    playAudioChime('place');

    const timestamp = new Date();
    const dateStr = timestamp.toISOString().split('T')[0];
    const timeStr = timestamp.toTimeString().split(' ')[0].substring(0, 5);

    // Track receipts for rendering
    let receiptDetails = [];
    let receiptTotal = 0;
    
    // We assign consecutive token numbers to each menu choice block placed, exactly like sequential C calls
    let startingToken = state.tokenNumber;

    cartKeys.forEach(key => {
        const cartItem = cart[key];
        state.rear++;
        
        // Populate struct Order elements
        const currentToken = state.tokenNumber++;
        const currentTotal = cartItem.price * cartItem.quantity;
        
        const newOrder = {
            token: currentToken,
            item: cartItem.name,
            quantity: cartItem.quantity,
            price: cartItem.price,
            total: currentTotal,
            timestamp: timeStr
        };

        state.orders.push(newOrder); // Add to back of array
        state.dailySales += currentTotal;
        state.totalOrdersPlaced++;

        // Add to simulated sales.txt log
        const logEntry = `Token:${currentToken} Item:${cartItem.name} Qty:${cartItem.quantity} Total:${currentTotal.toFixed(2)}`;
        state.salesLogStream.push({
            entry: logEntry,
            total: currentTotal,
            time: timeStr
        });

        receiptDetails.push({
            name: cartItem.name,
            qty: cartItem.quantity,
            price: cartItem.price,
            total: currentTotal
        });
        receiptTotal += currentTotal;
    });

    // Clear checkout cart
    cart = {};
    updateCartUI();

    // Show Receipt overlay
    openReceiptModal(startingToken, receiptDetails, receiptTotal, dateStr, timeStr);
    
    // Refresh backend systems
    saveStateToStorage();
    updateUI();
}

function openReceiptModal(startToken, items, total, date, time) {
    document.getElementById('receipt-token-val').textContent = startToken;
    document.getElementById('receipt-date').textContent = date;
    document.getElementById('receipt-time').textContent = time;
    document.getElementById('receipt-total-val').textContent = `Rs ${total.toFixed(2)}`;

    const container = document.getElementById('receipt-items-list');
    container.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'receipt-row';
        row.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>Rs ${item.total.toFixed(2)}</span>
        `;
        container.appendChild(row);
    });

    document.getElementById('receipt-modal').classList.add('show');
}

function closeReceiptModal() {
    playAudioChime('click');
    document.getElementById('receipt-modal').classList.remove('show');
}

// ==========================================
// STAFF TERMINAL SERVICES (QUEUE & SERVING)
// ==========================================
function dispatchServe() {
    // Mimics the C queue serve check `if(front > rear)`
    if (state.front > state.rear) {
        alert("No Orders to Serve!");
        return;
    }

    playAudioChime('serve');
    
    const servedOrder = state.orders[state.front];
    alert(`Serving Token Number ${servedOrder.token} (${servedOrder.item} x${servedOrder.quantity})!`);
    
    state.front++; // Increment front pointer
    
    saveStateToStorage();
    updateUI();
}

// ==========================================
// UI CONSOLE UPDATE UTILITIES
// ==========================================
function updateUI() {
    // 1. Refresh active order lists in Staff Queue View
    const queueList = document.getElementById('queue-items-container');
    const serveActiveToken = document.getElementById('serve-active-token');
    const serveActiveDetails = document.getElementById('serve-active-details');
    const serveBtn = document.getElementById('serve-order-btn');

    if (queueList) {
        queueList.innerHTML = '';
        
        const currentQueueSize = (state.front > state.rear) ? 0 : (state.rear - state.front + 1);

        if (currentQueueSize === 0) {
            queueList.innerHTML = `
                <div class="cart-empty">
                    <span style="font-size: 3.5rem;">🎉</span>
                    <p style="margin-top: 1rem;">Kitchen is clear! All tokens have been served.</p>
                </div>
            `;
            serveActiveToken.textContent = "Token: --";
            serveActiveDetails.textContent = "No pending items in queue";
            serveBtn.disabled = true;
        } else {
            serveBtn.disabled = false;
            
            // The active front order is state.orders[state.front]
            const topOrder = state.orders[state.front];
            serveActiveToken.textContent = `Token: ${topOrder.token}`;
            serveActiveDetails.textContent = `Next: ${topOrder.item} (Quantity: ${topOrder.quantity})`;

            // Render all items from front to rear
            for (let i = state.front; i <= state.rear; i++) {
                const order = state.orders[i];
                if (!order) continue;

                const card = document.createElement('div');
                card.className = `queue-item ${i === state.front ? 'first-in-line' : ''}`;
                card.innerHTML = `
                    <div class="queue-info">
                        <div class="queue-token-circle">${order.token}</div>
                        <div class="queue-details">
                            <span class="queue-item-name">${order.item}</span>
                            <span class="queue-item-qty">Quantity: ${order.quantity}</span>
                        </div>
                    </div>
                    <div class="queue-time">Ordered at ${order.timestamp}</div>
                `;
                queueList.appendChild(card);
            }
        }

        // Update stats
        document.getElementById('stat-total-sales').textContent = `Rs ${state.dailySales.toFixed(2)}`;
        document.getElementById('stat-orders-count').textContent = state.totalOrdersPlaced;
        document.getElementById('stat-queue-size').textContent = currentQueueSize;
    }

    // 2. Render sales logs stream (simulated sales.txt output)
    const logsContainer = document.getElementById('report-logs-container');
    if (logsContainer) {
        logsContainer.innerHTML = '';
        if (state.salesLogStream.length === 0) {
            logsContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">Log is currently empty (No sales recorded)</div>`;
        } else {
            // Render logs starting from latest
            [...state.salesLogStream].reverse().forEach(log => {
                const line = document.createElement('div');
                line.className = 'log-entry';
                line.innerHTML = `
                    <span class="log-entry-text">&gt; ${log.entry}</span>
                    <span class="log-entry-time">[${log.time}]</span>
                `;
                logsContainer.appendChild(line);
            });
        }
    }
}

// Switch between Customer Portal and Kitchen Staff dashboard
function switchView(viewName) {
    playAudioChime('click');
    activeView = viewName;

    // Toggle active classes on tab buttons
    document.getElementById('btn-customer-view').classList.toggle('active', viewName === 'customer');
    document.getElementById('btn-staff-view').classList.toggle('active', viewName === 'staff');

    // Toggle viewport sections
    document.getElementById('customer-view').classList.toggle('active', viewName === 'customer');
    document.getElementById('staff-view').classList.toggle('active', viewName === 'staff');

    updateUI();
}

// Light & Dark theme triggers
function toggleTheme() {
    isLightMode = !isLightMode;
    document.body.classList.toggle('light-mode', isLightMode);

    document.getElementById('theme-icon-light').style.display = isLightMode ? 'block' : 'none';
    document.getElementById('theme-icon-dark').style.display = isLightMode ? 'none' : 'block';

    playAudioChime('click');
    saveStateToStorage();
}

// ==========================================
// FILE EXPORT: DOWNLOAD sales.txt LOGS
// ==========================================
function exportSalesLog() {
    playAudioChime('click');
    if (state.salesLogStream.length === 0) {
        alert("No sales log data available to export yet.");
        return;
    }

    // Construct exactly matching text structure
    let fileContent = "";
    state.salesLogStream.forEach(log => {
        fileContent += log.entry + "\n";
    });

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "sales.txt";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
