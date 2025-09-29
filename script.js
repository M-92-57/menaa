// small client-side engine for demo interactions
const offers = [
    { id:1, title:"Stage: Assistant pédagogique", type:"stage", location:"Dakar", company:"MEN", published:"2025-09-01", expires:"2025-10-15", description:"Stage de 3 mois pour assister les équipes pédagogiques. Missions : suivi des dossiers, appui logistique, animation d'ateliers." },
    { id:2, title:"Enseignant contractuel - Mathématiques", type:"emploi", location:"Thiès", company:"MEN", published:"2025-08-20", expires:"2025-10-01", description:"Poste à durée déterminée 12 mois, 20h/semaine. Profil recherché : Licence ou Master en Mathématiques." },
    { id:3, title:"Chargé de projet digital (CDD)", type:"emploi", location:"Dakar", company:"MEN", published:"2025-09-10", expires:"2025-11-01", description:"Gestion de projet, coordination des plateformes e-learning. Expérience en gestion produit appréciée." }
  ];
  
  function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function truncate(s,n){ if(!s) return ''; return s.length>n? s.slice(0,n-1)+'…':s; }
  
  function renderOffersGrid(){
    const root = document.getElementById('offersGrid');
    if(!root) return;
    const q = (document.getElementById('searchInput')?.value||'').toLowerCase();
    const type = document.getElementById('filterType')?.value || '';
    root.innerHTML = '';
    const filtered = offers.filter(o=>{
      if(type && o.type !== type) return false;
      if(q && !(o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || o.location.toLowerCase().includes(q))) return false;
      return true;
    });
    if(filtered.length===0){ root.innerHTML = '<div class="col-12"><div class="alert alert-secondary">Aucune offre trouvée.</div></div>'; return; }
    filtered.forEach(o=>{
      const col = document.createElement('div'); col.className='col-md-4';
      col.innerHTML = `
        <article class="card offer-card h-100" data-id="${o.id}">
          <div class="card-body">
            <h5 class="card-title">${escapeHtml(o.title)}</h5>
            <p class="small text-muted mb-2">${escapeHtml(o.company)} • ${escapeHtml(o.location)}</p>
            <p class="card-text">${escapeHtml(truncate(o.description,110))}</p>
          </div>
          <div class="card-footer bg-white">
            <small class="text-muted">Publié ${o.published} • Expire ${o.expires}</small>
            <button class="btn btn-sm btn-primary float-end ms-2 view-offer">Voir</button>
            <button class="btn btn-sm btn-outline-secondary float-end ms-2">Partager</button>
          </div>
        </article>`;
      root.appendChild(col);
    });
    document.querySelectorAll('.view-offer').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id = +e.target.closest('.offer-card').dataset.id;
        openOfferModal(id);
      });
    });
  }
  
  function openOfferModal(id){
    const o = offers.find(x=>x.id===id);
    if(!o) return;
    document.getElementById('modalTitle').textContent = o.title;
    document.getElementById('modalMeta').textContent = `${o.company} • ${o.location} • ${o.type.toUpperCase()}`;
    document.getElementById('modalDescription').innerHTML = `<p>${escapeHtml(o.description)}</p><p><strong>Date limite :</strong> ${o.expires}</p>`;
    document.getElementById('saveFav').onclick = ()=> alert('Favori ajouté (simulation).');
    // reset apply
    document.getElementById('applyAlert').innerHTML = '';
    document.getElementById('applyForm').onsubmit = function(ev){
      ev.preventDefault();
      handleApply(o.id);
    };
    new bootstrap.Modal(document.getElementById('offerModal')).show();
  }
  
  function handleApply(offerId){
    const name = document.getElementById('appName').value.trim();
    const email = document.getElementById('appEmail').value.trim();
    const cover = document.getElementById('appCover').value.trim();
    const file = document.getElementById('appCV').files[0];
    const alertEl = document.getElementById('applyAlert');
    if(!file){ alertEl.innerHTML = '<div class="alert alert-danger">Veuillez téléverser votre CV (PDF).</div>'; return; }
    if(file.type !== 'application/pdf'){ alertEl.innerHTML = '<div class="alert alert-danger">Le CV doit être un PDF.</div>'; return; }
    if(file.size > 5*1024*1024){ alertEl.innerHTML = '<div class="alert alert-danger">CV trop volumineux (max 5 MB).</div>'; return; }
    // simulate upload
    const offer = offers.find(o=>o.id===offerId) || {};
    const app = {
      id: Date.now(),
      offerId: offerId,
      offerTitle: offer.title || '',
      offerType: offer.type || '',
      offerLocation: offer.location || '',
      name: name,
      email: email,
      cover: cover,
      fileName: file.name,
      appliedAt: new Date().toISOString(),
      status: 'Reçu'
    };
    const key = 'men_demo_apps';
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push(app);
    localStorage.setItem(key, JSON.stringify(arr));
    alertEl.innerHTML = '<div class="alert alert-success">Candidature envoyée (simulation). Merci !</div>';
    document.getElementById('applyForm').reset();
    const modalEl = document.getElementById('offerModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) { modal.hide(); }
  }
  // contact form
  document.getElementById('contactForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    alert('Message envoyé (simulation). Merci !');
    this.reset();
  });
  
  document.getElementById('filterType')?.addEventListener('change', renderOffersGrid);
  document.getElementById('searchInput')?.addEventListener('input', ()=> setTimeout(renderOffersGrid,150));
  renderOffersGrid();