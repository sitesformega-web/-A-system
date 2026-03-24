import { STORAGE_KEYS } from "./asi.js";
import { fixImageUrl, splitGallery, uniq } from "./agarrame aca.js";

export const state = {
  products: [],
  filtered: [],
  pedido: JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]"),
  activeCategory: "Todas",
  currentModalProduct: null,
  currentModalImage: "",
  currentModalIndex: -1
};

export function saveCart(){
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.pedido));
}

export function getProductGallery(raw){
  const fromArray = Array.isArray(raw.galeriaArray) ? raw.galeriaArray : [];
  const fromText = splitGallery(raw["Galería"] || "");
  const cover = raw.Imagen ? [raw.Imagen] : [];

  return uniq(
    cover
      .concat(fromArray)
      .concat(fromText)
      .map(fixImageUrl)
      .filter(Boolean)
  );
}

export function mapProduct(raw){
  const gallery = getProductGallery(raw);
  const cover = fixImageUrl(raw.Imagen || "") || gallery[0] || "";

  return {
    id: String(raw.ID || "").trim(),
    code: String(raw.ID || "").trim(),
    name: String(raw.Nombre || "").trim(),
    category: String(raw["Categoría"] || "").trim(),
    desc: String(raw["Descripción"] || "").trim(),
    img: cover,
    gallery: gallery,
    stock: String(raw.Stock || "N/D").trim() || "N/D"
  };
}

export function setProducts(products){
  state.products = Array.isArray(products) ? products : [];
}

export function setFiltered(list){
  state.filtered = Array.isArray(list) ? list : [];
}

export function applyFilters(query){
  const q = String(query || "").trim().toLowerCase();

  state.filtered = state.products.filter(function(p){
    const inCat = !state.activeCategory || state.activeCategory === "Todas" || p.category === state.activeCategory;
    const hay = [p.name, p.code, p.desc, p.category, p.stock].join(" ").toLowerCase();
    return inCat && hay.indexOf(q) !== -1;
  });

  return state.filtered;
}

export function addToCart(id){
  const item = state.products.find(function(p){ return p.id === id; });
  if(!item) return false;

  const exists = state.pedido.find(function(p){ return p.id === id; });
  if(!exists){
    state.pedido.push({
      id: item.id,
      name: item.name,
      code: item.code
    });
    saveCart();
  }

  return true;
}

export function removeFromCart(id){
  state.pedido = state.pedido.filter(function(p){ return p.id !== id; });
  saveCart();
}

export function clearCart(){
  state.pedido = [];
  saveCart();
}

export function openModalState(product, index){
  state.currentModalProduct = product;
  state.currentModalIndex = index;
  state.currentModalImage = product.img || (product.gallery && product.gallery[0]) || "";
}

export function closeModalState(){
  state.currentModalProduct = null;
  state.currentModalImage = "";
  state.currentModalIndex = -1;
}

export function setCurrentModalImage(url){
  state.currentModalImage = url || "";
}

export function getModalSibling(direction){
  if(state.currentModalIndex < 0 || !state.filtered.length) return null;

  const total = state.filtered.length;
  let nextIndex = state.currentModalIndex + direction;

  if(nextIndex < 0) nextIndex = total - 1;
  if(nextIndex >= total) nextIndex = 0;

  return {
    product: state.filtered[nextIndex],
    index: nextIndex
  };
}
