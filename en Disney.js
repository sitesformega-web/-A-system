import { fetchProducts } from "./veni aprende.js";
import { setProducts, getFiltered, filterProducts } from "./bicho culero.js";
import { renderProducts } from "./Nos vimos.js";

const grid = document.getElementById("grid");
const search = document.getElementById("searchInput");

async function init(){
  try{
    const data = await fetchProducts();

    setProducts(data);

    renderProducts(grid, getFiltered());
  }catch(e){
    console.error(e);
  }
}

search.addEventListener("input", () => {
  const list = filterProducts(search.value);
  renderProducts(grid, list);
});

init();