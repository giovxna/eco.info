let cardContainer = document.querySelector(".card-container");
let campoBusca = document.getElementById("input-busca");
let btnLimpar = document.getElementById("btn-limpar");
let dados = [];

async function iniciarBusca() {
    if (dados.length === 0) {
        try {
            let resposta = await fetch("./assets/js/dados.json");
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
            let resposta = await fetch("./assets/js/dados.json");
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

const modal = document.getElementById('infoModal');

function abrirModal(dado) {
    document.getElementById('modalTitle').innerText = dado.nome;
    document.getElementById('modalDate').innerText = "Publicado em: " + dado.data_criacao;
    document.getElementById('modalDesc').innerText = dado.descricao;

    let linkBtn = document.getElementById('modalLink');
    if (dado.link_oficial && dado.link_oficial !== "#") {
        linkBtn.href = dado.link_oficial;
        linkBtn.style.display = "inline-block";
    } else {
        linkBtn.style.display = "none";
    }

    const tagsDiv = document.getElementById('modalTags');
    tagsDiv.innerHTML = '';
    if (dado.tags) {
        dado.tags.forEach(tag => {
            let span = document.createElement('span');
            span.className = 'tag-modal';
            span.innerText = tag;
            span.style.background = "#EDF3EB";
            span.style.padding = "4px 10px";
            span.style.borderRadius = "15px";
            span.style.marginRight = "5px";
            span.style.fontSize = "0.8rem";
            span.style.color = "#3D5535";
            tagsDiv.appendChild(span);
        });
    }
    modal.classList.add('active');
}

function fecharModal() {
    modal.classList.remove('active');
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
});

const campanhasData = [
    { 
        nome: "Limpeza e Preservação dos Rios", 
        categoria: "Preservação Hídrica", 
        desc: `A preservação dos rios é vital para a sobrevivência humana e biodiversidade.\n\n1. O Problema do Plástico:\nMicroplásticos são ingeridos por peixes e acabam na nossa mesa. Evite plásticos de uso único.\n\n2. Mata Ciliar:\nA vegetação nas margens protege a água de terra e lixo. Nunca desmate a beira de um rio.\n\n3. Óleo de Cozinha:\nNunca jogue óleo na pia. 1 litro de óleo pode contaminar até 25 mil litros de água.`, 
        link: "#", 
        tags: ["Água", "Rios", "Natureza"] 
    },
    { 
        nome: "Jardins Florestais e Polinizadores", 
        categoria: "Biodiversidade", 
        desc: `Criar um jardim florestal significa imitar a natureza.\n\nImportância dos Polinizadores:\nAbelhas e borboletas são responsáveis pela reprodução de 80% das plantas.\n\nDicas Práticas:\n- Plante flores nativas.\n- Evite pesticidas químicos.\n- Deixe água rasa disponível para as abelhas.`, 
        link: "#", 
        tags: ["Jardim", "Abelhas", "Plantas"] 
    },
    { 
        nome: "Guia Definitivo da Reciclagem", 
        categoria: "Resíduos", 
        desc: `Reciclar é o último passo. Antes: Reduzir e Reutilizar.\n\n1. Lave as embalagens:\nRestos de comida contaminam o lote. Passe uma água rápida.\n\n2. O que NÃO vai no reciclável:\n- Papel engordurado (caixa de pizza).\n- Espelhos.\n- Cerâmicas.\n\n3. Separe por cor:\nVidros transparentes separados dos coloridos ajudam as cooperativas.`, 
        link: "#", 
        tags: ["Reciclagem", "Lixo Zero", "Guia"] 
    },
    { 
        nome: "Eficiência Energética em Casa", 
        categoria: "Recursos", 
        desc: `Pequenas mudanças geram grande economia na conta e no planeta.\n\n1. Aparelhos em Standby:\nTire da tomada! O 'modo de espera' pode representar 12% do consumo.\n\n2. Iluminação:\nTroque lâmpadas antigas por LED (são 80% mais econômicas).\n\n3. Eletrodomésticos:\nPrefira sempre equipamentos com o selo Procel A de eficiência.`, 
        link: "#", 
        tags: ["Energia", "Economia", "Casa"] 
    },
    { 
        nome: "Compostagem Doméstica", 
        categoria: "Sustentabilidade em Casa", 
        desc: `Mais de 50% do nosso lixo é orgânico e pode virar adubo em vez de gerar gás metano em aterros.\n\nO que pode ir na composteira:\n- Cascas de frutas e legumes.\n- Borra de café e filtro de papel.\n- Cascas de ovos.\n\nO que NÃO pode:\n- Carnes e laticínios (atraem pragas).\n- Frutas cítricas em excesso (alteram o pH).\n- Fezes de animais domésticos.`, 
        link: "#", 
        tags: ["Compostagem", "Orgânico", "Adubo"] 
    },
    { 
        nome: "Descarte de Lixo Eletrônico", 
        categoria: "Resíduos Perigosos", 
        desc: `Eletrônicos contêm metais pesados (chumbo, mercúrio) que contaminam o solo.\n\nO que separar:\n- Celulares antigos e cabos.\n- Pilhas e baterias.\n- Placas de computador.\n\nOnde levar:\nNunca jogue no lixo comum. Procure pontos de coleta em supermercados ou farmácias ("Logística Reversa").`, 
        link: "#", 
        tags: ["E-lixo", "Tecnologia", "Metais"] 
    },
    { 
        nome: "Moda Sustentável (Slow Fashion)", 
        categoria: "Consumo Consciente", 
        desc: `A indústria têxtil é uma das mais poluentes do mundo.\n\nO problema do Poliéster:\nTecidos sintéticos liberam microplásticos na lavagem que vão para os oceanos.\n\nComo ajudar:\n- Compre menos e com mais qualidade.\n- Apoie brechós e segunda mão.\n- Prefira tecidos naturais (algodão, linho) e orgânicos.`, 
        link: "#", 
        tags: ["Moda", "Roupas", "Têxtil"] 
    },
    { 
        nome: "Captação de Água da Chuva", 
        categoria: "Economia Hídrica", 
        desc: `Aproveitar a água da chuva reduz o uso de água tratada para fins não potáveis.\n\nComo usar:\n- Lavar calçadas e carros.\n- Regar plantas e jardins.\n- Descarga de vasos sanitários.\n\nCuidado importante:\nMantenha o reservatório sempre vedado e com cloro para evitar a proliferação do mosquito da dengue.`, 
        link: "#", 
        tags: ["Chuva", "Reuso", "Cisterna"] 
    }
];

function abrirModalCampanha(index) {
    if (campanhasData[index]) {
        abrirModal({
            nome: campanhasData[index].nome,
            data_criacao: campanhasData[index].categoria,
            descricao: campanhasData[index].desc,
            link_oficial: campanhasData[index].link,
            tags: campanhasData[index].tags
        });
    }
}

const countEl = document.getElementById('count');
if (countEl) {
    let count = 0; const target = 685;
    const timer = setInterval(() => {
        count += 5; if (count >= target) { count = target; clearInterval(timer); }
        countEl.innerText = count;
    }, 10);
}