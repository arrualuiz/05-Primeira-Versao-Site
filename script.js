// ==========================
// 🕒 RELÓGIO E DATA
// ==========================
function updateClock() {
  const now = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const hora = now.toLocaleTimeString('pt-BR', options);
  const data = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  document.getElementById('clock').textContent = hora;
  document.getElementById('date').textContent = data.toLowerCase();
}
setInterval(updateClock, 1000);
updateClock();

// ==========================
// 🌤️ CLIMA - Curitiba
// ==========================
document.getElementById('weather-info').textContent = '🌤️ 19°C em Curitiba';

// ==========================
// 📰 NOTÍCIAS REAIS (API FUTURA)
// ==========================
async function carregarNoticias() {
  const apiKey = '75438efede234902a8585ea236ca1889'; // NewsAPI.org
  const times = ['Coritiba', 'Santos'];
  const url = `https://newsapi.org/v2/everything?q=${times.join(' OR ')}&language=pt&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const lista = document.getElementById('news-list');
    lista.innerHTML = '';

    if (data.articles && data.articles.length > 0) {
      data.articles.slice(0, 5).forEach(article => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = '<li>Nenhuma notícia encontrada no momento.</li>';
    }
  } catch (err) {
    console.error('Erro ao buscar notícias:', err);
    document.getElementById('news-list').innerHTML = '<li>Erro ao carregar notícias</li>';
  }
}

// Chama a função
carregarNoticias();

// ==========================
// 📅 CALENDÁRIO DINÂMICO
// ==========================
function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthName = now.toLocaleString('pt-BR', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = `<h3 style="text-transform:capitalize;">${monthName}</h3>`;
  html += '<div class="calendar-grid">';

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasSemana.forEach(d => html += `<div class="day day-name">${d}</div>`);

  for (let i = 0; i < firstDay; i++) html += '<div class="day empty"></div>';

  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === now.getDate();
    html += `<div class="day ${isToday ? 'today' : ''}">${i}</div>`;
  }

  html += '</div>';
  calendar.innerHTML = html;
}

generateCalendar();
