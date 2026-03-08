const API_URL = "/api/items";

const CATEGORY_ICONS = {
  "Cárnica":         "🥩",
  "Lechera":         "🥛",
  "Doble propósito": "⚖️"
};

const BADGE_CLASS = {
  "Cárnica":         "badge badge-carnica",
  "Lechera":         "badge badge-lechera",
  "Doble propósito": "badge badge-doble"
};

const catalogContainer = document.getElementById("catalogContainer");
const modalOverlay     = document.getElementById("modalOverlay");
const modalClose       = document.getElementById("modalClose");
const modalCloseBtn    = document.getElementById("modalCloseBtn");
const filterBtns       = document.querySelectorAll(".filter-btn");

let allItems = [];
let currentFilter = "Todos";

async function loadCatalog() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar");
    allItems = await res.json();
    renderCatalog(allItems);
  } catch (err) {
    console.error("Error cargando catálogo:", err);
    catalogContainer.innerHTML = `<p class="empty-state">⚠️ No se pudo cargar el catálogo.</p>`;
  }
}

function renderCatalog(items) {
  catalogContainer.innerHTML = "";
  const filtered = currentFilter === "Todos"
    ? items
    : items.filter(i => i.categoria === currentFilter);

  if (!filtered.length) {
    catalogContainer.innerHTML = `<p class="empty-state">No hay razas en esta categoría.</p>`;
    return;
  }
  filtered.forEach((item, idx) => {
    catalogContainer.appendChild(createCard(item, idx));
  });
}
function createCard(item, idx) {
  const icon     = CATEGORY_ICONS[item.categoria] || "🐄";
  const badgeCls = BADGE_CLASS[item.categoria] || "badge";

  const card = document.createElement("div");
  card.className = "breed-card";
  card.innerHTML = `
    <div class="card-img-wrap">
      ${item.imagen
        ? `<img src="${item.imagen}" alt="${item.name}" class="card-img"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        : ""}
      <span class="card-icon" style="${item.imagen ? "display:none" : ""}">${icon}</span>
      <span class="card-categoria-ribbon ${badgeCls}">${item.categoria || "—"}</span>
    </div>
    <div class="card-body">
      <h3>${item.name}</h3>
      <div class="card-origin">📍 ${item.origen || "Desconocido"}</div>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-label">Peso prom.</span>
          <span class="stat-value">${item.peso_promedio_kg ? item.peso_promedio_kg + " kg" : "—"}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Leche/día</span>
          <span class="stat-value">${item.produccion_leche_ldia ? item.produccion_leche_ldia + " L" : "—"}</span>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn-detail" data-id="${item.id}">Ver ficha completa</button>
      </div>
    </div>
  `;
  card.querySelector(".btn-detail").addEventListener("click", () => openModal(item.id));
  return card;
}
async function openModal(id) {
  try {
    const res  = await fetch(`${API_URL}/${id}`);
    const item = await res.json();

    const icon = CATEGORY_ICONS[item.categoria] || "🐄";

    // Cambiar el header: si tiene imagen mostrarla, si no el ícono
    const modalHeader = document.querySelector(".modal-header");
    if (item.imagen) {
      modalHeader.style.background = `
        linear-gradient(135deg, rgba(59,42,26,0.55) 0%, rgba(30,18,8,0.65) 100%),
        url('${item.imagen}') center/cover no-repeat
      `;
    } else {
      modalHeader.style.background = "linear-gradient(135deg, var(--col-leather), var(--col-earth))";
    }

    document.getElementById("modalIcon").textContent        = item.imagen ? "" : icon;
    document.getElementById("modalName").textContent        = item.name;
    document.getElementById("modalCategoria").textContent   = item.categoria || "—";
    document.getElementById("modalDescription").textContent = item.description || "Sin descripción.";
    document.getElementById("modalOrigen").textContent      = item.origen || "—";
    document.getElementById("modalTemperamento").textContent= item.temperamento || "—";
    document.getElementById("modalPeso").textContent        = item.peso_promedio_kg ? `${item.peso_promedio_kg} kg` : "—";
    document.getElementById("modalLeche").textContent       = item.produccion_leche_ldia ? `${item.produccion_leche_ldia} L/día` : "No aplica";
    document.getElementById("modalFecha").textContent       = item.fecha_registro
      ? new Date(item.fecha_registro + "T00:00:00").toLocaleDateString("es-CO", { year:"numeric", month:"long", day:"numeric" })
      : "—";
    document.getElementById("modalId").textContent          = `#${item.id}`;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  } catch (err) {
    alert("No se pudo cargar la ficha.");
  }
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderCatalog(allItems);
  });
});

loadCatalog();