let cardContainer = document.querySelector(".card-container");
let campoBusca = document.getElementById("input-busca");
let btnLimpar = document.getElementById("btn-limpar");
let dados = [];

async function iniciarBusca() {
    if (dados.length === 0) {
        try {
            let resposta = await fetch("dados.json");
            if (!resposta.ok) throw new Error("Erro HTTP");
            dados = await resposta.json();
        } catch (error) {
            console.error(error);
            cardContainer.innerHTML = "<p style='grid-column:1/-1; text-align:center'>Erro ao carregar dados. Use Live Server.</p>";
            return;
        }
    }

    const termoOriginal = campoBusca.value;
    const termoBusca = termoOriginal.toLowerCase().trim();

    toggleBtnLimpar(termoBusca);

    if (termoBusca === "") {
        cardContainer.innerHTML = "";
        return;
    }

    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        (dado.tags && dado.tags.some(tag => tag.toLowerCase().includes(termoBusca)))
    );

    renderizarCards(dadosFiltrados, termoBusca);
}

function renderizarCards(listaDados, termoDestaque = "") {
    cardContainer.innerHTML = "";

    if (listaDados.length === 0) {
        cardContainer.innerHTML = `
            <div class="no-results">
                <h3>Nenhum resultado para "${campoBusca.value}"</h3>
                <p>Tente palavras mais genéricas como "água" ou "reciclagem".</p>
            </div>
        `;
        return;
    }

    for (let dado of listaDados) {
        let article = document.createElement("article");
        article.classList.add("card");

        const destacar = (texto) => {
            if (!termoDestaque) return texto;
            const regex = new RegExp(`(${termoDestaque})`, 'gi');
            return texto.replace(regex, '<span class="highlight-text">$1</span>');
        };

        article.innerHTML = `
            <div class="card-content">
                <span class="card-date">${dado.data_criacao}</span>
                <h2>${destacar(dado.nome)}</h2>
                <p>${destacar(dado.descricao)}</p>
                <div class="btn-link" style="margin-top:10px; cursor:pointer; color:#2c5c38; font-weight:600; hover:#3D5535;">Saiba mais ↗</div>
            </div>
        `;

        article.addEventListener('click', () => abrirModal(dado));
        cardContainer.appendChild(article);
    }
}

function filtrarPorTag(tag) {
    campoBusca.value = tag;
    iniciarBusca();
}

function limparBusca() {
    campoBusca.value = "";
    btnLimpar.style.display = "none";
    cardContainer.innerHTML = "";
    campoBusca.focus();
}

function toggleBtnLimpar(valor) {
    btnLimpar.style.display = valor.length > 0 ? "block" : "none";
}

campoBusca.addEventListener('input', () => {
    toggleBtnLimpar(campoBusca.value);
});

async function verTodos() {
    campoBusca.value = "";
    btnLimpar.style.display = "none";

    if (dados.length === 0) {
        try {
            let resposta = await fetch("dados.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            return;
        }
    }

    renderizarCards(dados);
}

campoBusca.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        iniciarBusca();
    }
});