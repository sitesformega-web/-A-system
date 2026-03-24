import { escapeHtml } from "./agarrame aca.js";

export function renderProducts(container, list){
  container.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
      <h3>${escapeHtml(p.Nombre)}</h3>
      <p>${escapeHtml(p.Descripción || "")}</p>
    `;

    container.appendChild(card);
  });
}