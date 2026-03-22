export function escapeHtml(str){
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

export function truncate(text,max){
  if(!text) return "";
  return text.length > max ? text.slice(0,max)+'...' : text;
}