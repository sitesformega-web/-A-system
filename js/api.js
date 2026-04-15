import { CATALOG_URL } from "./config.js";
import { mapProduct } from "./catalog.js";

export async function fetchProducts() {
  const response = await fetch(CATALOG_URL, { cache: "no-store" });
  const data = await response.json();

  const rows = Array.isArray(data)
    ? data
    : data && Array.isArray(data.rows)
      ? data.rows
      : null;

  if (!rows) {
    throw new Error("La respuesta del catálogo no es válida.");
  }

  return rows
    .map(mapProduct)
    .filter(function (product) {
      return !!product.id && !!product.name;
    });
}