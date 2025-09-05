let DATA=[];

function byId(id){ return document.getElementById(id); }

function showMessage(text){
  const grid = byId('results');
  grid.innerHTML = '';
  const d = document.createElement('div');
  d.className = 'col-12';
  d.innerHTML = `<div class="alert alert-light border text-center">${text}</div>`;
  grid.appendChild(d);
}

async function loadData(){
  try{
    const res = await fetch('data/pases.json', {cache:'no-store'});
    if(!res.ok){
      showMessage('No pude cargar data/pases.json (¿ruta o carpeta mal ubicadas?).');
      console.error('Fetch error:', res.status, res.statusText);
      return;
    }
    const txt = await res.text();
    try{
      DATA = JSON.parse(txt);
    }catch(e){
      showMessage('El archivo data/pases.json no es JSON válido.');
      console.error('JSON parse error:', e, 'Contenido recibido:', txt);
      return;
    }
    if(!Array.isArray(DATA) || DATA.length === 0){
      showMessage('No hay datos para mostrar. Agregá items en data/pases.json.');
      console.warn('DATA vacío o no-array:', DATA);
      return;
    }
    refresh();
  }catch(err){
    showMessage('Error cargando datos. Revisá la consola.');
    console.error(err);
  }
}

function serviceBadges(arr=[]){
  const map = {
    'fastpass_eze': '<span class="badge badge-fastpass">FastPass EZE</span>',
    'parking_eze': '<span class="badge badge-parking">Parking EZE</span>'
  };
  return arr.map(x => map[x]).filter(Boolean).join(' ');
}

function quotaText(quota){
  if(!quota) return '';
  if(quota.shared && quota.shared.total){
    const inc = (quota.shared.includes||[]).map(k => k
      .replace('fastpass_eze','FastPass EZE')
      .replace('parking_eze','Parking EZE')
    ).join(', ');
    const note = quota.shared.note ? ` — ${quota.shared.note}` : '';
    return `Compartido: total ${quota.shared.total}${inc ? ` (${inc})` : ''}${note}`;
  }
  if(quota.per_service){
    const parts = Object.entries(quota.per_service).map(([k,v]) => {
      const name = k.replace('fastpass_eze','FastPass EZE').replace('parking_eze','Parking EZE');
      return `${name}: ${v}`;
    });
    return `Independiente: ${parts.join(' · ')}`;
  }
  return '';
}

function card(item){
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';
  const svcBadges = serviceBadges(item.optional_services);
  const quota = quotaText(item.service_quota);

  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-1">${item.bank||'—'}</h5>
        <p class="card-subtitle text-muted mb-2">${item.card||'—'}</p>
        <div class="d-flex flex-wrap gap-1 mb-2">${svcBadges || ''}</div>
        <div class="kv small mb-2">
          <div class="k">Servicios</div><div>${svcBadges || '—'}</div>
          <div class="k">Cupo servicios</div><div>${quota || '—'}</div>
        </div>
      </div>
    </div>`;
  return col;
}

function refresh(){
  const grid = byId('results');
  grid.innerHTML = '';
  if(!Array.isArray(DATA) || DATA.length === 0){
    showMessage('No hay datos para mostrar.');
    return;
  }
  DATA.forEach(x => grid.appendChild(card(x)));
}

loadData();
