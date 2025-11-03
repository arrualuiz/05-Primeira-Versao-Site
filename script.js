// ====== CONFIG ======

// NewsAPI key (https://newsapi.org)
const API_KEY_NEWS = "75438efede234902a8585ea236ca1889";

// ====== RELÓGIO E DATA ======
function updateClock(){
  const now = new Date();
  const optsTime = { timeZone: 'America/Sao_Paulo', hour:'2-digit', minute:'2-digit', second:'2-digit' };
  const optsDate = { timeZone: 'America/Sao_Paulo', weekday:'long', day:'numeric', month:'long' };
  const hora = now.toLocaleTimeString('pt-BR', optsTime);
  const data = now.toLocaleDateString('pt-BR', optsDate).toLowerCase();
  document.getElementById('clock').textContent = hora;
  document.getElementById('date').textContent = data;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================
// NOTÍCIAS REAIS (API FUTURA)
// ==========================
async function carregarNoticias() {
  async function buscarNoticiasPorTime(time, elementId) {
    try {
      const apiKey = '75438efede234902a8585ea236ca1889';
      const url = `https://newsapi.org/v2/everything?q=${time}&language=pt&apiKey=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      const lista = document.getElementById(elementId);
      lista.innerHTML = '';

      if (data.articles && data.articles.length > 0) {
        data.articles.slice(0, 5).forEach(article => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
          lista.appendChild(li);
        });
      } else {
        lista.innerHTML = '<li>Nenhuma notícia encontrada para ' + time + '.</li>';
      }
    } catch (err) {
      console.error(`Erro ao buscar notícias do ${time}:`, err);
      carregarNoticiasLocais(time, elementId);
    }
  }

  function carregarNoticiasLocais(time, elementId) {
    const noticias = {
      Coritiba: [
        { title: "Coritiba enfrenta desafio importante no campeonato", url: "#" },
        { title: "Próximo jogo do Coritiba será decisivo", url: "#" },
        { title: "Coxa busca recuperação na temporada", url: "#" }
      ],
      Santos: [
        { title: "Santos prepara mudanças no time titular", url: "#" },
        { title: "Peixe busca reforços para próxima temporada", url: "#" },
        { title: "Santos define estratégia para próximo jogo", url: "#" }
      ]
    };

    const lista = document.getElementById(elementId);
    lista.innerHTML = '';

    const noticiasTime = noticias[time] || [];
    noticiasTime.forEach(noticia => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${noticia.url}" target="_blank">${noticia.title}</a>`;
      lista.appendChild(li);
    });
  }

  // Busca notícias para cada time separadamente
  buscarNoticiasPorTime('Coritiba', 'news-list-coritiba');
  buscarNoticiasPorTime('Santos', 'news-list-santos');
}

// Chama a função
carregarNoticias();

// ====== CALENDÁRIO (domingo -> sábado) ======
function generateCalendar(){
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthName = now.toLocaleString('pt-BR', {month:'long'});
  const monthYearHeader = `${monthName} ${year}`;

  // first day of month (0=Sun..6=Sat)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  let html = `<h3 style="text-transform:capitalize;">${monthYearHeader}</h3>`;
  html += '<div class="calendar-grid">';
  const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  dayNames.forEach(d=> html += `<div class="day-name">${d}</div>`);

  // leading empty slots for days before the 1st (firstDay already 0=Sunday)
  for(let i=0;i<firstDay;i++) html += '<div class="day empty"></div>';

  for(let d=1; d<=daysInMonth; d++){
    const isToday = d === now.getDate();
    html += `<div class="day ${isToday ? 'today' : ''}">${d}</div>`;
  }

  html += '</div>';
  // footer info with month/year
  html += `<div style="margin-top:12px;color:var(--muted);text-align:center;">Mês: ${monthName} • Ano: ${year}</div>`;
  calendar.innerHTML = html;
}
generateCalendar();

// regenerate at midnight to update day/month
function scheduleMidnightRefresh(){
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 5) - now;
  setTimeout(()=>{
    updateClock();
    generateCalendar();
    scheduleMidnightRefresh();
  }, msUntilMidnight);
}
scheduleMidnightRefresh();

// ====== helpers ======
function capitalize(s){ if(!s) return s; return s.charAt(0).toUpperCase()+s.slice(1); }
function escapeHtml(str){ return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function mostrarSemanaAtual() {
  const hoje = new Date();
  const semana = getWeekNumber(hoje);
  document.getElementById("semanaAtual").textContent = `Semana ${semana} de 52 do ano`;
}

mostrarSemanaAtual();

// ====== CONTAGEM REGRESSIVA PARA 2026 ======
function atualizarContagemRegressiva() {
  const destino = new Date("2025-12-31T23:59:59");
  const agora = new Date();
  const diff = destino - agora;

  if (diff <= 0) {
    document.getElementById("contador").textContent = "🎉 Feliz 2026!";
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  document.getElementById("contador").textContent = 
    `Faltam ${dias}d ${horas}h ${minutos}m ${segundos}s para 2026 🎆`;
}

setInterval(atualizarContagemRegressiva, 1000);
atualizarContagemRegressiva();

// ====== CONTAGEM REGRESSIVA ANIVERSÁRIO BIA ======
function atualizarAniversarioBia() {
  const destino = new Date("2025-12-29T23:59:59");
  const agora = new Date();
  const diff = destino - agora;

  if (diff <= 0) {
    document.getElementById("contadorBia").textContent = "🎉 Parabéns meu amor!";
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  document.getElementById("contadorBia").textContent = 
    `Faltam ${dias}d ${horas}h ${minutos}m ${segundos}s para aniversário da Bia 🤍`;
}

setInterval(atualizarAniversarioBia, 1000);
atualizarAniversarioBia();

// ====== CONTAGEM REGRESSIVA ANIVERSÁRIO LUIZ ======
function atualizarAniversarioLuiz() {
  const destino = new Date("2026-01-07T23:59:59");
  const agora = new Date();
  const diff = destino - agora;

  if (diff <= 0) {
    document.getElementById("contadorLuiz").textContent = "🎉 Parabéns Luiz!";
    return;
  }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  document.getElementById("contadorLuiz").textContent = 
    `Faltam ${dias}d ${horas}h ${minutos}m ${segundos}s para meu aniversário 🎉`;
}

setInterval(atualizarAniversarioLuiz, 1000);
atualizarAniversarioLuiz();

// ====== CLIMA (Open-Meteo) - versão com unidades forçadas e mapeamento ======
async function fetchWeatherOpenMeteo() {
  try {
    const lat = -25.5093, lon = -49.2710;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&windspeed_unit=kmh&temperature_unit=celsius&timezone=America/Sao_Paulo`;
    const res = await fetch(url);
    const data = await res.json();
    console.log('Open-Meteo:', data);
    const info = document.getElementById('weather-info');

    const weatherCodeMap = {
      0: 'céu limpo',
      1: 'principalmente limpo',
      2: 'parcialmente nublado',
      3: 'nublado',
      45: 'névoa',
      48: 'névoa com cristais',
      51: 'chuvisco leve',
      53: 'chuvisco moderado',
      55: 'chuvisco forte',
      61: 'chuva fraca',
      63: 'chuva moderada',
      65: 'chuva forte',
      71: 'neve fraca',
      73: 'neve moderada',
      75: 'neve forte',
      80: 'chuvas ocasionais',
      81: 'chuvas frequentes',
      82: 'chuvas intensas',
      95: 'trovoada',
      96: 'trovoada com granizo leve',
      99: 'trovoada com granizo forte'
    };

    if (data && data.current_weather) {
      const c = data.current_weather;
      const temp = Number(c.temperature).toFixed(1);
      const wind = Number(c.windspeed).toFixed(0);
      const desc = weatherCodeMap[c.weathercode] || 'clima';

      const updatedTime = new Date().toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });

      // exibe temperatura + descrição na primeira linha e "Atualizado" logo abaixo
      info.innerHTML = `
        <div>${temp}°C • ${desc} • vento ${wind} km/h</div>
        <div style="font-size:0.82rem;color:var(--muted);margin-top:6px">Atualizado: ${updatedTime}</div>
      `;
    } else {
      info.textContent = 'Dados de clima indisponíveis';
    }
  } catch (err) {
    console.error('Erro clima Open-Meteo:', err);
    document.getElementById('weather-info').textContent = 'Erro ao carregar clima';
  }
}
fetchWeatherOpenMeteo();


