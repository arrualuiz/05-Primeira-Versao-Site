// ====== CONFIG: Cole suas chaves aqui ======
// OpenWeatherMap API key (https://openweathermap.org)
const API_KEY_WEATHER = "COLE_SUA_CHAVE_OPENWEATHER_AQUI";

// NewsAPI key (https://newsapi.org)
const API_KEY_NEWS = "COLE_SUA_CHAVE_NEWSAPI_AQUI";

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

// ====== CLIMA (OpenWeather) ======
function showWeatherElement(html){
  const el = document.getElementById('weather-info');
  el.innerHTML = html;
}

function fetchWeatherByCoords(lat, lon){
  if(!API_KEY_WEATHER || API_KEY_WEATHER.includes('COLE_SUA_CHAVE')) {
    showWeatherElement('⚠️ Cole sua OpenWeather API key em script.js para ver o clima real. Exibindo Curitiba estático: 19°C.');
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric&lang=pt_br`;
  fetch(url).then(r=>r.json()).then(data=>{
    if(data && data.weather){
      const desc = data.weather[0].description;
      const temp = Math.round(data.main.temp);
      const hum = data.main.humidity;
      const wind = Math.round(data.wind.speed);
      const cidade = data.name;
      const icon = data.weather[0].icon; // icon code if you want images
      showWeatherElement(`<div class="weather-row">🌡️ <strong>${temp}°C</strong> - ${capitalize(desc)} em ${cidade} <br><small>Umidade: ${hum}% • Vento: ${wind} m/s</small></div>`);
    } else {
      showWeatherElement('Erro ao ler dados do clima. Mostrando Curitiba estático: 19°C.');
    }
  }).catch(err=>{
    console.error(err);
    showWeatherElement('Erro ao obter clima. Exibindo Curitiba estático: 19°C.');
  });
}

function fetchWeatherDefaultCuritiba(){
  if(!API_KEY_WEATHER || API_KEY_WEATHER.includes('COLE_SUA_CHAVE')) {
    showWeatherElement('🌤️ 19°C em Curitiba');
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Curitiba,BR&appid=${API_KEY_WEATHER}&units=metric&lang=pt_br`;
  fetch(url).then(r=>r.json()).then(data=>{
    if(data && data.weather){
      const desc = data.weather[0].description;
      const temp = Math.round(data.main.temp);
      const hum = data.main.humidity;
      const wind = Math.round(data.wind.speed);
      showWeatherElement(`🌡️ <strong>${temp}°C</strong> - ${capitalize(desc)} em Curitiba <br><small>Umidade: ${hum}% • Vento: ${wind} m/s</small>`);
    } else {
      showWeatherElement('🌤️ 19°C em Curitiba');
    }
  }).catch(err=>{
    console.error(err);
    showWeatherElement('🌤️ 19°C em Curitiba');
  });
}

function atualizarClima(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    }, err=>{
      // permissão negada ou erro -> usa Curitiba
      fetchWeatherDefaultCuritiba();
    }, {timeout:5000});
  } else {
    fetchWeatherDefaultCuritiba();
  }
}
atualizarClima();
setInterval(atualizarClima, 60*60*1000); // atualiza a cada hora

// ====== NOTÍCIAS (NewsAPI) ======
async function carregarNoticias(){
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '<li>Carregando notícias...</li>';
  if(!API_KEY_NEWS || API_KEY_NEWS.includes('COLE_SUA_CHAVE')) {
    newsList.innerHTML = '<li>⚠️ Cole sua NewsAPI key em script.js para ver notícias reais.</li>';
    return;
  }

  // Busca por Coritiba ou Santos, notícias em português
  const query = encodeURIComponent('Coritiba OR Santos');
  const url = `https://newsapi.org/v2/everything?q=${query}&language=pt&pageSize=8&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    newsList.innerHTML = '';
    if(data.articles && data.articles.length){
      data.articles.forEach(a=>{
        const li = document.createElement('li');
        const title = a.title || 'Sem título';
        const src = a.source && a.source.name ? a.source.name : '';
        li.innerHTML = `<a href="${a.url}" target="_blank" rel="noreferrer">${escapeHtml(title)}</a> <small style="color:var(--muted)"> — ${src}</small>`;
        newsList.appendChild(li);
      });
    } else {
      newsList.innerHTML = '<li>Nenhuma notícia recente encontrada.</li>';
    }
  } catch(e){
    console.error(e);
    newsList.innerHTML = '<li>Erro ao carregar notícias.</li>';
  }
}
carregarNoticias();
setInterval(carregarNoticias, 15*60*1000); // atualiza a cada 15 minutos

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
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1,0,0,5) - now;
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
