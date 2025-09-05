let DATA=[];

function uniq(arr){ return [...new Set(arr)]; }
function byId(id){ return document.getElementById(id); }

async function loadData(){
  const res = await fetch('data/pases.json', {cache:'no-store'});
  DATA = await res.json();
  hydrateFilters();
  refresh();
}

function hydrateFilters(){
  // Mobile selects
  const bank = byId('bank'), network = byId('network'), tier = byId('tier'), program = byId('program');
  // Desktop selects
  const bankLg = byId('bank-lg'), networkLg = byId('network-lg'), tierLg = byId('tier-lg'), programLg = byId('program-lg');

  const banks = uniq(DATA.map(x => x.bank)).sort();
  [bank, bankLg].forEach(sel => banks.forEach(b => sel.append(new Option(b,b))));

  const handle = () => refresh();
  [bank, network, tier, program, bankLg, networkLg, tierLg, programLg, byId('text')].forEach(el => el && el.addEventListener('input', handle));
}

function getFilters(){
  // Prefer desktop filters if visible, else mobile/offcanvas
  const useDesktop = window.matchMedia('(min-width: 992px)').matches;
  const scope = useDesktop ? '-lg' : '';
  return {
    bank: byId('bank'+scope).value,
    network: byId('network'+scope).value,
    tier: byId('tier'+scope).value,
    program: byId('program'+scope).value,
    text: byId('text').value.toLowerCase().trim()
  };
}

function applyFilters(items, f){
  return items.filter(x => {
    const okBank = !f.bank || x.bank === f.bank;
    const okNet  = !f.network || x.network === f.network;
    const okTier = !f.tier || x.tier === f.tier;
    const okProg = !f.program || x.program === f.program;
    const okText = !f.text || (x.bank.toLowerCase().includes(f.text) || x.card.toLowerCase().includes(f.text));
    return okBank && okNet && okTier && okProg && okText;
  });
}

function card(item){
  const col = document.createElement('div');
  col.className = 'col-12 col-md-6 col-lg-4';
  const verified = item.verified_at ? `<span class="badge text-bg-success">Verificado</span>` : `<span class="badge text-bg-secondary">Sin verif.</span>`;
  col.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-1">${item.bank}</h5>
        <p class="card-subtitle text-muted mb-2">${item.card}</p>
        <div class="d-flex flex-wrap gap-1 mb-2">
          <span class="badge badge-soft">${item.network}</span>
          <span class="badge badge-soft">${item.tier}</span>
          <span class="badge badge-soft">${item.program}</span>
          <span class="badge ${item.access_type==='unlimited'?'text-bg-primary':'badge-soft'}">${item.access_type}</span>
          ${verified}
        </div>
        <div class="kv small mb-2">
          <div class="k">Visitas/año</div><div>${item.visits_per_year ?? '—'}</div>
          <div class="k">Invitados</div><div>${item.guests ?? '—'}</div>
          <div class="k">Registro previo</div><div>${item.enrollment_required ? 'Sí' : 'No'}</div>
          <div class="k">Condiciones</div><div>${item.conditions ?? '—'}</div>
          <div class="k">Fuente</div><div>${item.source_url?`<a href="${item.source_url}" target="_blank" rel="noopener">Ver fuente</a>`:'—'}</div>
          <div class="k">Verificado</div><div>${item.verified_at || '—'}</div>
        </div>
        <div class="mt-auto d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" onclick='copyLine(${JSON.stringify(JSON.stringify(item))})'>Copiar JSON</button>
          <a class="btn btn-outline-primary btn-sm" href="data/pases.json" target="_blank" rel="noopener">Ver archivo</a>
        </div>
      </div>
    </div>`;
  return col;
}

function copyLine(text){
  navigator.clipboard.writeText(JSON.parse(text)).then(()=>{
    alert('Copiado al portapapeles.');
  });
}

function refresh(){
  const f = getFilters();
  const items = applyFilters(DATA, f);
  const grid = byId('results');
  grid.innerHTML = '';
  if(items.length===0){
    const d = document.createElement('div');
    d.className = 'col-12';
    d.innerHTML = '<div class="alert alert-light border text-center">Sin resultados. Probá cambiar los filtros.</div>';
    grid.appendChild(d);
    return;
  }
  items.forEach(x => grid.appendChild(card(x)));
}

loadData();
