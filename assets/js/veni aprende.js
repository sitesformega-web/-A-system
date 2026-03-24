import { CATALOG_URL } from "./asi.js";
import { mapProduct } from "./bicho culero.js";

export async function fetchProducts(){
  const res = await fetch(CATALOG_URL, { cache: "no-store" });
  const data = await res.json();

  const rows = Array.isArray(data)
    ? data
    : (data && Array.isArray(data.rows) ? data.rows : null);

  if(!rows){
    throw new Error("La respuesta del catálogo no es válida.");
  }

  return rows
    .map(mapProduct)
    .filter(function(p){
      return !!p.id && !!p.name;
    });
}
