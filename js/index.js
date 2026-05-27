const ROOMS = [
  {
    id: 1,
    category: 'Стандарт',
    price: 10000,
    img: 'img/standart.png',
    features: ['Включён завтрак', 'Душ + Ванна']
  },
  {
    id: 2,
    category: 'Студия',
    price: 8000,
    img: 'img/studio.jpg',
    features: ['Включён завтрак, обед', 'Душ + Ванна', 'Кондиционер']
  },
  {
    id: 3,
    category: 'Люкс',
    price: 19000,
    img: 'img/lux.png',
    features: ['Включён завтрак, обед, ужин', 'Душ + Ванна', 'Кондиционер', 'Телевизор', 'Мини-бар', 'Вид на город']
  },
  {
    id: 4,
    category: 'Стандарт',
    price: 10000,
    img: 'img/standart.png',
    features: ['Включён завтрак', 'Душ + Ванна']
  },
  {
    id: 5,
    category: 'Студия',
    price: 8000,
    img: 'img/studio.jpg',
    features: ['Включён завтрак, обед', 'Душ + Ванна', 'Кондиционер']
  },
  {
    id: 6,
    category: 'Люкс',
    price: 19000,
    img: 'img/lux.png',
    features: ['Включён завтрак, обед, ужин', 'Душ + Ванна', 'Кондиционер', 'Телевизор', 'Мини-бар', 'Вид на город']
  },
  {
    id: 7,
    category: 'Стандарт',
    price: 10000,
    img: 'img/standart.png',
    features: ['Включён завтрак', 'Душ + Ванна']
  }
];

const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'admin123';

function getRandomRooms(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderRooms(rooms) {
  const container = document.getElementById('rooms-container');
  if (!container) return;
  if (rooms.length === 0) {
    container.innerHTML = '<p class="text-center w-100 mt-4">Нет номеров по выбранной категории.</p>';
    return;
  }
  container.innerHTML = rooms.map(r => `
    <div class="card" data-category="${r.category}">
      <img src="${r.img}" class="card-img-top" alt="${r.category}">
      <div class="card-body">
        <h3>Категория: ${r.category}</h3>
        <h5>Цена: ${r.price.toLocaleString('ru')} ₽ / чел</h5>
        <h5>Характеристики:</h5>
        <ul class="list-group">
          ${r.features.map(f => `<li class="list-group-item">${f}</li>`).join('')}
        </ul>
      </div>
      <div class="d-grid gap-2">
        <a href="order.html?id=${r.id}" class="btn btn-success">Забронировать</a>
      </div>
    </div>
  `).join('');
}

let currentRooms = [];
let selectedCategory = '';

function initCatalog() {
  if (!document.getElementById('rooms-container')) return;

  currentRooms = getRandomRooms(ROOMS, 5);
  renderRooms(currentRooms);

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      selectedCategory = this.textContent.trim();
      document.querySelector('.dropdown-toggle').textContent = selectedCategory;
    });
  });

  const applyBtn = document.querySelector('.btn-primary');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      if (!selectedCategory) {
        renderRooms(currentRooms);
      } else {
        const filtered = currentRooms.filter(r => r.category === selectedCategory);
        renderRooms(filtered);
      }
    });
  }

  const resetBtn = document.querySelector('.btn-danger');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      selectedCategory = '';
      document.querySelector('.dropdown-toggle').textContent = 'Категории';
      renderRooms(currentRooms);
    });
  }
}

function initOrder() {
  if (!document.getElementById('validationCustom01')) return;

  $('#validationCustomPhone').inputmask({"mask": "+7(999)999-99-99"});

  const btn = document.querySelector('.btn-primary');
  if (btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();

      const name = document.getElementById('validationCustom01').value.trim();
      const surname = document.getElementById('validationCustom02').value.trim();
      const phone = document.getElementById('validationCustomPhone').value.trim();
      const email = document.getElementById('validationCustom03').value.trim();
      const checkin = document.getElementById('validationCustom04').value;
      const checkout = document.getElementById('validationCustom05').value;

      let valid = true;
      const cyrReg = /^[А-ЯЁа-яё\s.\-]+$/;

      setValid('validationCustom01', name.length >= 2 && cyrReg.test(name));
      if (name.length < 2 || !cyrReg.test(name)) valid = false;

      setValid('validationCustom02', surname.length >= 2 && cyrReg.test(surname));
      if (surname.length < 2 || !cyrReg.test(surname)) valid = false;

      const phoneClean = phone.replace(/\D/g, '');
      setValid('validationCustomPhone', phoneClean.length === 11);
      if (phoneClean.length !== 11) valid = false;

      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValid('validationCustom03', emailReg.test(email));
      if (!emailReg.test(email)) valid = false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cin = new Date(checkin);
      const cout = new Date(checkout);

      const checkinOk = checkin && cin >= today;
      const checkoutOk = checkout && cout > cin;

      setValid('validationCustom04', checkinOk);
      setValid('validationCustom05', checkoutOk);
      if (!checkinOk || !checkoutOk) valid = false;

      if (!valid) return;

      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push({
        id: Date.now(),
        name, surname, phone, email, checkin, checkout,
        status: 'pending'
      });
      localStorage.setItem('bookings', JSON.stringify(bookings));

      const alert = document.querySelector('.alert-success');
      if (alert) {
        alert.style.display = 'block';
        alert.textContent = 'Заявка успешно отправлена!';
      }

      document.querySelector('form').reset();
      document.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
      });
    });
  }
}

function setValid(id, isValid) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('is-valid', isValid);
  el.classList.toggle('is-invalid', !isValid);
}

function initLogin() {
  const btn = document.querySelector('.btn-primary');
  if (!btn || !document.getElementById('username')) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const login = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      window.location.href = 'admin.html';
    } else {
      document.getElementById('username').classList.add('is-invalid');
      document.getElementById('password').classList.add('is-invalid');
      let err = document.getElementById('login-error');
      if (!err) {
        err = document.createElement('div');
        err.id = 'login-error';
        err.className = 'text-danger mt-2';
        err.textContent = 'Неверный логин или пароль';
        document.querySelector('form').appendChild(err);
      }
    }
  });
}

function initAdmin() {
  const container = document.getElementById('bookings-container');
  if (!container) return;
  renderBookings();
}

function renderBookings() {
  const container = document.getElementById('bookings-container');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  if (bookings.length === 0) {
    container.innerHTML = '<p class="text-center w-100 mt-4">Заявок пока нет.</p>';
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div class="card" id="booking-${b.id}">
      <div class="card-body">
        <h5>Фамилия: ${b.surname}</h5>
        <h5>Имя: ${b.name}</h5>
        <h5>Телефон: ${b.phone}</h5>
        <h5>Email: ${b.email}</h5>
        <ul class="list-group">
          <li class="list-group-item">Дата заезда: ${formatDate(b.checkin)}</li>
          <li class="list-group-item">Дата выезда: ${formatDate(b.checkout)}</li>
          <li class="list-group-item">Статус: <strong>${b.status === 'approved' ? 'Одобрено' : 'Ожидает'}</strong></li>
        </ul>
      </div>
      <div class="d-grid gap-2">
        <a href="#" class="btn btn-success" onclick="approveBooking(${b.id}); return false;">Одобрить</a>
        <a href="#" class="btn btn-danger" onclick="deleteBooking(${b.id}); return false;">Удалить</a>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU');
}

function approveBooking(id) {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const idx = bookings.findIndex(b => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = 'approved';
    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderBookings();
  }
}

function deleteBooking(id) {
  let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  renderBookings();
}

$(document).ready(function() {
  initCatalog();
  initOrder();
  initLogin();
  initAdmin();
});