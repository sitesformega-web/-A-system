import { CONFIG } from "./asi.js";
import {
  state,
  setProducts,
  applyFilters,
  addToCart,
  removeFromCart,
  clearCart,
  openModalState,
  closeModalState,
  setCurrentModalImage,
  getModalSibling
} from "./bicho culero.js";
import { fetchProducts } from "./veni aprende.js";
import {
  renderLogo,
  renderSocials,
  renderCategoryButtons,
  syncCategoryButtons,
  renderList,
  fillModalData,
  renderModalMainImage,
  renderModalGallery,
  showModal,
  hideModal,
  updateModalNav,
  updateCartView,
  updateCartCounts,
  showLoader,
  hideLoader,
  showLoadError,
  openDrawer,
  closeDrawer,
  closeDrawers
} from "./Nos vimos.js";

const els = {
  grid: document.getElementById("grid"),
  loader: document.getElementById("loader"),
  searchInput: document.getElementById("searchInput"),
  countSpan: document.getElementById("count"),

  logoWrap: document.getElementById("logoWrap"),
  footerText: document.getElementById("footerText"),

  categoryButtons: document.getElementById("categoryButtons"),
  categoryButtonsMobile: document.getElementById("categoryButtonsMobile"),

  socialBlock: document.getElementById("socialBlock"),
  socialBlockMobile: document.getElementById("socialBlockMobile"),

  cartItems: document.getElementById("cartItems"),
  cartItemsMobile: document.getElementById("cartItemsMobile"),
  cartCountFab: document.getElementById("cartCountFab"),

  sendCartBtn: document.getElementById("sendCartBtn"),
  clearCartBtn: document.getElementById("clearCartBtn"),
  sendCartBtnMobile: document.getElementById("sendCartBtnMobile"),
  clearCartBtnMobile: document.getElementById("clearCartBtnMobile"),

  modalBack: document.getElementById("modalBack"),
  closeModal: document.getElementById("closeModal"),
  modalPrevBtn: document.getElementById("modalPrevBtn"),
  modalNextBtn: document.getElementById("modalNextBtn"),
  modalCarrito: document.getElementById("modalCarrito"),

  mTitle: document.getElementById("mTitle"),
  mThumb: document.getElementById("mThumb"),
  mGallery: document.getElementById("mGallery"),
  mDesc: document.getElementById("mDesc"),
  mCode: document.getElementById("mCode"),
  mCat: document.getElementById("mCat"),
  mStock: document.getElementById("mStock"),

  openCatsFab: document.getElementById("openCatsFab"),
  openCartFab: document.getElementById("openCartFab"),
  catsDrawerBack: document.getElementById("catsDrawerBack"),
  cartDrawerBack: document.getElementById("cartDrawerBack"),
  closeCatsDrawer: document.getElementById("closeCatsDrawer"),
  closeCartDrawer: document.getElementById("closeCartDrawer")
};

function refreshCatalogUI(){
  const list = applyFilters(els.searchInput.value);
  renderList(els, list, {
    openModalById: openModalById
  });
}

function refreshCartUI(){
  updateCartView(els, function(id){
    removeFromCart(id);
    refreshCartUI();
  });
  updateCartCounts(els);
}

function onCategorySelect(label){
  state.activeCategory = label;
  syncCategoryButtons();
  refreshCatalogUI();
  closeDrawers(els);
}

function openModalById(id){
  const index = state.filtered.findIndex(function(p){ return p.id === id; });
  if(index === -1) return;
  openModal(state.filtered[index], index);
}

function renderCurrentModalImage(product){
  renderModalMainImage(els, product, state.currentModalImage);
  renderModalGallery(els, product, state.currentModalImage, function(url){
    setCurrentModalImage(url);
    renderCurrentModalImage(product);
  });
}

function openModal(product, index){
  openModalState(product, index);
  fillModalData(els, product);
  renderCurrentModalImage(product);

  els.modalCarrito.onclick = function(){
    addToCart(product.id);
    refreshCartUI();
    closeModalFn();
  };

  updateModalNav(els);
  showModal(els);
}

function closeModalFn(){
  hideModal(els);
  closeModalState();
}

function goToModalSibling(direction){
  const sibling = getModalSibling(direction);
  if(!sibling) return;
  openModal(sibling.product, sibling.index);
}

function sendCartToWhatsApp(){
  if(!state.pedido.length){
    alert("No hay productos seleccionados.");
    return;
  }

  const msg = encodeURIComponent(
    "Hola, me interesan estos productos del catálogo:\n" +
    state.pedido.map(function(p){
      return "- " + p.name + " (Código: " + p.code + ")";
    }).join("\n")
  );

  window.open("https://wa.me/" + CONFIG.phone + "?text=" + msg, "_blank");
}

async function loadProducts(){
  showLoader(els);

  try{
    const products = await fetchProducts();
    setProducts(products);

    renderCategoryButtons(els, onCategorySelect);
    refreshCatalogUI();
    refreshCartUI();
  }catch(err){
    console.error(err);
    showLoadError(els);
  }finally{
    hideLoader(els);
  }
}

function bindEvents(){
  els.closeModal.addEventListener("click", closeModalFn);

  els.modalBack.addEventListener("click", function(e){
    if(e.target === els.modalBack) closeModalFn();
  });

  els.modalPrevBtn.addEventListener("click", function(){
    goToModalSibling(-1);
  });

  els.modalNextBtn.addEventListener("click", function(){
    goToModalSibling(1);
  });

  els.sendCartBtn.addEventListener("click", sendCartToWhatsApp);
  els.sendCartBtnMobile.addEventListener("click", sendCartToWhatsApp);

  els.clearCartBtn.addEventListener("click", function(){
    clearCart();
    refreshCartUI();
  });

  els.clearCartBtnMobile.addEventListener("click", function(){
    clearCart();
    refreshCartUI();
  });

  els.openCatsFab.addEventListener("click", function(){
    openDrawer(els.catsDrawerBack);
  });

  els.openCartFab.addEventListener("click", function(){
    openDrawer(els.cartDrawerBack);
  });

  els.closeCatsDrawer.addEventListener("click", function(){
    closeDrawer(els.catsDrawerBack);
  });

  els.closeCartDrawer.addEventListener("click", function(){
    closeDrawer(els.cartDrawerBack);
  });

  els.catsDrawerBack.addEventListener("click", function(e){
    if(e.target === els.catsDrawerBack) closeDrawer(els.catsDrawerBack);
  });

  els.cartDrawerBack.addEventListener("click", function(e){
    if(e.target === els.cartDrawerBack) closeDrawer(els.cartDrawerBack);
  });

  els.searchInput.addEventListener("input", function(){
    refreshCatalogUI();
  });

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      closeModalFn();
      closeDrawers(els);
    }

    if(els.modalBack.style.display === "flex"){
      if(e.key === "ArrowLeft"){
        goToModalSibling(-1);
      }
      if(e.key === "ArrowRight"){
        goToModalSibling(1);
      }
    }
  });
}

function init(){
  renderLogo(els);
  renderSocials(els.socialBlock);
  renderSocials(els.socialBlockMobile);
  refreshCartUI();
  bindEvents();
  loadProducts();
}

init();
