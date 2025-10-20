// Atualiza relógio em tempo real
function updateClock() {
  const now = new Date();
  const options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('clock').textContent = now.toLocaleTimeString('pt-BR', options);
  document.getElementById('date').textContent = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}
setInterval(updateClock, 1000);
updateClock();

// Placeholder de clima e notícias
document.getElementById('weather-info').textContent = '🌤️ 27°C em São Paulo';
document.getElementById('news-list').innerHTML = '<li>Seu time venceu ontem!</li><li>Próximo jogo no sábado.</li>';

// Gera calendário simples
function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = '<div class="calendar-grid">';
  for (let i = 1; i <= daysInMonth; i++) {
    html += `<div class="day ${i === now.getDate() ? 'today' : ''}">${i}</div>`;
  }
  html += '</div>';
  calendar.innerHTML = html;
}
generateCalendar();
