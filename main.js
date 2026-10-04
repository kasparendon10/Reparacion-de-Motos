/* ============================================
   CONFIGURACIÓN: cambia solo estos datos
   ============================================ */
const CONFIG = {
  // Número en formato internacional, sin "+" ni espacios (57 = Colombia)
  whatsapp: "+57 302 8378703",
  // Horario de atención (hora de Bogotá). Días: 0 = domingo ... 6 = sábado
  openDays: [1, 2, 3, 4, 5, 6],
  openHour: 8,
  closeHour: 18,
  timeZone: "America/Bogota"
};
 
/* 1. Enlaces de WhatsApp con mensaje prellenado */
function buildWhatsAppLink(message) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(message);
}
 
document.querySelectorAll("[data-wa]").forEach(function (el) {
  const message = el.dataset.msg || "Hola, quiero cotizar un servicio para mi moto.";
  el.href = buildWhatsAppLink(message);
  el.target = "_blank";
  el.rel = "noopener";
});
 
/* 2. Estado del taller: abierto o cerrado ahora */
function updateStatus() {
  const badge = document.getElementById("status");
  if (!badge) return;
 
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.timeZone,
      weekday: "short",
      hour: "numeric",
      hour12: false
    }).formatToParts(new Date());
 
    const weekdayName = parts.find(function (p) { return p.type === "weekday"; }).value;
    const hour = parseInt(parts.find(function (p) { return p.type === "hour"; }).value, 10) % 24;
    const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayName);
 
    const isOpen = CONFIG.openDays.indexOf(dayIndex) !== -1 &&
                   hour >= CONFIG.openHour && hour < CONFIG.closeHour;
 
    badge.textContent = isOpen ? "Abierto ahora" : "Cerrado, escríbenos y te respondemos";
    badge.classList.toggle("open", isOpen);
    badge.classList.toggle("closed", !isOpen);
  } catch (e) {
    badge.textContent = "Taller en Bogotá";
  }
}
updateStatus();
 
/* 3. Ocultar el botón flotante cuando ya se ve el botón del cierre */
const fab = document.getElementById("fab");
const closing = document.getElementById("contacto");
 
if (fab && closing && "IntersectionObserver" in window) {
  new IntersectionObserver(function (entries) {
    fab.classList.toggle("hide", entries[0].isIntersecting);
  }, { threshold: 0.35 }).observe(closing);
}
 
/* 4. Año del pie de página */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();