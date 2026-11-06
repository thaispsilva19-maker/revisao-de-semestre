// ===== EcoBike SP · script.js =====
const PLANOS = [
  { id: "urbana", nome: "Urbana", preco: 12 },
  { id: "eletrica", nome: "Elétrica", preco: 20 },
  { id: "cargo", nome: "Cargo", preco: 25 },
];

function calcularValor(horas, tipo) {
  const plano = PLANOS.find((p) => p.id === tipo);
  let total = horas * plano.preco;
  if (horas > 5) total *= 0.9;
  return total;
}

function formatarMoeda(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function mostrarResultado() {
  const horas = Number(document.querySelector("#horas").value);
  const tipo = document.querySelector("#tipo").value;
  const saida = document.querySelector("#resultado");

  if (!horas || horas <= 0) {
    saida.textContent = "Digite um número de horas maior que zero.";
    saida.classList.add("erro");
    return;
  }

  saida.classList.remove("erro");
  const nome = PLANOS.find((p) => p.id === tipo).nome;
  saida.textContent = "Total: " + formatarMoeda(calcularValor(horas, tipo));

  const detalhe = document.createElement("small");
  detalhe.textContent = horas + "h de bike " + nome + (horas > 5 ? " (10% de desconto aplicado)" : "");
  saida.appendChild(detalhe);
}

function atualizarContador() {
  document.querySelector("#contador").textContent =
    document.querySelectorAll("#lista li").length;
}

function salvarReservas() {
  const nomes = [...document.querySelectorAll("#lista li span")].map((s) => s.textContent);
  try { localStorage.setItem("ecobike-reservas", JSON.stringify(nomes)); } catch (e) {}
}

function criarReserva(nome) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = nome;

  const remover = document.createElement("button");
  remover.type = "button";
  remover.textContent = "Remover";
  remover.setAttribute("aria-label", "Remover reserva de " + nome);
  remover.addEventListener("click", () => {
    li.remove();
    atualizarContador();
    salvarReservas();
  });

  li.append(span, remover);
  document.querySelector("#lista").appendChild(li);
}

function adicionarReserva() {
  const campo = document.querySelector("#nome");
  const nome = campo.value.trim();
  if (nome === "") {
    campo.focus();
    return;
  }
  criarReserva(nome);
  campo.value = "";
  atualizarContador();
  salvarReservas();
}

function aplicarTema(escuro) {
  const botao = document.querySelector("#tema");
  document.body.classList.toggle("dark", escuro);
  botao.textContent = escuro ? "☀️ Modo claro" : "🌙 Modo escuro";
  botao.setAttribute("aria-pressed", String(escuro));
}

function alternarTema() {
  document.body.classList.toggle("dark");
  const escuro = document.body.classList.contains("dark");
  aplicarTema(escuro);
  try { localStorage.setItem("ecobike-tema", escuro ? "escuro" : "claro"); } catch (e) {}
}

function carregarSalvos() {
  try {
    aplicarTema(localStorage.getItem("ecobike-tema") === "escuro");
    const nomes = JSON.parse(localStorage.getItem("ecobike-reservas") || "[]");
    nomes.forEach(criarReserva);
    atualizarContador();
  } catch (e) {}
}

document.querySelector("#calcular").addEventListener("click", mostrarResultado);
document.querySelector("#adicionar").addEventListener("click", adicionarReserva);
document.querySelector("#tema").addEventListener("click", alternarTema);
document.querySelector("#nome").addEventListener("keydown", (e) => {
  if (e.key === "Enter") adicionarReserva();
});
document.querySelector("#horas").addEventListener("keydown", (e) => {
  if (e.key === "Enter") mostrarResultado();
});
document.querySelectorAll("[data-tipo]").forEach((botao) => {
  botao.addEventListener("click", () => {
    document.querySelector("#tipo").value = botao.dataset.tipo;
    document.querySelector("#simulador").scrollIntoView({ behavior: "smooth" });
    document.querySelector("#horas").focus({ preventScroll: true });
  });
});

carregarSalvos();