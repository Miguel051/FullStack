// ---------- TRANSICIONES Y NAV ----------
document.addEventListener("DOMContentLoaded", () => {
  // mostrar con transición
  const page = document.querySelector(".page-fade");
  if (page) page.classList.add("is-visible");

  // sombra nav si hace scroll (ejecutar una vez al inicio)
  toggleNavShadow();
});

window.addEventListener("scroll", toggleNavShadow);
function toggleNavShadow() {
  const nav = document.querySelector(".nav-main");
  if (!nav) return;
  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
}

// ---------- REDIRECCIÓN LOGIN (con transición) ----------
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
  btnLogin.addEventListener("click", (e) => {
    // si es un anchor con href (fallback), igual manejamos la transición
    e.preventDefault();
    const href = btnLogin.getAttribute("href") || "login.html";

    const page = document.querySelector(".page-fade");
    if (page) page.classList.remove("is-visible");

    setTimeout(() => {
      window.location.href = href;
    }, 350); // tiempo para que la transición sea visible
  });
}

// ---------- OVERLAY DE BÚSQUEDA (BÚSQUEDA INTERNA Y RESALTADO) ----------
const btnSearch = document.getElementById("btnSearch");
const searchOverlay = document.getElementById("searchOverlay");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const searchResults = document.getElementById("searchResults");

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add("open");
  searchOverlay.setAttribute("aria-hidden", "false");
  setTimeout(() => searchInput && searchInput.focus(), 50);
}
function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove("open");
  searchOverlay.setAttribute("aria-hidden", "true");
  clearHighlights();
  if (searchResults) searchResults.textContent = "";
  if (searchInput) searchInput.value = "";
}

btnSearch &&
  btnSearch.addEventListener("click", (e) => {
    e.preventDefault();
    openSearch();
  });
searchClose && searchClose.addEventListener("click", closeSearch);

// Cerrar clic en sombra
searchOverlay &&
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

// Tecla ESC cierra
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    searchOverlay &&
    searchOverlay.classList.contains("open")
  ) {
    closeSearch();
  }
});

// Eliminar clases highlight previas
function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((el) => {
    el.classList.remove("highlight");
  });
}

// Realiza la búsqueda dentro de la página y resalta contenedores
function performSearch(query) {
  clearHighlights();
  if (!query) {
    if (searchResults)
      searchResults.textContent = "Escribe una palabra clave para buscar.";
    return;
  }
  const q = query.toLowerCase().trim();

  // Elementos a inspeccionar (secciones principales)
  const scope = document.querySelectorAll(
    "header.showcase, section.about-section, section.services-section, section#proyectos, section#trabaja, section#contacto"
  );

  let firstMatch = null;
  let count = 0;

  scope.forEach((container) => {
    // buscamos en elementos de texto y también en tarjetas
    const items = container.querySelectorAll(
      "h1, h2, h3, p, li, blockquote, .service-card, .about-text, .contact-info, .contact-form"
    );
    items.forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      if (text.includes(q)) {
        count++;
        // preferimos resaltar el contenedor lógico si existe
        const highlightTarget =
          el.closest(".service-card") ||
          el.closest(".about-text") ||
          el.closest(".contact-info") ||
          el.closest(".contact-form") ||
          el;
        highlightTarget.classList.add("highlight");
        if (!firstMatch) firstMatch = highlightTarget;
      }
    });
  });

  if (count > 0) {
    // Scroll a la primera coincidencia
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    if (searchResults) {
      searchResults.textContent = `Se encontraron ${count} resultado${
        count !== 1 ? "s" : ""
      }. Mostrando la primera coincidencia.`;
    }
  } else {
    if (searchResults)
      searchResults.textContent =
        "No se encontraron resultados. Prueba otra palabra.";
  }
}

// Submit del form de búsqueda
searchForm &&
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = (searchInput?.value || "").trim();
    performSearch(q);
  });
