let products = [];
let filtered = [];

export function setProducts(data){
  products = data;
  filtered = data;
}

export function getProducts(){
  return products;
}

export function getFiltered(){
  return filtered;
}

export function filterProducts(query){
  const q = query.toLowerCase();

  filtered = products.filter(p =>
    (p.Nombre || '').toLowerCase().includes(q)
  );

  return filtered;
}