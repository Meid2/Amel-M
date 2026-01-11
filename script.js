// رقم الواتساب (بدون رموز أو مسافات، مثال: 966501234567)
const WHATSAPP_NUMBER = '+201011097388'; // ← غيّر هذا الرقم إلى رقمك الحقيقي

let products = JSON.parse(localStorage.getItem('products')) || [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});

function addProduct() {
  const name = document.getElementById('productName').value.trim();
  const category = document.getElementById('productCategory').value;
  const price = parseFloat(document.getElementById('productPrice').value);

  if (!name || isNaN(price) || price <= 0) {
    alert('يرجى ملء جميع الحقول بشكل صحيح.');
    return;
  }

  if (editingId !== null) {
    const index = products.findIndex(p => p.id === editingId);
    if (index !== -1) {
      products[index] = { id: editingId, name, category, price };
    }
    editingId = null;
    document.querySelector('.btn').textContent = 'إضافة منتج';
  } else {
    const newProduct = { id: Date.now(), name, category, price };
    products.push(newProduct);
  }

  saveProducts();
  renderProducts();
  resetForm();
}

function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

function resetForm() {
  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productCategory').value = 'نسائي';
}

function renderProducts(filtered = null) {
  const container = document.getElementById('productsGrid');
  const list = filtered || products;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888;">لا توجد منتجات</p>';
    return;
  }

  list.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openModal(product);
    
    // رسالة واتساب جاهزة
    const message = `مرحباً، أرغب في طلب المنتج التالي من متجر Mnet:\n\nالمنتج: ${product.name}\nالفئة: ${product.category === 'نسائي' ? 'نسائي' : 'بناتي'}\nالسعر: ${product.price} ريال`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>الفئة: ${product.category === 'نسائي' ? 'نسائي' : 'بناتي'}</p>
      <p>السعر: ${product.price} جنيه</p>
      <a href="${whatsappUrl}" target="_blank" class="whatsapp-btn">طلب عبر واتساب</a>
    `;
    container.appendChild(card);
  });
}

function applyFilters() {
  const category = document.getElementById('filterCategory').value;
  const priceRange = document.getElementById('filterPrice').value;

  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (priceRange) {
    if (priceRange === '0-100') {
      filtered = filtered.filter(p => p.price <= 100);
    } else if (priceRange === '100-300') {
      filtered = filtered.filter(p => p.price > 100 && p.price <= 300);
    } else if (priceRange === '300+') {
      filtered = filtered.filter(p => p.price > 300);
    }
  }

  renderProducts(filtered);
}

function openModal(product) {
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalCategory').textContent = product.category === 'نسائي' ? 'نسائي' : 'بناتي';
  document.getElementById('modalPrice').textContent = product.price;
  window.currentProductId = product.id;
  document.getElementById('productModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
}

function deleteProductFromModal() {
  const id = window.currentProductId;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderProducts();
  closeModal();
}

window.onclick = function(event) {
  const modal = document.getElementById('productModal');
  if (event.target === modal) {
    closeModal();
  }

};
