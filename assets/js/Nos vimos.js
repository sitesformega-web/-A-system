import { CONFIG } from "./asi.js";
import { fixImageUrl, escapeHtml, truncateText } from "./agarrame aca.js";
import { state } from "./bicho culero.js";

export function renderLogo(els){
  const logoWrap = els.logoWrap;
  const footerText = els.footerText;

  footerText.textContent = CONFIG.footerText || ((CONFIG.brandName || "ASTREA") + " © 2026");

  const logoUrl = fixImageUrl(CONFIG.logoUrl || "");
  const logoLink = String(CONFIG.logoLink || "").trim();

  if(!logoUrl){
    renderLogoFallback(logoWrap);
    return;
  }

  const img = new Image();

  img.onload = function(){
    const safeUrl = escapeHtml(logoUrl);
    const safeAlt = escapeHtml(CONFIG.brandName || CONFIG.brandTitle || "Logo");

    const imgHtml = '<img class="logo-img" src="' + safeUrl + '" alt="' + safeAlt + '">';
    logoWrap.innerHTML = logoLink
      ? '<a class="logo-link" href="' + escapeHtml(logoLink) + '" target="_blank" rel="noopener">' + imgHtml + '</a>'
      : imgHtml;
  };

  img.onerror = function(){
    renderLogoFallback(logoWrap);
  };

  img.src = logoUrl;
}

function renderLogoFallback(logoWrap){
  const title = String(CONFIG.brandTitle || CONFIG.brandName || "ASTREA Catálogo").trim();
  logoWrap.innerHTML = '<div class="logo-fallback">' + escapeHtml(title) + '</div>';
}

function socialIcon(name){
  if(name === "instagram"){
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"></rect>
        <circle cx="12" cy="12" r="4"></circle>
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"></circle>
      </svg>
    `;
  }

  if(name === "facebook"){
    return `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.2-1.5 1.5-1.5H16V5.1c-.2 0-.9-.1-1.8-.1-2.2 0-3.7 1.3-3.7 3.9V11H8v3h2.5v7h3z"/>
      </svg>
    `;
  }

  if(name === "tiktok"){
    return `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.8 3c.4 1.8 1.5 3.1 3.2 3.8v2.5c-1.2 0-2.3-.4-3.2-1v5.1c0 3-2.4 5.2-5.3 5.2S4.2 16.4 4.2 13.5s2.4-5.2 5.3-5.2c.2 0 .5 0 .7.1V11a3.1 3.1 0 0 0-.7-.1c-1.4 0-2.5 1.1-2.5 2.6S8.1 16 9.5 16s2.5-1.1 2.5-2.6V3h2.8z"/>
      </svg>
    `;
  }

  return "★";
}

export function renderSocials(container){
  const socials = CONFIG.socials || {};
  const entries = Object.keys(socials).filter(function(key){
    return String(socials[key] || "").trim();
  });

  if(!entries.length){
    container.innerHTML = "";
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = `
    <div class="panel-kicker dark" style="margin-bottom:12px;">
      <span class="icon-dot"></span>
      <span>Redes</span>
    </div>
    <div class="social-grid">
      ${entries.map(function(key){
        return `
          <a
            class="social-link"
            href="${escapeHtml(socials[key])}"
            target="_blank"
            rel="noopener"
            aria-label="${escapeHtml(key)}"
            title="${escapeHtml(key)}"
          >
            ${socialIcon(key)}
          </a>
        `;
      }).join("")}
    </div>
  `;
}

export function renderCategoryButtons(els, onSelect){
  const cats = Array.from(
    new Set(state.products.map(function(p){ return p.category; }).filter(Boolean))
  ).sort();

  els.categoryButtons.innerHTML = "";
  els.categoryButtonsMobile.innerHTML = "";

  function makeBtn(label){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (label === state.activeCategory ? " active" : "");
    btn.textContent = label;
    btn.addEventListener("click", function(){
      onSelect(label);
    });
    return btn;
  }

  ["Todas"].concat(cats).forEach(function(label){
    els.categoryButtons.appendChild(makeBtn(label));
    els.categoryButtonsMobile.appendChild(makeBtn(label));
  });
}

export function syncCategoryButtons(){
  document.querySelectorAll(".chip").forEach(function(btn){
    btn.classList.toggle("active", btn.textContent === state.activeCategory);
  });
}

export function renderList(els, list, handlers){
  els.grid.innerHTML = "";
  els.countSpan.textContent = list.length;

  if(!list.length){
    els.grid.innerHTML = '<div class="empty-state">No se encontraron productos.</div>';
    return;
  }

  list.forEach(function(p){
    const card = document.createElement("article");
    card.className = "product-card";
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="product-top">
        <div class="product-meta">
          <span class="icon-dot"></span>
          <span class="product-category">${escapeHtml(p.category || "Sin categoría")}</span>
        </div>
        <button class="fav-star" type="button" aria-label="Destacado">★</button>
      </div>

      <h3 class="product-title">${escapeHtml(p.name)}</h3>

      <div class="product-figure">
        ${p.img ? `<img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}">` : `<div class="muted">${escapeHtml(p.code || p.name)}</div>`}
      </div>

      <p class="product-desc">${escapeHtml(truncateText(p.desc || "Sin descripción.", 120))}</p>

      <div class="product-actions">
        <button class="btn btn-primary btn-detail" type="button">Detalles</button>
      </div>
    `;

    card.addEventListener("click", function(e){
      if(!e.target.closest("button") || e.target.classList.contains("btn-detail")){
        handlers.openModalById(p.id);
      }
    });

    card.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        handlers.openModalById(p.id);
      }
    });

    els.grid.appendChild(card);
  });
}

export function renderModalMainImage(els, product, imageUrl){
  if(imageUrl){
    els.mThumb.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(product.name)}">`;
  } else {
    els.mThumb.innerHTML = `<div class="muted">${escapeHtml(product.code || product.name)}</div>`;
  }
}

export function renderModalGallery(els, product, activeImage, onThumbClick){
  const gallery = product.gallery && product.gallery.length
    ? product.gallery
    : (product.img ? [product.img] : []);

  els.mGallery.innerHTML = "";

  gallery.forEach(function(url){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "modal-thumb" + (url === activeImage ? " active" : "");
    btn.innerHTML = `<img src="${escapeHtml(url)}" alt="${escapeHtml(product.name)}">`;
    btn.addEventListener("click", function(){
      onThumbClick(url);
    });
    els.mGallery.appendChild(btn);
  });
}

export function fillModalData(els, product){
  els.mTitle.textContent = product.name || "Producto";
  els.mDesc.textContent = product.desc || "Sin descripción.";
  els.mCode.textContent = product.code || "-";
  els.mCat.textContent = product.category || "Sin categoría";
  els.mStock.textContent = product.stock || "N/D";
}

export function showModal(els){
  els.modalBack.style.display = "flex";
  els.modalBack.setAttribute("aria-hidden", "false");
}

export function hideModal(els){
  els.modalBack.style.display = "none";
  els.modalBack.setAttribute("aria-hidden", "true");
}

export function updateModalNav(els){
  const total = state.filtered.length;
  els.modalPrevBtn.style.display = total > 1 ? "flex" : "none";
  els.modalNextBtn.style.display = total > 1 ? "flex" : "none";
}

export function renderCartTo(container, onRemove){
  container.innerHTML = "";

  if(!state.pedido.length){
    container.innerHTML = '<div class="cart-empty">No hay productos seleccionados todavía.</div>';
    return;
  }

  state.pedido.forEach(function(item){
    const li = document.createElement("li");
    li.className = "cart-item";
    li.style.listStyle = "none";
    li.style.paddingLeft = "12px";

    li.innerHTML = `
      <div>
        <div class="cart-name">${escapeHtml(item.name)}</div>
        <div class="cart-code">Código: ${escapeHtml(item.code || "-")}</div>
      </div>
      <button class="btn btn-primary" type="button" style="padding:9px 12px;border-radius:12px;">Quitar</button>
    `;

    li.querySelector("button").addEventListener("click", function(){
      onRemove(item.id);
    });

    container.appendChild(li);
  });
}

export function updateCartView(els, onRemove){
  renderCartTo(els.cartItems, onRemove);
  renderCartTo(els.cartItemsMobile, onRemove);
}

export function updateCartCounts(els){
  els.cartCountFab.textContent = state.pedido.length;
}

export function showLoader(els){
  els.loader.style.display = "flex";
}

export function hideLoader(els){
  els.loader.style.display = "none";
}

export function showLoadError(els){
  els.grid.innerHTML = '<div class="empty-state">No se pudieron cargar los productos.</div>';
}

export function openDrawer(backEl){
  backEl.style.display = "flex";
  backEl.setAttribute("aria-hidden", "false");
}

export function closeDrawer(backEl){
  backEl.style.display = "none";
  backEl.setAttribute("aria-hidden", "true");
}

export function closeDrawers(els){
  closeDrawer(els.catsDrawerBack);
  closeDrawer(els.cartDrawerBack);
}
