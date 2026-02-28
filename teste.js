(() => {
  "use strict";

  // --- FUNÇÃO AUXILIAR PARA EVITAR ERROS ---
  // Só executa o código se o elemento existir na página
  const executeIfElementExists = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) callback(el);
  };

  // --- CARROSSEL E MODAL (UNIFICADOS) ---
  // Variáveis globais de controle para esta seção
  let currentIndex = 0;
  let currentModalIndex = 0;

  const initCarousel = () => {
    const track = document.getElementById('track');
    const images = document.querySelectorAll('.card img');
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("imgExpanded");
    const captionText = document.getElementById("caption");

    if (!track) return; // Sai se não estiver na página da galeria

    // Expõe as funções para o HTML (necessário por causa do onclick)
    window.moveSlide = (direction) => {
      const cardWidth = document.querySelector('.card').offsetWidth + 20;
      const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
      currentIndex += direction;
      let currentPosition = currentIndex * cardWidth;

      if (currentPosition < 0) { currentIndex = 0; currentPosition = 0; }
      else if (currentPosition > maxScroll) { currentIndex = 0; currentPosition = 0; }

      track.style.transform = `translateX(-${currentPosition}px)`;
    };

    window.openModal = (index) => {
      modal.style.display = "flex";
      currentModalIndex = index;
      updateModalImage();
    };

    window.closeModal = () => { modal.style.display = "none"; };

    window.changeModalImg = (direction) => {
      currentModalIndex += direction;
      if (currentModalIndex >= images.length) currentModalIndex = 0;
      else if (currentModalIndex < 0) currentModalIndex = images.length - 1;
      updateModalImage();
    };

    const updateModalImage = () => {
      const img = images[currentModalIndex];
      if (img) {
        modalImg.src = img.src;
        captionText.innerHTML = img.alt;
      }
    };

    // Fechar modal ao clicar fora
    window.onclick = (event) => { if (event.target == modal) closeModal(); };

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === "flex") {
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowLeft") changeModalImg(-1);
        if (e.key === "ArrowRight") changeModalImg(1);
      }
    });
  };

  // --- OUTRAS FUNÇÕES (MENU, FORM, ETC) ---

  const initMenu = () => {
    executeIfElementExists(".menu-toggle", (btn) => {
      btn.addEventListener("click", () => {
        document.querySelector(".menu-mobile").classList.toggle("active");
      });
    });

    document.addEventListener("click", (e) => {
      const menu = document.querySelector(".menu-mobile");
      const toggle = document.querySelector(".menu-toggle");
      if (menu && toggle && !toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("active");
      }
    });
  };

  const initCardsServico = () => {
    const cards = document.querySelectorAll(".card-servico");
    executeIfElementExists(".btn-verMais", (btn) => {
      cards.forEach((card, i) => { if (i >= 3) card.style.display = "none"; });
      btn.addEventListener("click", function() {
        cards.forEach((card, i) => { if (i >= 3) card.style.display = "block"; });
        this.textContent = (this.textContent === "Ver mais") ? "Ver menos" : "Ver mais";
      });
    });
  };

  const initFormContato = () => {
    executeIfElementExists("#form-contato", (form) => {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        const btn = document.querySelector("#btn-from-contato");
        btn.innerHTML = 'Enviando...';
        
        // Coleta de dados e Fetch (seu código original aqui...)
        // Lembre-se de verificar se os inputs existem antes de pegar o .value
      });
    });
  };

  // --- INICIALIZAÇÃO GERAL ---
  document.addEventListener("DOMContentLoaded", () => {
    initCarousel();
    initMenu();
    initCardsServico();
    initFormContato();
    
    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      });
    });
  });

  // Função global
  window.scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

})();