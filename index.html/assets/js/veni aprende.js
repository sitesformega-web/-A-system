import { CONFIG } from "./asi.js";

export async function fetchProducts(){
  const res = await fetch(CONFIG.API_URL);

  if(!res.ok) throw new Error("API error");

  const data = await res.json();

  return Array.isArray(data) ? data : data.rows;
}