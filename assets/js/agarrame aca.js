export function fixImageUrl(url){
  if(!url) return "";
  if(url.includes("github.com") && url.includes("/blob/")){
    return url
      .replace("github.com","raw.githubusercontent.com")
      .replace("/blob/","/")
      .replace("?raw=true","");
  }
  return url;
}

export function splitGallery(value){
  return String(value || "")
    .split(/\r?\n/)
    .map(function(s){ return s.trim(); })
    .filter(Boolean);
}

export function uniq(arr){
  const map = {};
  const out = [];

  arr.forEach(function(item){
    const clean = String(item || "").trim();
    if(clean && !map[clean]){
      map[clean] = true;
      out.push(clean);
    }
  });

  return out;
}

export function truncateText(text, max){
  const value = String(text || "").trim();
  if(value.length <= max) return value;
  return value.slice(0, max).trim() + "...";
}

export function escapeHtml(str){
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
