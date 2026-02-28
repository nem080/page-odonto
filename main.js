(() => {
    "use strict";

    // --- 1. CONTROLE DOS CARDS DE SERVIÇO (VER MAIS / VER MENOS) ---
    function initServiceCards() {
        const cards = document.querySelectorAll(".card-servico");
        const btn = document.querySelector(".btn-verMais");

        if (!btn) return;

        // Esconde cards iniciais (acima de 3)
        cards.forEach((card, index) => {
            if (index >= 3) card.style.display = "none";
        });

        btn.addEventListener("click", function () {
            const estaFechado = this.textContent === "Ver mais";

            if (estaFechado) {
                // Expandir
                cards.forEach((card, index) => {
                    if (index >= 3) card.style.display = "block";
                });
                this.textContent = "Ver menos";
            } else {
                // Recolher
                cards.forEach((card, index) => {
                    if (index >= 3) card.style.display = "none";
                });
                this.textContent = "Ver mais";
                // Opcional: faz scroll de volta para o topo da seção ao fechar
                document.getElementById('servico').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 2. MENU MOBILE ---
    function initMenuMobile() {
        const menuToggle = document.querySelector(".menu-toggle");
        const menuMobile = document.querySelector(".menu-mobile");

        if (!menuToggle || !menuMobile) return;

        menuToggle.addEventListener("click", () => {
            menuMobile.classList.toggle("active");
        });

        // Fecha ao clicar fora
        document.addEventListener("click", (e) => {
            if (!menuToggle.contains(e.target) && !menuMobile.contains(e.target)) {
                menuMobile.classList.remove("active");
            }
        });

        // Fecha ao clicar em link
        document.querySelectorAll(".menu-mobile ul li a").forEach(link => {
            link.addEventListener("click", () => {
                menuMobile.classList.remove("active");
            });
        });
    }

    // --- 3. BLOG (CONTINUAR LENDO) ---
    function initBlogReadMore() {
        const conteudoOculto = document.querySelector(".ocultar");
        const btnBlog = document.querySelector("#btn-blog");

        if (!btnBlog || !conteudoOculto) return;

        btnBlog.addEventListener("click", () => {
            const ativo = conteudoOculto.classList.toggle("ativo");
            if (ativo) {
                conteudoOculto.style.display = "block";
                btnBlog.textContent = "Ler menos";
            } else {
                conteudoOculto.style.display = "none";
                btnBlog.textContent = "Continuar a ler...";
            }
        });
    }

    // --- 4. FORMULÁRIO ---
// --- 4. FORMULÁRIO (CONEXÃO DIRETA COM GOOGLE SHEETS) ---
function initForm() {
    const form = document.querySelector("#form-contato");
    const btn = document.querySelector("#btn-from-contato");
    const resposta = document.querySelector(".resposta-from");

    if (!form || !btn) return;

    // Substitua pela URL que o Google Apps Script te deu (ou mantenha a do SheetMonkey)
    const scriptURL = "https://script.google.com/macros/s/AKfycbxuDMNG5lnmGLCDHo0pIM8V2G44ZqGBltAgk5L1tqgbhErpLpEaaKpcdI8G-SkvJP9J/exec"; 

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Feedback visual imediato
        btn.disabled = true;
        btn.innerHTML = 'Enviando...';

        // FormData pega automaticamente os campos baseados no atributo 'name' do HTML
        const formData = new FormData(form);

        fetch(scriptURL, { 
            method: "POST", 
            body: formData 
        })
        .then(response => {
            // Sucesso
            resposta.innerHTML = "Agendamento solicitado! Entraremos em contato.";
            resposta.style.display = "block";
            resposta.style.color = "#023a7f"; // Cor do seu consultório
            
            form.reset();
            btn.innerHTML = "Enviar";
            btn.disabled = false;

            // Recarrega após 3 segundos como você já fazia
            setTimeout(() => {
                resposta.style.display = "none";
                // location.reload(); // Opcional: recarregar a página
            }, 3000);
        })
        .catch(error => {
            // Erro
            console.error('Erro ao enviar!', error.message);
            resposta.innerHTML = "Erro ao enviar. Tente novamente ou ligue-nos.";
            resposta.style.color = "red";
            resposta.style.display = "block";
            btn.disabled = false;
            btn.innerHTML = "Tentar novamente";
        });
    });
}
// fim envio contato

    // --- INICIALIZAÇÃO GERAL ---
    document.addEventListener("DOMContentLoaded", () => {
        initServiceCards();
        initMenuMobile();
        initBlogReadMore();
        initForm();
        
        // Scroll Suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
            });
        });
    });

})();

// --- 5. SEÇÃO DE IMAGENS E MODAL ---
const track = document.getElementById('track');
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("imgExpanded");
const captionText = document.getElementById("caption");

let currentIndex = 0;
let currentModalIndex = 0;

// Tornar as funções globais para o HTML acessar (necessário para type="module")
window.openModal = function(index) {
    const images = document.querySelectorAll('.card img');
    if (!images[index]) return;
    
    modal.style.display = "flex";
    currentModalIndex = index;
    modalImg.src = images[index].src;
    captionText.innerHTML = images[index].alt;
};

window.closeModal = function() {
    modal.style.display = "none";
};

window.changeModalImg = function(direction) {
    const images = document.querySelectorAll('.card img');
    currentModalIndex += direction;
    
    if (currentModalIndex >= images.length) currentModalIndex = 0;
    if (currentModalIndex < 0) currentModalIndex = images.length - 1;
    
    modalImg.src = images[currentModalIndex].src;
    captionText.innerHTML = images[currentModalIndex].alt;
};

window.moveSlide = function(direction) {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 20; // largura + gap
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
    const maxIndex = cards.length - visibleCards;

    currentIndex += direction;

    // Lógica para não ultrapassar os limites
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const currentPosition = currentIndex * cardWidth;
    track.style.transform = `translateX(-${currentPosition}px)`;
};

// Fechar ao clicar fora da imagem
window.addEventListener('click', (event) => {
    if (event.target == modal) window.closeModal();
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (modal.style.display === "flex") {
        if (e.key === "Escape") window.closeModal();
        if (e.key === "ArrowLeft") window.changeModalImg(-1);
        if (e.key === "ArrowRight") window.changeModalImg(1);
    }
});
