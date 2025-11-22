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
