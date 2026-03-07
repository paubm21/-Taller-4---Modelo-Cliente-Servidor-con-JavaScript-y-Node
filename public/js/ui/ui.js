const BADGE_CLASS = {
  "Cárnica": "badge badge-carnica",
  "Lechera": "badge badge-lechera",
  "Doble propósito": "badge badge-doble"
};

export function renderItems(items, tableBody) {
  tableBody.innerHTML = "";
  if (!items.length) {
    tableBody.innerHTML = `<tr><td colspan="8" class="empty-state">No hay razas registradas.</td></tr>`;
    return;
  }
  items.forEach(item => {
    const row = document.createElement("tr");
    const badgeClass = BADGE_CLASS[item.categoria] || "badge";
    row.innerHTML = `
      <td>${item.id}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.origen || "—"}</td>
      <td><span class="${badgeClass}">${item.categoria || "—"}</span></td>
      <td>${item.peso_promedio_kg ? item.peso_promedio_kg + " kg" : "—"}</td>
      <td>${item.produccion_leche_ldia ? item.produccion_leche_ldia + " L" : "—"}</td>
      <td>${item.temperamento || "—"}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-primary btn-edit" data-id="${item.id}">Editar</button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

export function resetForm(form, submitBtn) {
  form.reset();
  if (submitBtn) submitBtn.textContent = "Agregar raza";
  document.getElementById("formTitle").textContent = "Registrar nueva raza";
}

export function fillForm(form, item, submitBtn) {
  form.querySelector("#name").value = item.name || "";
  form.querySelector("#description").value = item.description || "";
  form.querySelector("#origen").value = item.origen || "";
  form.querySelector("#categoria").value = item.categoria || "";
  form.querySelector("#peso_promedio_kg").value = item.peso_promedio_kg || "";
  form.querySelector("#produccion_leche_ldia").value = item.produccion_leche_ldia || "";
  form.querySelector("#temperamento").value = item.temperamento || "";
  form.querySelector("#fecha_registro").value = item.fecha_registro || "";
  if (submitBtn) submitBtn.textContent = "Guardar cambios";
  document.getElementById("formTitle").textContent = `Editando: ${item.name}`;
}