const screens = {
  inicio: document.getElementById("screen-inicio"),
  juego: document.getElementById("screen-juego"),
  recuerdo: document.getElementById("screen-recuerdo"),
  galeria: document.getElementById("screen-galeria"),
  carta: document.getElementById("screen-carta"),
  "collage-final": document.getElementById("screen-collage-final"),
  ramo: document.getElementById("screen-ramo"),
  final: document.getElementById("screen-final")
};

const btnEmpezar = document.getElementById("btnEmpezar");
const nombreEllaEl = document.getElementById("nombreElla");
const finalNombreEllaEl = document.getElementById("finalNombreElla");
const emojiBg = document.getElementById("emojiBg");

function crearEmojis() {
  if (!emojiBg) return;
  const emojis = ["•", "·", "˙"];
  for (let i = 0; i < 16; i++) {
    const span = document.createElement("span");
    span.classList.add("emoji-float");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + "vw";
    span.style.fontSize = 6 + Math.random() * 10 + "px";
    span.style.opacity = (0.12 + Math.random() * 0.18).toString();
    span.style.animationDuration = 18 + Math.random() * 24 + "s";
    span.style.animationDelay = Math.random() * 20 + "s";
    emojiBg.appendChild(span);
  }
}

crearEmojis();

if (nombreEllaEl) nombreEllaEl.textContent = CONFIG.nombreElla;
if (finalNombreEllaEl) finalNombreEllaEl.textContent = CONFIG.nombreElla;

if (btnEmpezar) {
  btnEmpezar.addEventListener("click", () => {
    cambiarPantalla("juego");
    iniciarJuego();
  });
}

const totalRecuerdosEl = document.getElementById("totalRecuerdos");
const contadorRecuerdosEl = document.getElementById("contadorRecuerdos");
if (totalRecuerdosEl) totalRecuerdosEl.textContent = RECUERDOS.length;

let indiceRecuerdo = 0;
let recuerdosDesbloqueados = [];

const tituloJuego = document.getElementById("tituloJuego");
const descJuego = document.getElementById("descJuego");
const btnSiguienteRecuerdo = document.getElementById("btnSiguienteRecuerdo");

const panelesJuego = document.querySelectorAll(".juego-panel");
const juegoCorazones = document.getElementById("juego-corazones");
const juegoMemoria = document.getElementById("juego-memoria");
const juegoClick = document.getElementById("juego-click");
const juegoAtrapa = document.getElementById("juego-atrapa");
const juegoPregunta = document.getElementById("juego-pregunta");

function cambiarPantalla(id) {
  Object.values(screens).forEach((screen) => {
    if (screen) screen.classList.remove("active");
  });
  if (screens[id]) screens[id].classList.add("active");
}

function iniciarJuego() {
  indiceRecuerdo = 0;
  recuerdosDesbloqueados = [];
  if (contadorRecuerdosEl) contadorRecuerdosEl.textContent = 0;
  if (btnSiguienteRecuerdo) btnSiguienteRecuerdo.classList.add("hidden");
  mostrarJuegoParaIndice(indiceRecuerdo);
}

function mostrarJuegoParaIndice(i) {
  panelesJuego.forEach((panel) => panel.classList.remove("active"));
  if (btnSiguienteRecuerdo) btnSiguienteRecuerdo.classList.add("hidden");

  if (i >= RECUERDOS.length) {
    iniciarCarta();
    return;
  }

  if (tituloJuego) tituloJuego.textContent = `Recuerdo ${i + 1}`;
  if (descJuego) descJuego.textContent = "Completa el jueguito para desbloquearlo";

  const juegos = [
    () => { if (juegoCorazones) { juegoCorazones.classList.add("active"); iniciarJuegoCorazones(); } },
    () => { if (juegoMemoria) { juegoMemoria.classList.add("active"); iniciarJuegoMemoria(); } },
    () => { if (juegoClick) { juegoClick.classList.add("active"); iniciarJuegoClick(); } },
    () => { if (juegoAtrapa) { juegoAtrapa.classList.add("active"); iniciarJuegoAtrapa(); } },
    () => { if (juegoPregunta) { juegoPregunta.classList.add("active"); iniciarJuegoPregunta(); } }
  ];
  const idx = i % juegos.length;
  juegos[idx]();
}

const corazonesGrid = document.getElementById("corazonesGrid");
function iniciarJuegoCorazones() {
  if (!corazonesGrid) return;
  corazonesGrid.innerHTML = "";
  const total = 12;
  const aciertos = 4;
  const indices = [];
  while (indices.length < aciertos) {
    const num = Math.floor(Math.random() * total);
    if (!indices.includes(num)) indices.push(num);
  }
  for (let i = 0; i < total; i++) {
    const btn = document.createElement("button");
    btn.classList.add("corazon-item");
    if (indices.includes(i)) btn.dataset.acierto = "true";
    btn.addEventListener("click", () => {
      if (btn.classList.contains("revelado")) return;
      btn.classList.add("revelado");
      if (btn.dataset.acierto) {
        btn.classList.add("acierto");
      } else {
        btn.classList.add("fallo");
      }
      const revelados = corazonesGrid.querySelectorAll(".corazon-item.revelado");
      const aciertosRevelados = corazonesGrid.querySelectorAll('.corazon-item.revelado[data-acierto="true"]');
      if (aciertosRevelados.length === aciertos && revelados.length <= total) {
        setTimeout(() => mostrarBotonSiguiente(), 600);
      }
    });
    corazonesGrid.appendChild(btn);
  }
}

const memoriaGrid = document.getElementById("memoriaGrid");
function iniciarJuegoMemoria() {
  if (!memoriaGrid) return;
  memoriaGrid.innerHTML = "";
  const pares = 6;
  const iconos = ["💖", "💌", "🌙", "✨", "🍓", "🎵"];
  let cartas = [...iconos, ...iconos];
  cartas.sort(() => Math.random() - 0.5);
  let primera = null;
  let segunda = null;
  let bloqueado = false;
  let aciertos = 0;
  cartas.forEach((icono) => {
    const carta = document.createElement("button");
    carta.classList.add("carta-memoria");
    carta.dataset.icono = icono;
    carta.addEventListener("click", () => {
      if (bloqueado || carta.classList.contains("volteada") || carta.classList.contains("descubierta")) return;
      carta.classList.add("volteada");
      carta.textContent = icono;
      if (!primera) {
        primera = carta;
        return;
      }
      segunda = carta;
      bloqueado = true;
      if (primera.dataset.icono === segunda.dataset.icono) {
        setTimeout(() => {
          primera.classList.add("descubierta");
          segunda.classList.add("descubierta");
          primera = null;
          segunda = null;
          bloqueado = false;
          aciertos++;
          if (aciertos === pares) mostrarBotonSiguiente();
        }, 400);
      } else {
        setTimeout(() => {
          primera.classList.remove("volteada");
          segunda.classList.remove("volteada");
          primera.textContent = "";
          segunda.textContent = "";
          primera = null;
          segunda = null;
          bloqueado = false;
        }, 700);
      }
    });
    memoriaGrid.appendChild(carta);
  });
}

const heartBtn = document.getElementById("heartBtn");
const barraAmor = document.getElementById("barraAmor");
const clickCountEl = document.getElementById("clickCount");
const clickTargetEl = document.getElementById("clickTarget");
let clicks = 0;
let targetClick = 25;
function iniciarJuegoClick() {
  if (!heartBtn) return;
  clicks = 0;
  targetClick = 18 + Math.floor(Math.random() * 12);
  if (clickTargetEl) clickTargetEl.textContent = targetClick;
  if (clickCountEl) clickCountEl.textContent = 0;
  if (barraAmor) barraAmor.style.width = "0%";
  heartBtn.onclick = () => {
    clicks++;
    if (clickCountEl) clickCountEl.textContent = clicks;
    if (barraAmor) barraAmor.style.width = Math.min((clicks / targetClick) * 100, 100) + "%";
    if (clicks >= targetClick) {
      heartBtn.onclick = null;
      setTimeout(() => mostrarBotonSiguiente(), 400);
    }
  };
}

const atrapaArea = document.getElementById("atrapaArea");
const atrapaCountEl = document.getElementById("atrapaCount");
const atrapaTargetEl = document.getElementById("atrapaTarget");
let atrapaCount = 0;
let atrapaTarget = 8;
let atrapaInterval = null;
function iniciarJuegoAtrapa() {
  if (!atrapaArea) return;
  if (atrapaInterval) clearInterval(atrapaInterval);
  atrapaArea.innerHTML = "";
  atrapaCount = 0;
  atrapaTarget = 6 + Math.floor(Math.random() * 4);
  if (atrapaTargetEl) atrapaTargetEl.textContent = atrapaTarget;
  if (atrapaCountEl) atrapaCountEl.textContent = 0;
  atrapaInterval = setInterval(() => {
    const btn = document.createElement("button");
    btn.classList.add("atrapa-item");
    const esMalo = Math.random() < 0.25;
    if (esMalo) {
      btn.classList.add("malo");
      btn.textContent = "💔";
    } else {
      btn.textContent = "❤️";
    }
    btn.style.left = Math.random() * 90 + "%";
    btn.style.animationDuration = 2.2 + Math.random() * 1.2 + "s";
    btn.onclick = () => {
      if (esMalo) {
        btn.remove();
        return;
      }
      btn.remove();
      atrapaCount++;
      if (atrapaCountEl) atrapaCountEl.textContent = atrapaCount;
      if (atrapaCount >= atrapaTarget) {
        clearInterval(atrapaInterval);
        atrapaInterval = null;
        setTimeout(() => mostrarBotonSiguiente(), 400);
      }
    };
    atrapaArea.appendChild(btn);
    setTimeout(() => btn.remove(), 4000);
  }, 550);
}

const corazonMagicoArea = document.getElementById("corazonMagicoArea");
const magicoAciertosEl = document.getElementById("magicoAciertos");
let magicoAciertos = 0;
let magicoRonda = 0;
let magicoTimeouts = [];
function iniciarJuegoPregunta() {
  if (!corazonMagicoArea) return;
  corazonMagicoArea.innerHTML = "";
  magicoTimeouts.forEach(t => clearTimeout(t));
  magicoTimeouts = [];
  magicoAciertos = 0;
  magicoRonda = 0;
  if (magicoAciertosEl) magicoAciertosEl.textContent = 0;
  nuevaRondaMagica();
}

function nuevaRondaMagica() {
  corazonMagicoArea.innerHTML = "";
  magicoRonda++;
  const total = 4 + magicoRonda;
  const objetivo = Math.floor(Math.random() * total);
  const corazones = ["❤️", "💕", "💖"];
  for (let i = 0; i < total; i++) {
    const btn = document.createElement("button");
    btn.classList.add("corazon-magico");
    if (i === objetivo) {
      btn.classList.add("objetivo");
      btn.dataset.objetivo = "true";
    }
    btn.textContent = corazones[Math.floor(Math.random() * corazones.length)];
    btn.style.left = Math.random() * 80 + "%";
    btn.style.top = Math.random() * 70 + "%";
    btn.onclick = () => {
      if (btn.dataset.objetivo === "true") {
        btn.style.filter = "drop-shadow(0 0 40px rgba(255, 179, 209, 0.9))";
        magicoAciertos++;
        if (magicoAciertosEl) magicoAciertosEl.textContent = magicoAciertos;
        if (magicoAciertos >= 3) {
          magicoTimeouts.forEach(t => clearTimeout(t));
          setTimeout(() => mostrarBotonSiguiente(), 600);
        } else {
          setTimeout(() => nuevaRondaMagica(), 700);
        }
      } else {
        btn.style.opacity = "0.3";
        btn.disabled = true;
      }
    };
    corazonMagicoArea.appendChild(btn);
    const mover = () => {
      if (!corazonMagicoArea.contains(btn)) return;
      btn.style.left = Math.random() * 80 + "%";
      btn.style.top = Math.random() * 70 + "%";
    };
    const t1 = setInterval(mover, 600 + Math.random() * 400);
    magicoTimeouts.push(t1);
  }
}

function mostrarBotonSiguiente() {
  if (btnSiguienteRecuerdo) btnSiguienteRecuerdo.classList.remove("hidden");
}

if (btnSiguienteRecuerdo) {
  btnSiguienteRecuerdo.addEventListener("click", () => {
    desbloquearRecuerdo(indiceRecuerdo);
  });
}

const recuerdoTitulo = document.getElementById("recuerdoTitulo");
const recuerdoImg = document.getElementById("recuerdoImg");
const recuerdoVideo = document.getElementById("recuerdoVideo");
const recuerdoAudioWrap = document.getElementById("recuerdoAudioWrap");
const recuerdoAudio = document.getElementById("recuerdoAudio");
const recuerdoTexto = document.getElementById("recuerdoTexto");
const btnSeguirJugando = document.getElementById("btnSeguirJugando");

function desbloquearRecuerdo(i) {
  const recuerdo = RECUERDOS[i];
  recuerdosDesbloqueados.push(recuerdo);
  if (contadorRecuerdosEl) contadorRecuerdosEl.textContent = recuerdosDesbloqueados.length;

  if (recuerdoTitulo) recuerdoTitulo.textContent = recuerdo.titulo;
  if (recuerdoTexto) recuerdoTexto.textContent = recuerdo.texto;

  if (recuerdoImg) {
    recuerdoImg.classList.add("hidden");
    recuerdoImg.src = "";
  }
  if (recuerdoVideo) {
    recuerdoVideo.pause();
    recuerdoVideo.removeAttribute("src");
    recuerdoVideo.load();
    recuerdoVideo.classList.add("hidden");
  }

  if (recuerdo.imagen && recuerdo.imagen.trim() !== "") {
    const ext = recuerdo.imagen.split(".").pop().toLowerCase();
    if (ext === "mp4" || ext === "webm" || ext === "mov") {
      if (recuerdoVideo) {
        recuerdoVideo.src = recuerdo.imagen;
        recuerdoVideo.classList.remove("hidden");
        recuerdoVideo.muted = true;
        recuerdoVideo.loop = true;
        recuerdoVideo.playsInline = true;
        recuerdoVideo.play().catch(() => {});
      }
    } else if ((ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp" || ext === "gif" || ext === "bmp") && recuerdoImg) {
      recuerdoImg.src = recuerdo.imagen;
      recuerdoImg.classList.remove("hidden");
    }
  }

  if (recuerdoAudio && recuerdoAudioWrap) {
    if (recuerdo.audio && recuerdo.audio.trim() !== "") {
      recuerdoAudio.src = recuerdo.audio;
      recuerdoAudioWrap.classList.remove("hidden");
      recuerdoAudio.currentTime = 0;
      recuerdoAudio.play().catch(() => {});
    } else {
      recuerdoAudioWrap.classList.add("hidden");
      recuerdoAudio.pause();
      recuerdoAudio.removeAttribute("src");
    }
  }

  cambiarPantalla("recuerdo");
}

if (btnSeguirJugando) {
  btnSeguirJugando.addEventListener("click", () => {
    if (recuerdoAudio) {
      recuerdoAudio.pause();
      recuerdoAudio.removeAttribute("src");
    }
    if (recuerdoVideo) {
      recuerdoVideo.pause();
      recuerdoVideo.removeAttribute("src");
      recuerdoVideo.load();
      recuerdoVideo.classList.add("hidden");
    }
    if (atrapaInterval) {
      clearInterval(atrapaInterval);
      atrapaInterval = null;
      if (atrapaArea) atrapaArea.innerHTML = "";
    }
    if (typeof magicoTimeouts !== "undefined") {
      magicoTimeouts.forEach(t => clearTimeout(t));
      magicoTimeouts = [];
    }
    if (corazonMagicoArea) corazonMagicoArea.innerHTML = "";
    indiceRecuerdo++;
    cambiarPantalla("juego");
    mostrarJuegoParaIndice(indiceRecuerdo);
  });
}

const btnVerRecuerdos = document.getElementById("btnVerRecuerdos");
const btnVolverJuego = document.getElementById("btnVolverJuego");
const galeriaGrid = document.getElementById("galeriaGrid");

if (btnVerRecuerdos) {
  btnVerRecuerdos.addEventListener("click", () => {
    renderGaleria();
    cambiarPantalla("galeria");
  });
}

if (btnVolverJuego) {
  btnVolverJuego.addEventListener("click", () => {
    cambiarPantalla("juego");
  });
}

function renderGaleria() {
  if (!galeriaGrid) return;
  galeriaGrid.innerHTML = "";
  recuerdosDesbloqueados.forEach((recuerdo) => {
    const item = document.createElement("article");
    item.classList.add("galeria-item");
    if (recuerdo.imagen) {
      const ext = recuerdo.imagen.split(".").pop().toLowerCase();
      if (ext === "mp4" || ext === "webm" || ext === "mov") {
        const v = document.createElement("video");
        v.src = recuerdo.imagen;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.autoplay = true;
        item.appendChild(v);
      } else {
        const img = document.createElement("img");
        img.src = recuerdo.imagen;
        item.appendChild(img);
      }
    }
    const info = document.createElement("div");
    info.classList.add("galeria-item-info");
    const titulo = document.createElement("p");
    titulo.classList.add("galeria-item-titulo");
    titulo.textContent = recuerdo.titulo;
    const fecha = document.createElement("p");
    fecha.classList.add("galeria-item-fecha");
    fecha.textContent = "Nuestro recuerdo";
    info.appendChild(titulo);
    info.appendChild(fecha);
    item.appendChild(info);
    galeriaGrid.appendChild(item);
  });
}

const btnIrFinal = document.getElementById("btnIrFinal");
let collageTimeout = null;

function iniciarCarta() {
  cambiarPantalla("carta");
  if (cartaContenido) {
    cartaContenido.innerHTML = "";
    CONFIG.carta.forEach((parrafo) => {
      const p = document.createElement("p");
      p.textContent = parrafo;
      cartaContenido.appendChild(p);
    });
  }
  if (cartaFirma) {
    cartaFirma.textContent = CONFIG.firma + (CONFIG.nombreQuienRegala ? ` - ${CONFIG.nombreQuienRegala}` : "");
  }
  if (btnIrFinal) {
    btnIrFinal.classList.remove("hidden");
    btnIrFinal.onclick = () => {
      iniciarCollageTransicion();
      collageTimeout = window.setTimeout(irARamo, 8000);
    };
  }
}

const transicionCollage = document.getElementById("transicionCollage");
const btnBajarRamo = document.getElementById("btnBajarRamo");

function irARamo() {
  if (collageTimeout !== null) {
    clearTimeout(collageTimeout);
    collageTimeout = null;
  }
  mostrarRamo();
  cambiarPantalla("ramo");
}
window.irARamo = irARamo;

function iniciarCollageTransicion() {
  cambiarPantalla("collage-final");
  if (!transicionCollage) return;
  transicionCollage.innerHTML = "";
  const fuentes = [];
  recuerdosDesbloqueados.forEach(r => { if (r.imagen) fuentes.push(r.imagen); });
  COLLAGE_IMAGENES.forEach(img => { if (img) fuentes.push(img); });
  const lista = [...new Set(fuentes)].sort(() => Math.random() - 0.5).slice(0, 18);
  lista.forEach((src, idx) => {
    const item = document.createElement("div");
    item.classList.add("transicion-collage-item");
    item.style.animationDelay = (idx * 0.04) + "s";
    const ext = src.split(".").pop().toLowerCase();
    if (ext === "mp4" || ext === "webm" || ext === "mov") {
      const v = document.createElement("video");
      v.src = src;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      item.appendChild(v);
    } else if (ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "webp" || ext === "gif") {
      const img = document.createElement("img");
      img.src = src;
      img.onerror = () => item.remove();
      item.appendChild(img);
    }
    if (item.children.length) transicionCollage.appendChild(item);
  });
}

if (btnBajarRamo) {
  btnBajarRamo.onclick = irARamo;
}
const ramoWrap = document.getElementById("ramoWrap");
const btnIrContador = document.getElementById("btnIrContador");

function mostrarRamo() {
  if (!ramoWrap) return;
  ramoWrap.innerHTML = "";
  const girasoles = [
    { cls: "centro", delay: 0 },
    { cls: "izq", delay: 0.2 },
    { cls: "der", delay: 0.35 },
    { cls: "izq2", delay: 0.5 },
    { cls: "der2", delay: 0.65 }
  ];
  girasoles.forEach(g => {
    const div = document.createElement("div");
    div.classList.add("ramo-girasol", g.cls);
    div.setAttribute("aria-hidden", "true");
    div.style.setProperty("--retraso", `${g.delay}s`);

    const tallo = document.createElement("span");
    tallo.classList.add("girasol-tallo");
    const hojaIzquierda = document.createElement("span");
    hojaIzquierda.classList.add("girasol-hoja", "izquierda");
    const hojaDerecha = document.createElement("span");
    hojaDerecha.classList.add("girasol-hoja", "derecha");
    const flor = document.createElement("span");
    flor.classList.add("girasol-flor");

    for (let i = 0; i < 12; i++) {
      const petalo = document.createElement("span");
      petalo.classList.add("girasol-petalo");
      petalo.style.setProperty("--angulo", `${i * 30}deg`);
      flor.appendChild(petalo);
    }

    const centro = document.createElement("span");
    centro.classList.add("girasol-centro");
    flor.appendChild(centro);
    div.append(tallo, hojaIzquierda, hojaDerecha, flor);
    ramoWrap.appendChild(div);
  });
}

if (btnIrContador) {
  btnIrContador.addEventListener("click", () => {
    iniciarFinal();
    cambiarPantalla("final");
  });
}

const diasJuntosEl = document.getElementById("diasJuntos");
const collageBg = document.getElementById("collageBg");
const btnReiniciar = document.getElementById("btnReiniciar");

function iniciarFinal() {
  const inicio = new Date(CONFIG.fechaInicio + "T00:00:00");
  const hoy = new Date();
  const diff = hoy - inicio;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diasJuntosEl) diasJuntosEl.textContent = dias >= 0 ? dias : 0;

  if (collageBg) {
    collageBg.innerHTML = "";
    const fuentes = [...new Set([
      ...RECUERDOS.map((recuerdo) => recuerdo.imagen),
      ...COLLAGE_IMAGENES
    ].filter(Boolean))];
    fuentes.forEach((src) => {
      const ext = src.split(".").pop().toLowerCase();
      let medio;
      if (["mp4", "webm", "mov"].includes(ext)) {
        medio = document.createElement("video");
        medio.muted = true;
        medio.loop = true;
        medio.playsInline = true;
        medio.autoplay = true;
      } else if (["jpg", "jpeg", "png", "webp", "gif", "bmp"].includes(ext)) {
        medio = document.createElement("img");
        medio.alt = "";
      }
      if (!medio) return;
      medio.src = src;
      medio.onerror = () => medio.remove();
      collageBg.appendChild(medio);
    });
  }
}

if (btnReiniciar) {
  btnReiniciar.addEventListener("click", () => {
    if (recuerdoAudio) {
      recuerdoAudio.pause();
      recuerdoAudio.removeAttribute("src");
    }
    if (recuerdoVideo) {
      recuerdoVideo.pause();
      recuerdoVideo.removeAttribute("src");
      recuerdoVideo.load();
      recuerdoVideo.classList.add("hidden");
    }
    if (atrapaInterval) {
      clearInterval(atrapaInterval);
      atrapaInterval = null;
      if (atrapaArea) atrapaArea.innerHTML = "";
    }
    if (typeof magicoTimeouts !== "undefined") {
      magicoTimeouts.forEach(t => clearTimeout(t));
      magicoTimeouts = [];
    }
    if (corazonMagicoArea) corazonMagicoArea.innerHTML = "";
    recuerdosDesbloqueados = [];
    if (contadorRecuerdosEl) contadorRecuerdosEl.textContent = 0;
    cambiarPantalla("inicio");
  });
}
