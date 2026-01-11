// =============================================================================
// نظام الترجمة الداخلي (بدون ملفات خارجية)
// =============================================================================
const translations = {
  ar: {
    welcome: "أناقة إسلامية تليق بكِ 💕",
    heroSubtitle: "من عمر سنتين إلى ثمانين سنة — نهتم بكل تفصيل في أناقتك",
    shopNow: "تسوق الآن",
    categoriesTitle: "أقسام المتجر",
    productsTitle: "أحدث المنتجات",
    cartTitle: "سلة التسوق",
    totalLabel: "الإجمالي:",
    addToCart: "أضف إلى السلة",
    emptyCart: "سلة فارغة",
    orderViaWhatsApp: "إرسال الطلب عبر الواتساب",
    catAbayas: "العبايات",
    catHijabs: "الطرح",
    catNiqabs: "النقاب",
    catKids: "أطفال",
    catSeniors: "كبار",
    searchPlaceholder: "ابحث عن منتج...",
    developerCredit: "تم تطوير الموقع بواسطة شركة <strong>Ment-M</strong><br/> بقيادة المهندس <strong>محمد عيد صبحي عيد مرشدي</strong>"
  },
  en: {
    welcome: "Islamic Elegance, Just for You 💕",
    heroSubtitle: "From age 2 to 80 — we care about every detail of your style",
    shopNow: "Shop Now",
    categoriesTitle: "Store Categories",
    productsTitle: "Latest Products",
    cartTitle: "Shopping Cart",
    totalLabel: "Total:",
    addToCart: "Add to Cart",
    emptyCart: "Your cart is empty",
    orderViaWhatsApp: "Order via WhatsApp",
    catAbayas: "Abayas",
    catHijabs: "Hijabs",
    catNiqabs: "Niqabs",
    catKids: "Kids",
    catSeniors: "Seniors",
    searchPlaceholder: "Search for products...",
    developerCredit: "Developed by <strong>Ment-M</strong><br/> Led by Eng. <strong>Mohammad Eid Sbahi Eid Murshidi</strong>"
  }
};

let currentLang = localStorage.getItem('meilaLang') || 'ar';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('meilaLang', lang);
  
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // تحديث النصوص
  document.getElementById('welcomeText').textContent = translations[lang].welcome;
  document.getElementById('heroSubtitle').textContent = translations[lang].heroSubtitle;
  document.getElementById('shopNowBtn').textContent = translations[lang].shopNow;
  document.getElementById('categoriesTitle').textContent = translations[lang].categoriesTitle;
  document.getElementById('productsTitle').textContent = translations[lang].productsTitle;
  document.getElementById('cartTitle').textContent = translations[lang].cartTitle;
  document.getElementById('totalLabel').innerHTML = translations[lang].totalLabel + ' <strong id="cartTotal">0 ج.م</strong>';
  document.getElementById('whatsappOrderBtn').textContent = translations[lang].orderViaWhatsApp;
  document.getElementById('catAbayas').textContent = translations[lang].catAbayas;
  document.getElementById('catHijabs').textContent = translations[lang].catHijabs;
  document.getElementById('catNiqabs').textContent = translations[lang].catNiqabs;
  document.getElementById('catKids').textContent = translations[lang].catKids;
  document.getElementById('developerCredit').innerHTML = translations[lang].developerCredit;
  
  // تحديث زر اللغة
  document.getElementById('langToggle').textContent = lang === 'ar' ? 'EN' : 'العربية';
  
  // تحديث placeholder البحث
  document.getElementById('searchInput').placeholder = translations[lang].searchPlaceholder;
  
  // إعادة عرض المنتجات بلغة جديدة
  renderProducts(currentCategory);
}

function toggleLanguage() {
  const newLang = currentLang === 'ar' ? 'en' : 'ar';
  applyLanguage(newLang);
}

// =============================================================================
// إدارة السلة
// =============================================================================
let cart = JSON.parse(localStorage.getItem('meilaCart')) || [];
let currentCategory = 'all';

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showNotification("✓ تم إضافة المنتج إلى السلة");
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('meilaCart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cartCount');
  const cartListEl = document.getElementById('cartList');
  const cartTotalEl = document.getElementById('cartTotal');

  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCountEl.textContent = totalCount;

  if (cart.length === 0) {
    cartListEl.innerHTML = `<li>${translations[currentLang].emptyCart}</li>`;
    cartTotalEl.textContent = '0 ج.م';
    return;
  }

  cartListEl.innerHTML = cart.map(item => `
    <li>
      ${item.name[currentLang]} × ${item.quantity || 1}
      <span>${(item.price * (item.quantity || 1)).toFixed(2)} ج.م 
        <button onclick="removeFromCart(${item.id})">✕</button>
      </span>
    </li>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  cartTotalEl.textContent = `${total.toFixed(2)} ج.م`;
}

function showNotification(msg) {
  console.log(msg);
}

// =============================================================================
// عرض المنتجات
// =============================================================================
function renderProducts(category = 'all') {
  currentCategory = category;
  const grid = document.getElementById('productGrid');
  
  let filtered = category === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === category);
  
  // بحث
  const query = document.getElementById('searchInput').value.toLowerCase();
  if (query) {
    filtered = filtered.filter(p => 
      p.name[currentLang].toLowerCase().includes(query) ||
      p.desc[currentLang].toLowerCase().includes(query)
    );
  }

  grid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-image">${product.name[currentLang]}</div>
      <div class="product-info">
        <h3>${product.name[currentLang]}</h3>
        <p>${product.desc[currentLang]}</p>
        <div class="price">${product.price} ج.م</div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">
          ${translations[currentLang].addToCart}
        </button>
      </div>
    </div>
  `).join('');
}

// =============================================================================
// وظائف الواتساب
// =============================================================================
function sendOrderViaWhatsApp() {
  if (cart.length === 0) {
    alert(translations[currentLang].emptyCart);
    return;
  }

  let message = currentLang === 'ar' 
    ? 'مرحباً من متجر "ميلا ماهر"، أرغب في طلب التالي:\n\n'
    : 'Hello from Meila Maher store, I would like to order the following:\n\n';

  cart.forEach(item => {
    message += `• ${item.name[currentLang]} (${item.quantity || 1} piece) — ${item.price * (item.quantity || 1)} EGP\n`;
  });

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  message += `\n${currentLang === 'ar' ? 'الإجمالي' : 'Total'}: ${total} EGP\n`;
  message += `\n${currentLang === 'ar' ? 'شكراً لكم ❤️' : 'Thank you! ❤️'}`;

  const phoneNumber = '+201011097388';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// =============================================================================
// ربط الأحداث
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // تطبيق اللغة المحفوظة
  applyLanguage(currentLang);
  
  // عرض جميع المنتجات
  renderProducts('all');
  
  // ربط زر السلة
  document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'block';
    updateCartUI();
  });
  
  // إغلاق النافذة
  document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartModal').style.display = 'none';
  });
  
  // طلب عبر الواتساب
  document.getElementById('whatsappOrderBtn').addEventListener('click', sendOrderViaWhatsApp);
  
  // بحث مباشر
  document.getElementById('searchInput').addEventListener('input', () => {
    renderProducts(currentCategory);
  });
  
  // ربط أقسام التنقل
  document.querySelectorAll('.nav-link, .category-card').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = el.dataset.category || el.closest('[data-category]')?.dataset.category;
      if (cat) {
        renderProducts(cat);
        window.scrollTo({ top: document.querySelector('.featured-products').offsetTop - 100, behavior: 'smooth' });
      }
    });
  });
  
  // تحديث السلة عند البدء
  updateCartUI();

  // ربط زر تغيير اللغة
  document.getElementById('langToggle').addEventListener('click', toggleLanguage);
});

// إغلاق النافذة عند النقر خارجها
window.onclick = function(event) {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};
