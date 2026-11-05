const eventList = document.querySelector("#etkinlik-listesi");
const statusMessage = document.querySelector("#durum");
const searchInput = document.querySelector("#arama");
const filterButtons = document.querySelectorAll(".filter-button");
const suggestionForm = document.querySelector("#oner-formu");

let events = [];
let activeFilter = "all";

const typeNames = {
  atolye: "Atölye",
  soylesi: "Söyleşi",
  topluluk: "Topluluk"
};

function formatTurkishDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric"
  });
}

function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";

  const type = document.createElement("span");
  type.className = "event-type";
  type.textContent = typeNames[event.tur] || event.tur;

  const title = document.createElement("h3");
  title.textContent = event.baslik;

  const details = document.createElement("div");
  details.className = "event-details";

  const date = document.createElement("p");
  date.textContent = `📅 ${formatTurkishDate(event.tarih)}`;

  const place = document.createElement("p");
  place.textContent = `📍 ${event.yer}`;

  const capacity = document.createElement("p");
  capacity.textContent = `👥 Kontenjan: ${event.kontenjan} kişi`;

  details.append(date, place, capacity);
  card.append(type, title, details);
  return card;
}

function renderEvents() {
  eventList.replaceChildren();

  const searchTerm = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  const filteredEvents = events.filter((event) => {
    const matchesType = activeFilter === "all" || event.tur === activeFilter;
    const searchableText = `${event.baslik} ${event.yer}`.toLocaleLowerCase("tr-TR");
    return matchesType && searchableText.includes(searchTerm);
  });

  if (filteredEvents.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "Aramanızla eşleşen etkinlik bulunamadı.";
    eventList.append(emptyMessage);
    return;
  }

  filteredEvents.forEach((event) => {
    eventList.append(createEventCard(event));
  });
}

async function loadEvents() {
  statusMessage.textContent = "Etkinlikler yükleniyor...";
  statusMessage.className = "status-message";

  try {
    const response = await fetch("/api/etkinlikler");
    if (!response.ok) {
      throw new Error(`Sunucu hatası: ${response.status}`);
    }

    events = await response.json();
    statusMessage.textContent = `${events.length} etkinlik listelendi.`;
    renderEvents();
  } catch (error) {
    statusMessage.textContent = "Etkinlikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    statusMessage.className = "status-message error";
    console.error("Etkinlikler alınamadı:", error);
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderEvents();
  });
});

searchInput.addEventListener("input", renderEvents);

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().slice(0, 10);
document.querySelector("#etkinlik-tarihi").min = localToday;

const validationRules = [
  {
    input: "#etkinlik-adi",
    error: "#ad-hata",
    validate: (value) => value.trim().length >= 5,
    message: "Etkinlik adı en az 5 karakter olmalıdır."
  },
  {
    input: "#etkinlik-tarihi",
    error: "#tarih-hata",
    validate: (value) => value !== "" && value >= localToday,
    message: "Geçerli ve bugünden önce olmayan bir tarih seçin."
  },
  {
    input: "#eposta",
    error: "#email-hata",
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Geçerli bir e-posta adresi girin."
  }
];

suggestionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let isValid = true;
  validationRules.forEach((rule) => {
    const input = document.querySelector(rule.input);
    const error = document.querySelector(rule.error);
    const valid = rule.validate(input.value);
    error.textContent = valid ? "" : rule.message;
    if (!valid) isValid = false;
  });

  const formMessage = document.querySelector("#form-mesaji");
  if (!isValid) {
    formMessage.textContent = "Lütfen hatalı alanları kontrol edin.";
    formMessage.className = "form-message error";
    return;
  }

  formMessage.textContent = "Etkinlik öneriniz başarıyla alındı! (Demo: öneri sunucuya kaydedilmez.)";
  formMessage.className = "form-message success";
  suggestionForm.reset();
  document.querySelector("#etkinlik-tarihi").min = localToday;
});

loadEvents();
