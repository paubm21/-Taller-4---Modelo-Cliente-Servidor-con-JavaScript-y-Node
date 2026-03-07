import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm } from "./ui/ui.js";

const form      = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
let editingId = null;

tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);

  if (btn.classList.contains("btn-delete")) {
    if (!confirm("¿Eliminar esta raza del registro?")) return;
    try {
      await deleteItem(id);
      loadItems();
    } catch (err) { alert("No se pudo eliminar."); }

  } else if (btn.classList.contains("btn-edit")) {
    if (editingId === id) {
      resetForm(form, submitBtn);
      cancelBtn.style.display = "none";
      editingId = null;
      return;
    }
    try {
      const item = await getItem(id);
      fillForm(form, item, submitBtn);
      cancelBtn.style.display = "inline-flex";
      editingId = id;
      form.scrollIntoView({ behavior: "smooth" });
    } catch (err) { alert("No se pudo cargar la raza."); }
  }
});

cancelBtn.addEventListener("click", () => {
  resetForm(form, submitBtn);
  cancelBtn.style.display = "none";
  editingId = null;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name:                  form.querySelector("#name").value,
    description:           form.querySelector("#description").value,
    origen:                form.querySelector("#origen").value,
    categoria:             form.querySelector("#categoria").value,
    peso_promedio_kg:      Number(form.querySelector("#peso_promedio_kg").value) || 0,
    produccion_leche_ldia: Number(form.querySelector("#produccion_leche_ldia").value) || 0,
    temperamento:          form.querySelector("#temperamento").value,
    fecha_registro:        form.querySelector("#fecha_registro").value,
  };
  if (!data.name) { alert("El nombre es obligatorio."); return; }
  try {
    if (editingId) {
      await updateItem(editingId, data);
      editingId = null;
      cancelBtn.style.display = "none";
    } else {
      await createItem(data);
    }
    resetForm(form, submitBtn);
    loadItems();
  } catch (err) { alert("Error al guardar."); }
});

async function loadItems() {
  try {
    const items = await getItems();
    renderItems(items, tableBody);
  } catch (err) { alert("No se pudieron cargar las razas."); }
}

loadItems();