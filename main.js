// Cart data
let cart = [];

// Filter tabs
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.menu-card');

tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		tabs.forEach(t => t.classList.remove('active'));
		tab.classList.add('active');

		const category = tab.dataset.category;

		cards.forEach(card => {
			if (category === 'all' || card.dataset.category === category) {
				card.style.display = 'block';
				card.style.animation = 'fadeIn 0.4s ease';
			} else {
				card.style.display = 'none';
			}
		});
	});
});

// Add to cart
function addToCart(name, price) {
	const existing = cart.find(item => item.name === name);

	if (existing) {
		existing.qty++;
	} else {
		cart.push({ name, price, qty: 1 });
	}

	updateCartCount();
	showAddEffect();
}

// Update cart count
function updateCartCount() {
	const total = cart.reduce((sum, item) => sum + item.qty, 0);
	document.getElementById('cartCount').textContent = total;
}

// Show add effect
function showAddEffect() {
	const btn = document.getElementById('cartBtn');
	btn.style.transform = 'scale(1.3)';
	setTimeout(() => {
		btn.style.transform = 'scale(1)';
	}, 200);
}

// Toggle cart
function toggleCart() {
	const modal = document.getElementById('cartModal');
	const overlay = document.getElementById('cartOverlay');

	modal.classList.toggle('active');
	overlay.classList.toggle('active');

	if (modal.classList.contains('active')) {
		renderCart();
	}
}

// Render cart
function renderCart() {
	const cartItems = document.getElementById('cartItems');
	const cartTotal = document.getElementById('cartTotal');

	if (cart.length === 0) {
		cartItems.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.4); padding: 30px 0;">Savat bo\'sh</p>';
		cartTotal.textContent = "0 so'm";
		return;
	}

	cartItems.innerHTML = cart
		.map(
			(item, index) => `
        <div class="cart-item">
            <span class="cart-item-name">${item.name}</span>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                <span class="item-price">${(item.price * item.qty).toLocaleString()} so'm</span>
            </div>
        </div>
    `,
		)
		.join('');

	const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
	cartTotal.textContent = total.toLocaleString() + " so'm";
}

// Change quantity
function changeQty(index, change) {
	cart[index].qty += change;

	if (cart[index].qty <= 0) {
		cart.splice(index, 1);
	}

	updateCartCount();
	renderCart();
}
function placeOrder() {
	if (cart.length === 0) return;

	orderCount++;
	const now = new Date();
	const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
	const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

	orderHistory.unshift({
		num: orderCount,
		table: selectedTable || '?',
		time: time,
		items: [...cart],
		total: total,
	});

	// Telegram ga yuborish
	const token = '8523116979:AAEvyNdbZolsXDujxoeCT5-aAuZ_0XlNhno';
	const chatId = '7870574525';

	let message = `🍽️ Yangi buyurtma!\n`;
	message += `🪑 Stol: ${selectedTable || '?'}\n`;
	message += `🕐 Vaqt: ${time}\n\n`;
	message += `📋 Taomlar:\n`;
	cart.forEach(item => {
		message += `• ${item.name} x${item.qty} — ${(item.price * item.qty).toLocaleString()} so'm\n`;
	});
	message += `\n💰 Jami: ${total.toLocaleString()} so'm`;

	fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: chatId, text: message }),
	});

	cart = [];
	updateCartCount();

	const modal = document.getElementById('cartModal');
	const overlay = document.getElementById('cartOverlay');
	modal.classList.remove('active');
	overlay.classList.remove('active');

	document.getElementById('successModal').classList.add('active');
}
// Close success
function closeSuccess() {
	document.getElementById('successModal').classList.remove('active');
}
// Menu data
const menuData = [
	{
		name: 'Cezar Salati',
		price: 45000,
		category: 'salad',
		img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
		desc: "Yangi ko'katlar, tovuq go'shti, kroutonlar va parmezan pishloq bilan tayyorlangan klassik salat.",
		ingredients: ['Tovuq', "Ko'kat", 'Krouton', 'Parmezan', 'Cezar sous'],
		badge: 'Mashhur',
	},
	{
		name: 'Grek Salati',
		price: 38000,
		category: 'salad',
		img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
		desc: "Yangi pomidor, bodring, zaytun va feta pishloq bilan tayyorlangan sog'lom salat.",
		ingredients: ['Pomidor', 'Bodring', 'Zaytun', 'Feta pishloq', 'Zeytun moyi'],
		badge: '',
	},
	{
		name: 'Grill Tovuq',
		price: 85000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
		desc: 'Maxsus ziravorlar bilan marinlangan, grill qilingan tovuq. Sabzavotlar va kartoshka bilan.',
		ingredients: ['Tovuq', 'Kartoshka', 'Sabzavotlar', 'Ziravorlar', 'Limon'],
		badge: 'Chef tavsiyasi',
	},
	{
		name: 'Osh',
		price: 55000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
		desc: "An'anaviy o'zbek oshi. Mol go'shti, sabzi va maxsus ziravorlar bilan pishirilgan.",
		ingredients: ['Guruch', "Mol go'shti", 'Sabzi', 'Piyoz', 'Ziravorlar'],
		badge: '',
	},
	{
		name: 'Premium Burger',
		price: 72000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
		desc: "Mol go'shtidan tayyorlangan premium kotlet, erigan pishloq, pomidor va salat bargi bilan.",
		ingredients: ["Mol go'shti", 'Pishloq', 'Pomidor', 'Salat', 'Maxsus sous'],
		badge: 'Yangi',
	},
	{
		name: 'Tiramisu',
		price: 35000,
		category: 'dessert',
		img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
		desc: 'Italyan klassik deserti. Maskarpone krem, espresso va kakao bilan tayyorlangan.',
		ingredients: ['Maskarpone', 'Espresso', 'Kakao', 'Savoiardi', 'Tuxum'],
		badge: '',
	},
	{
		name: 'Limonad',
		price: 18000,
		category: 'drink',
		img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
		desc: 'Yangi limon va nane bilan tayyorlangan, muzli gazlangan ichimlik.',
		ingredients: ['Limon', 'Nane', 'Qand', 'Muz', 'Gazlangan suv'],
		badge: '',
	},
	{
		name: 'Kapuchino',
		price: 22000,
		category: 'drink',
		img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
		desc: "Italyan espresso va issiq sut ko'pigi bilan tayyorlangan klassik qahva.",
		ingredients: ['Espresso', 'Sut', "Sut ko'pigi"],
		badge: '',
	},
	{
		name: 'Vinegret',
		price: 28000,
		category: 'salad',
		img: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400',
		desc: "Lavlagi, kartoshka, sabzi va no'xatdan tayyorlangan klassik salat.",
		ingredients: ['Lavlagi', 'Kartoshka', 'Sabzi', "No'xat", 'Zeytun moyi'],
		badge: '',
	},
	{
		name: 'Olivye',
		price: 32000,
		category: 'salad',
		img: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400',
		desc: 'Kartoshka, kolbasa va mayonez bilan tayyorlangan mashhur salat.',
		ingredients: ['Kartoshka', 'Kolbasa', 'Mayonez', "No'xat", 'Bodring'],
		badge: 'Mashhur',
	},
	{
		name: 'Tuna Salati',
		price: 42000,
		category: 'salad',
		img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
		desc: 'Tuna baliq, pomidor, bodring va zaytun bilan tayyorlangan yengil salat.',
		ingredients: ['Tuna', 'Pomidor', 'Bodring', 'Zaytun', 'Limon'],
		badge: '',
	},
	{
		name: "Lag'mon",
		price: 48000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400',
		desc: "Qo'lda cho'zilgan xamir, go'sht va sabzavotlar bilan tayyorlangan milliy taom.",
		ingredients: ['Xamir', "Go'sht", 'Sabzi', 'Piyoz', 'Ziravorlar'],
		badge: 'Mashhur',
	},
	{
		name: "Sho'rva",
		price: 42000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
		desc: "Qo'y go'shti va sabzavotlar bilan pishirilgan milliy sho'rva.",
		ingredients: ["Qo'y go'shti", 'Kartoshka', 'Sabzi', 'Piyoz', 'Ziravorlar'],
		badge: '',
	},
	{
		name: 'Kabob',
		price: 65000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
		desc: "Qo'y go'shtidan tayyorlangan, tandirda pishirilgan milliy kabob.",
		ingredients: ["Qo'y go'shti", 'Piyoz', 'Ziravorlar', 'Non'],
		badge: 'Chef tavsiyasi',
	},
	{
		name: 'Pizza Margarita',
		price: 78000,
		category: 'main',
		img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
		desc: 'Pomidor sous, mozzarella pishloq va yangi rayhon bilan tayyorlangan klassik pizza.',
		ingredients: ['Xamir', 'Pomidor sous', 'Mozzarella', 'Rayhon', 'Zeytun moyi'],
		badge: 'Yangi',
	},
	{
		name: 'Shokoladli Tort',
		price: 40000,
		category: 'dessert',
		img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
		desc: 'Qora shokolad, krem va gilos bilan tayyorlangan mazali tort.',
		ingredients: ['Shokolad', 'Krem', 'Gilos', 'Qand', 'Tuxum'],
		badge: 'Mashhur',
	},
	{
		name: 'Krep',
		price: 25000,
		category: 'dessert',
		img: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400',
		desc: 'Yupqa xamirdan tayyorlangan krep, asal va rezavorlar bilan.',
		ingredients: ['Xamir', 'Asal', 'Rezavorlar', 'Krem'],
		badge: '',
	},
	{
		name: 'Muzqaymoq',
		price: 20000,
		category: 'dessert',
		img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
		desc: 'Vanil, shokolad va rezavorlar bilan tayyorlangan muzqaymoq.',
		ingredients: ['Sut', 'Qand', 'Vanil', 'Shokolad', 'Rezavorlar'],
		badge: '',
	},
	{
		name: 'Smoothie',
		price: 25000,
		category: 'drink',
		img: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
		desc: "Yangi meva va rezavorlardan tayyorlangan sog'lom ichimlik.",
		ingredients: ['Banan', 'Rezavorlar', 'Sut', 'Asal'],
		badge: 'Yangi',
	},
	{
		name: 'Choy',
		price: 12000,
		category: 'drink',
		img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
		desc: "Xushbo'y ko'k choy, nane bilan tayyorlangan.",
		ingredients: ["Ko'k choy", 'Nane', 'Limon'],
		badge: '',
	},
];

// Open detail
function openDetail(name) {
	const item = menuData.find(i => i.name === name);
	if (!item) return;

	document.getElementById('detailImg').src = item.img;
	document.getElementById('detailName').textContent = item.name;
	document.getElementById('detailDesc').textContent = item.desc;
	document.getElementById('detailPrice').textContent = item.price.toLocaleString() + " so'm";
	document.getElementById('detailBadge').textContent = item.badge;

	const ingredientsList = document.getElementById('detailIngredients');
	ingredientsList.innerHTML = item.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('');

	document.getElementById('detailAddBtn').onclick = () => {
		addToCart(item.name, item.price);
		closeDetail();
	};

	document.getElementById('detailOverlay').classList.add('active');
	document.getElementById('detailModal').classList.add('active');
}

// Close detail
function closeDetail() {
	document.getElementById('detailOverlay').classList.remove('active');
	document.getElementById('detailModal').classList.remove('active');
}
// Stol raqami
let selectedTable = null;
function selectTable(num) {
	selectedTable = num;
	document.getElementById('tableModal').style.display = 'none';
	document.querySelector('.table-info span').textContent = 'Stol #' + num;
}

// Sahifa ochilganda stol tanlash modali chiqadi
window.onload = function () {
	document.getElementById('tableModal').style.display = 'flex';
};
// window.onload = function () {
// 	const urlParams = new URLSearchParams(window.location.search);
// 	const tableFromUrl = urlParams.get('table');

// 	if (tableFromUrl) {
// 		selectedTable = tableFromUrl;
// 		document.querySelector('.table-info span').textContent = 'Stol #' + tableFromUrl;
// 		document.getElementById('tableModal').style.display = 'none';
// 	} else {
// 		document.getElementById('tableModal').style.display = 'flex';
// 	}
// };
// Buyurtma tarixi
let orderHistory = [];
let orderCount = 0;

function toggleHistory() {
	const modal = document.getElementById('historyModal');
	const overlay = document.getElementById('historyOverlay');
	modal.classList.toggle('active');
	overlay.classList.toggle('active');
	renderHistory();
}

function renderHistory() {
	const historyItems = document.getElementById('historyItems');

	if (orderHistory.length === 0) {
		historyItems.innerHTML = '<p class="empty-history">Hali buyurtma yo\'q</p>';
		return;
	}

	historyItems.innerHTML = orderHistory
		.map(
			order => `
        <div class="history-order">
            <div class="history-order-header">
                <span class="history-order-num">Buyurtma #${order.num} — Stol ${order.table}</span>
                <span class="history-order-time">${order.time}</span>
            </div>
            <div class="history-order-items">
                ${order.items.map(item => `${item.name} x${item.qty} — ${(item.price * item.qty).toLocaleString()} so'm`).join('<br>')}
            </div>
            <div class="history-order-total">
                Jami: ${order.total.toLocaleString()} so'm
            </div>
        </div>
    `,
		)
		.join('');
}
// Loading animatsiyasi
window.addEventListener('load', function () {
	setTimeout(() => {
		const loader = document.getElementById('loader');
		loader.classList.add('hide');
		setTimeout(() => {
			loader.style.display = 'none';
		}, 500);
	}, 2000);
});
// Taomlar birma-bir chiqishi
const observer = new IntersectionObserver(
	entries => {
		entries.forEach((entry, index) => {
			if (entry.isIntersecting) {
				setTimeout(() => {
					entry.target.classList.add('visible');
				}, index * 100);
				observer.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.1 },
);

document.querySelectorAll('.menu-card').forEach(card => {
	observer.observe(card);
});
