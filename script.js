// Daily Life Tracking System - Refactored
// Supports: TIMER, CHECKLIST, PAYMENT, LOAN, DATE, SAVINGS

// --- Utilities
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2,9); }
function daysBetween(date) { return Math.ceil((new Date(date) - new Date()) / (1000*60*60*24)); }

// --- State
let categories = [];
let timers = {}; // running timers

// --- DOM refs
const gridContainer = $('#gridContainer');
const openNewCategory = $('#openNewCategory');
const categoryModal = $('#categoryModal');
const categoryForm = $('#categoryForm');
const catName = $('#catName');
const catType = $('#catType');
const dynamicFields = $('#dynamicFields');
const closeModalBtn = $('#closeModal');
const detailsModal = $('#detailsModal');
const detailsContent = $('#detailsContent');
const closeDetailsBtn = $('#closeDetails');

// --- Persistence
const STORAGE_KEY = 'dailylife_categories_v2';
function load() {
  try { categories = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e){ categories = []; }
  if(categories.length === 0) seedDefaults();
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(categories)); }

function seedDefaults(){
  categories = [
    { id: 'gym', label: 'Gym Routine', type: 'checklist', tasks: [
        { text: 'Incline DB Press – 4x6-8', done:false },
        { text: 'Flat DB Press – 3x10', done:false },
        { text: 'Shoulder Press – 3x6-8', done:false }
      ] },
    { id: 'english', label: 'Study English', type: 'timer', durationMinutes: 180, startTime: '23:00', autoStart:false },
    { id: 'coding', label: 'Study Coding', type: 'timer', durationMinutes: 180, startTime: '02:00', autoStart:true }
  ];
  save();
}

// --- UI Helpers
function openModal(el){ el.style.display='flex'; document.body.style.overflow='hidden'; }
function closeModal(el){ el.style.display='none'; document.body.style.overflow='auto'; }

openNewCategory.addEventListener('click', ()=>{
  categoryForm.dataset.editId = '';
  categoryForm.reset();
  renderDynamicFields();
  $('#modalTitle').textContent = 'New Category';
  openModal(categoryModal);
});
closeModalBtn.addEventListener('click', ()=> closeModal(categoryModal));
closeDetailsBtn.addEventListener('click', ()=> closeModal(detailsModal));

categoryModal.addEventListener('click', (e)=>{ if(e.target===categoryModal) closeModal(categoryModal); });
detailsModal.addEventListener('click', (e)=>{ if(e.target===detailsModal) closeModal(detailsModal); });

catType.addEventListener('change', renderDynamicFields);

function renderDynamicFields(){
  const type = catType.value;
  dynamicFields.innerHTML = '';
  const mk = (html) => { const d = document.createElement('div'); d.innerHTML = html; dynamicFields.appendChild(d); };

  if(type==='timer'){
    mk(`<div class="form-group"><label>Hours</label><input id="timerHours" type="number" min="0" value="3"></div>
        <div class="form-group"><label>Minutes</label><input id="timerMinutes" type="number" min="0" max="59" value="0"></div>
        <div class="form-group"><label>Start Time (HH:MM)</label><input id="timerStartTime" type="time"></div>
        <div class="form-group"><label><input id="timerAuto" type="checkbox"> Auto-start at scheduled time</label></div>`);
  } else if(type==='checklist'){
    mk(`<div class="form-group"><label>Tasks (one per line)</label><textarea id="checklistTasks" rows="6" placeholder="Incline DB Press – 4x6-8\nFlat DB Press – 3x10"></textarea></div>`);
  } else if(type==='payment'){
    mk(`<div class="form-group"><label>Amount</label><input id="paymentAmount" type="number" step="0.01">
        <label>Due Date</label><input id="paymentDue" type="date"></div>`);
  } else if(type==='loan'){
    mk(`<div class="form-group"><label>Monthly Payment</label><input id="loanMonthly" type="number" step="0.01">
        <label>Total Months</label><input id="loanTotal" type="number">
        <label>Paid Months</label><input id="loanPaid" type="number" value="0"></div>`);
  } else if(type==='date'){
    mk(`<div class="form-group"><label>Target Date</label><input id="dateTarget" type="date"></div>`);
  } else if(type==='savings'){
    mk(`<div class="form-group"><label>Target Amount</label><input id="saveTarget" type="number" step="0.01">
        <label>Current Amount</label><input id="saveCurrent" type="number" step="0.01" value="0"></div>`);
  }
}

// --- Create / Edit Category
categoryForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const editId = categoryForm.dataset.editId;
  const name = catName.value.trim();
  const type = catType.value;
  if(!name || !type) return alert('Name and Type required');

  let cat = editId ? categories.find(c=>c.id===editId) : { id: uid('cat_'), createdAt: new Date().toISOString() };
  cat.label = name; cat.type = type;

  if(type==='timer'){
    const h = parseInt($('#timerHours').value)||0; const m = parseInt($('#timerMinutes').value)||0;
    cat.durationMinutes = h*60 + m; cat.startTime = $('#timerStartTime').value || null; cat.autoStart = !!$('#timerAuto').checked;
  } else if(type==='checklist'){
    const tasks = ($('#checklistTasks').value||'').split('\n').map(s=>s.trim()).filter(Boolean).map(t=>({ text:t, done:false }));
    cat.tasks = tasks;
  } else if(type==='payment'){
    cat.amount = parseFloat($('#paymentAmount').value)||0; cat.dueDate = $('#paymentDue').value || null; cat.status = 'pending'; cat.paidDate = null;
  } else if(type==='loan'){
    cat.monthlyPayment = parseFloat($('#loanMonthly').value)||0; cat.totalMonths = parseInt($('#loanTotal').value)||0; cat.paidMonths = parseInt($('#loanPaid').value)||0;
  } else if(type==='date'){
    cat.targetDate = $('#dateTarget').value || null;
  } else if(type==='savings'){
    cat.targetAmount = parseFloat($('#saveTarget').value)||0; cat.currentAmount = parseFloat($('#saveCurrent').value)||0;
  }

  if(!editId) categories.push(cat);
  save(); renderAll(); closeModal(categoryModal);
});

// --- Rendering
function renderAll(){ renderGrid(); renderOverview(); }

function renderOverview(){
  $('#totalCategories').textContent = categories.length;
  const checklistTasks = categories.filter(c=>c.type==='checklist').reduce((s,c)=>s+(c.tasks||[]).length,0);
  const completed = categories.filter(c=>c.type==='checklist').reduce((s,c)=>s+(c.tasks||[]).filter(t=>t.done).length,0);
  $('#tasksCompleted').textContent = `${completed}/${checklistTasks}`;
  $('#activeCategories').textContent = categories.filter(c=> c.type!=='date' || (c.type==='date' && c.targetDate)).length;
  const loansRemaining = categories.filter(c=>c.type==='loan').reduce((s,c)=>s+Math.max(0,(c.totalMonths||0)-(c.paidMonths||0)),0);
  $('#loansRemaining').textContent = loansRemaining;
  const upcoming = categories.filter(c=>c.type==='payment' && c.dueDate && daysBetween(c.dueDate) <=7 && c.status!=='paid').length;
  $('#upcomingPayments').textContent = upcoming;
  const overall = computeOverallProgress();
  $('#overallProgress').textContent = overall+'%';
}

function computeOverallProgress(){
  // average of progress across categories
  if(categories.length===0) return 0;
  const sum = categories.reduce((s,c)=>s+Number(getProgress(c)||0),0);
  return Math.round(sum/categories.length);
}

function getProgress(cat){
  if(cat.type==='checklist'){
    const t = (cat.tasks||[]); if(t.length===0) return 0;
    return Math.round((t.filter(x=>x.done).length / t.length)*100);
  }
  if(cat.type==='savings') return cat.targetAmount? Math.round((cat.currentAmount||0)/cat.targetAmount*100):0;
  if(cat.type==='loan') return cat.totalMonths? Math.round((cat.paidMonths||0)/cat.totalMonths*100):0;
  if(cat.type==='payment') return cat.status==='paid'?100:0;
  return 0;
}

function renderGrid(){
  gridContainer.innerHTML = '';
  categories.forEach(cat=> gridContainer.appendChild(renderCard(cat)) );
}

function renderCard(cat){
  const card = document.createElement('div'); card.className='category-card';
  const title = document.createElement('div'); title.className='card-header'; title.innerHTML = `<h3>${cat.label}</h3><span class="card-type">${cat.type.toUpperCase()}</span>`;
  const body = document.createElement('div'); body.className='card-body';
  const summary = document.createElement('div'); summary.className='card-summary'; summary.innerHTML = getCardSummary(cat);
  const progBar = document.createElement('div'); progBar.className='progress-bar'; progBar.innerHTML = `<div class='progress-fill' style='width:${Math.min(getProgress(cat),100)}%'></div>`;
  const progText = document.createElement('div'); progText.className='progress-text'; progText.textContent = getProgress(cat)+'%';
  body.appendChild(summary); body.appendChild(progBar); body.appendChild(progText);
  const footer = document.createElement('div'); footer.className='card-footer';
  const openBtn = document.createElement('button'); openBtn.className='btn btn-small btn-primary'; openBtn.textContent='Open'; openBtn.addEventListener('click',(e)=>{e.stopPropagation(); openCategoryDetails(cat.id);} );
  const editBtn = document.createElement('button'); editBtn.className='btn btn-small'; editBtn.textContent='Edit'; editBtn.addEventListener('click',(e)=>{ e.stopPropagation(); openEditModal(cat.id); });
  const delBtn = document.createElement('button'); delBtn.className='btn btn-small btn-danger'; delBtn.textContent='Delete'; delBtn.addEventListener('click',(e)=>{ e.stopPropagation(); if(confirm('Delete category?')){ categories = categories.filter(x=>x.id!==cat.id); save(); renderAll(); } });
  footer.appendChild(openBtn); footer.appendChild(editBtn); footer.appendChild(delBtn);
  card.appendChild(title); card.appendChild(body); card.appendChild(footer);
  card.addEventListener('click', ()=> openCategoryDetails(cat.id));
  return card;
}

function getCardSummary(cat){
  if(cat.type==='timer') return `Duration: ${Math.floor((cat.durationMinutes||0)/60)}h ${((cat.durationMinutes||0)%60)}m`;
  if(cat.type==='checklist') return `${(cat.tasks||[]).filter(t=>t.done).length}/${(cat.tasks||[]).length} completed`;
  if(cat.type==='payment') return `₱${(cat.amount||0).toFixed(2)} ${cat.status==='paid'?'✓ Paid':'Pending'}`;
  if(cat.type==='loan'){ const rem = Math.max(0,(cat.totalMonths||0)-(cat.paidMonths||0)); const bal = ((cat.monthlyPayment||0)*rem); return `₱${bal.toFixed(2)} remaining (${rem} months)`; }
  if(cat.type==='date') return `${daysBetween(cat.targetDate)} days remaining`;
  if(cat.type==='savings') return `₱${(cat.currentAmount||0).toFixed(2)} / ₱${(cat.targetAmount||0).toFixed(2)}`;
  return '';
}

// --- Details Modal
function openCategoryDetails(id){
  const cat = categories.find(c=>c.id===id); if(!cat) return;
  detailsContent.innerHTML = getDetailsHtml(cat);
  attachDetailsListeners(cat);
  openModal(detailsModal);
}

function getDetailsHtml(cat){
  if(cat.type==='timer'){
    const mins = cat.durationMinutes||0; const h = Math.floor(mins/60); const m = mins%60;
    return `<div class="modal-section"><h3>⏱ ${cat.label}</h3><p>Duration: ${h}h ${m}m</p>${cat.startTime?`<p>Start: ${cat.startTime} ${cat.autoStart?'<em>(auto)</em>':''}</p>`:''}
      <div class="timer-display" id="timerDisplay_${cat.id}">00:00:00</div>
      <div class="modal-actions"><button class="btn btn-primary" id="startTimer_${cat.id}">Start/Pause</button><button class="btn" id="resetTimer_${cat.id}">Reset</button></div></div>`;
  }
  if(cat.type==='checklist'){
    const items = (cat.tasks||[]).map((t,i)=>`<div class="checklist-item"><input type="checkbox" id="chk_${cat.id}_${i}" data-idx="${i}" ${t.done?'checked':''}><label for="chk_${cat.id}_${i}">${t.text}</label></div>`).join('');
    return `<div class="modal-section"><h3>✓ ${cat.label}</h3><div class="checklist-container">${items||'<em>No tasks</em>'}</div><div class="modal-actions"><button class="btn" id="addCheck_${cat.id}">Add Task</button></div></div>`;
  }
  if(cat.type==='payment'){
    return `<div class="modal-section"><h3>💳 ${cat.label}</h3><div class="modal-info">Amount: <strong>₱${(cat.amount||0).toFixed(2)}</strong><br>Due: <strong>${cat.dueDate||'—'}</strong><br>Status: <strong>${cat.status||'pending'}</strong>${cat.paidDate?`<br>Paid: ${cat.paidDate}`:''}</div>
      <div class="modal-actions">${cat.status!=='paid'?`<button class="btn btn-primary" id="markPaid_${cat.id}">Mark Paid</button>`:`<button class="btn" id="markPending_${cat.id}">Mark Pending</button>`}</div></div>`;
  }
  if(cat.type==='loan'){
    const rem = Math.max(0,(cat.totalMonths||0)-(cat.paidMonths||0)); const bal = ((cat.monthlyPayment||0)*rem);
    return `<div class="modal-section"><h3>🏦 ${cat.label}</h3><div class="modal-info">Monthly: <strong>₱${(cat.monthlyPayment||0).toFixed(2)}</strong><br>Total: <strong>${cat.totalMonths||0}</strong><br>Paid: <strong>${cat.paidMonths||0}</strong><br>Remaining: <strong>${rem} months</strong><br>Balance: <strong>₱${bal.toFixed(2)}</strong></div>
      <div class="modal-actions">${rem>0?`<button class="btn btn-primary" id="payInstall_${cat.id}">Pay Installment</button>`:'<span style="color:green; font-weight:700">Loan complete</span>'}</div></div>`;
  }
  if(cat.type==='date'){
    const d = daysBetween(cat.targetDate);
    return `<div class="modal-section"><h3>📅 ${cat.label}</h3><div class="modal-info">Target: <strong>${cat.targetDate||'—'}</strong></div><div class="countdown-display">${d<0?`Overdue ${Math.abs(d)}d`:`${d} days remaining`}</div></div>`;
  }
  if(cat.type==='savings'){
    const prog = cat.targetAmount? Math.round((cat.currentAmount||0)/cat.targetAmount*100):0; return `<div class="modal-section"><h3>💰 ${cat.label}</h3><div class="modal-info">${(cat.currentAmount||0).toFixed(2)} / ${(cat.targetAmount||0).toFixed(2)}</div><div class="progress-bar"><div class="progress-fill" style="width:${Math.min(prog,100)}%"></div></div><p>${prog}%</p><div class="modal-actions"><input id="addSave_${cat.id}" type="number" placeholder="Add amount" style="flex:1;padding:8px"><button class="btn btn-primary" id="addSaveBtn_${cat.id}">Add</button></div></div>`; }
  return '<div class="modal-section">Unknown type</div>';
}

function attachDetailsListeners(cat){
  if(cat.type==='timer'){
    $('#startTimer_'+cat.id).addEventListener('click', ()=> { toggleTimer(cat.id); });
    $('#resetTimer_'+cat.id).addEventListener('click', ()=> { resetTimer(cat.id); });
    updateTimerUI(cat.id);
  }
  if(cat.type==='checklist'){
    (cat.tasks||[]).forEach((t,i)=>{ const el = $('#chk_'+cat.id+'_'+i); if(el) el.addEventListener('change', (e)=>{ cat.tasks[i].done = e.target.checked; save(); renderAll(); }) });
    $('#addCheck_'+cat.id).addEventListener('click', ()=>{ const text = prompt('Task text'); if(text){ cat.tasks.push({text,done:false}); save(); openCategoryDetails(cat.id); renderAll(); } });
  }
  if(cat.type==='payment'){
    const mp = $('#markPaid_'+cat.id); if(mp) mp.addEventListener('click', ()=>{ cat.status='paid'; cat.paidDate = new Date().toISOString().split('T')[0]; save(); openCategoryDetails(cat.id); renderAll(); });
    const mp2 = $('#markPending_'+cat.id); if(mp2) mp2.addEventListener('click', ()=>{ cat.status='pending'; cat.paidDate=null; save(); openCategoryDetails(cat.id); renderAll(); });
  }
  if(cat.type==='loan'){
    const btn = $('#payInstall_'+cat.id); if(btn) btn.addEventListener('click', ()=>{ if((cat.paidMonths||0) < (cat.totalMonths||0)){ cat.paidMonths = (cat.paidMonths||0)+1; save(); openCategoryDetails(cat.id); renderAll(); } });
  }
  if(cat.type==='savings'){
    const addBtn = $('#addSaveBtn_'+cat.id); if(addBtn) addBtn.addEventListener('click', ()=>{ const val = parseFloat($('#addSave_'+cat.id).value)||0; if(val>0){ cat.currentAmount = (cat.currentAmount||0)+val; save(); openCategoryDetails(cat.id); renderAll(); } });
  }
}

// --- Timer management
function toggleTimer(catId){
  const key = 't_'+catId; const cat = categories.find(c=>c.id===catId); if(!cat) return;
  if(!timers[key]){ timers[key] = { remaining: (cat.durationMinutes||0)*60, interval:null }; }
  if(timers[key].interval){ clearInterval(timers[key].interval); timers[key].interval=null; } else { timers[key].interval = setInterval(()=>{ timers[key].remaining--; if(timers[key].remaining<=0){ clearInterval(timers[key].interval); timers[key].interval=null; alert(cat.label+' complete'); } updateTimerUI(catId); },1000); }
  updateTimerUI(catId);
}
function resetTimer(catId){ const cat = categories.find(c=>c.id===catId); timers['t_'+catId] = { remaining:(cat.durationMinutes||0)*60, interval:null }; updateTimerUI(catId); }
function updateTimerUI(catId){ const d = timers['t_'+catId]; const el = $('#timerDisplay_'+catId); if(!el) return; const rem = d?d.remaining: (categories.find(c=>c.id===catId).durationMinutes||0)*60; const h=Math.floor(rem/3600); const m=Math.floor((rem%3600)/60); const s=rem%60; el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }

// Auto-start timers at scheduled time
function checkAutoStart(){ const now = new Date(); const hh = String(now.getHours()).padStart(2,'0'); const mm = String(now.getMinutes()).padStart(2,'0'); const current = `${hh}:${mm}`; const todayKey = now.toISOString().split('T')[0]; categories.forEach(cat=>{ if(cat.type==='timer' && cat.startTime && cat.autoStart){ const key = `auto_${cat.id}_${todayKey}`; if(!localStorage.getItem(key) && current>=cat.startTime){ toggleTimer(cat.id); localStorage.setItem(key,'1'); } } }); }
setInterval(checkAutoStart,60000); checkAutoStart();

// --- Edit existing
function openEditModal(id){ const cat = categories.find(c=>c.id===id); if(!cat) return; categoryForm.dataset.editId = id; $('#modalTitle').textContent='Edit Category'; catName.value = cat.label; catType.value = cat.type; renderDynamicFields(); setTimeout(()=>{ // populate dynamic
  if(cat.type==='timer'){ const h = Math.floor((cat.durationMinutes||0)/60); const m=(cat.durationMinutes||0)%60; $('#timerHours').value=h; $('#timerMinutes').value=m; $('#timerStartTime').value=cat.startTime||''; $('#timerAuto').checked=!!cat.autoStart; }
  if(cat.type==='checklist'){ $('#checklistTasks').value = (cat.tasks||[]).map(t=>t.text).join('\n'); }
  if(cat.type==='payment'){ $('#paymentAmount').value=cat.amount||''; $('#paymentDue').value=cat.dueDate||''; }
  if(cat.type==='loan'){ $('#loanMonthly').value=cat.monthlyPayment||''; $('#loanTotal').value=cat.totalMonths||''; $('#loanPaid').value=cat.paidMonths||0; }
  if(cat.type==='date'){ $('#dateTarget').value=cat.targetDate||''; }
  if(cat.type==='savings'){ $('#saveTarget').value=cat.targetAmount||''; $('#saveCurrent').value=cat.currentAmount||0; }
},50);
 openModal(categoryModal);
}

// --- Other helpers
function openCategoryDetails(id){ openCategoryDetails; }

// --- Init
load(); renderAll();

// Expose small API for console testing
window.__DLTS = { categories, save, load, renderAll };
// Daily Life Tracking System - Unified Multi-Type Implementation
// Supports: TIMER, CHECKLIST, PAYMENT, LOAN, DATE, SAVINGS

const STORAGE_KEY = 'dailylife_categories_v1';
const autoTimerChecks = [];
let categories = [];
const timers = {};

// --- Defaults (first-run) ---
const DEFAULT_CATEGORIES = [
    {
        id: 'study_english',
        label: 'Study English',
        type: 'timer',
        durationMinutes: 180,
        startTime: '23:00',
        autoStart: false
    },
    {
        id: 'study_coding',
        label: 'Study Coding',
        type: 'timer',
        durationMinutes: 120,
        startTime: '02:00',
        autoStart: true
    },
    {
        id: 'gym_routine',
        label: 'Gym Routine',
        type: 'checklist',
        tasks: [
            { text: 'Incline DB Press — 4x6-8', done: false },
            { text: 'Flat DB Press — 3x10', done: false },
            { text: 'Shoulder Press — 3x6-8', done: false },
            { text: 'Lateral Raise — 5x15', done: false }
        ]
    }
];

// --- Utilities ---
function uid(prefix='id'){
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

function load(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) {
        categories = DEFAULT_CATEGORIES.slice();
        save();
        return;
    }
    try{
        const parsed = JSON.parse(raw);
        // merge defaults for missing categories
        categories = parsed.slice();
        DEFAULT_CATEGORIES.forEach(def => {
            const exists = categories.find(c => c.id === def.id);
            if(!exists) categories.push(def);
        });
    }catch(e){
        console.error('Failed to load categories', e);
        categories = DEFAULT_CATEGORIES.slice();
    }
}

// --- DOM refs ---
const gridContainer = document.getElementById('gridContainer');
const openNewBtn = document.getElementById('openNewCategory');
const categoryModal = document.getElementById('categoryModal');
const categoryForm = document.getElementById('categoryForm');
const catNameInput = document.getElementById('catName');
const catTypeSelect = document.getElementById('catType');
const dynamicFields = document.getElementById('dynamicFields');
const closeModalBtn = document.getElementById('closeModal');
const cancelCategoryBtn = document.getElementById('cancelCategory');
const detailsModal = document.getElementById('detailsModal');
const closeDetailsBtn = document.getElementById('closeDetails');
const detailsContent = document.getElementById('detailsContent');

// Dashboard refs
const totalCategoriesEl = document.getElementById('totalCategories');
const activeCategoriesEl = document.getElementById('activeCategories');
const tasksCompletedEl = document.getElementById('tasksCompleted');
const loansRemainingEl = document.getElementById('loansRemaining');
const upcomingPaymentsEl = document.getElementById('upcomingPayments');
const overallProgressEl = document.getElementById('overallProgress');

// --- Modal helpers ---
function showModal(modal){ modal.style.display = 'flex'; document.body.style.overflow='hidden'; }
function hideModal(modal){ modal.style.display = 'none'; document.body.style.overflow='auto'; }

closeModalBtn.addEventListener('click', ()=> hideModal(categoryModal));
cancelCategoryBtn.addEventListener('click', ()=> hideModal(categoryModal));
openNewBtn.addEventListener('click', ()=> openNewCategory());
closeDetailsBtn.addEventListener('click', ()=> hideModal(detailsModal));

// click outside to close
[categoryModal, detailsModal].forEach(m=>{
    m.addEventListener('click', (ev)=>{ if(ev.target === m) hideModal(m); });
});

// --- Dynamic form fields ---
function renderDynamicFields(type, existing){
    dynamicFields.innerHTML = '';
    const makeRow = (label, inner)=>{
        const r = document.createElement('div'); r.className='form-row';
        const l = document.createElement('label'); l.textContent = label; r.appendChild(l);
        r.appendChild(inner); return r;
    };

    if(type === 'timer'){
        const h = document.createElement('input'); h.type='number'; h.id='timerHours'; h.min=0; h.placeholder='Hours';
        const m = document.createElement('input'); m.type='number'; m.id='timerMinutes'; m.min=0; m.placeholder='Minutes';
        const wrap = document.createElement('div'); wrap.style.display='flex'; wrap.style.gap='8px'; wrap.appendChild(h); wrap.appendChild(m);
        dynamicFields.appendChild(makeRow('Duration (H / M)', wrap));

        const st = document.createElement('input'); st.type='time'; st.id='timerStartTime'; st.value = existing?.startTime || '';
        dynamicFields.appendChild(makeRow('Start Time (optional)', st));

        const auto = document.createElement('input'); auto.type='checkbox'; auto.id='timerAuto'; auto.checked = existing?.autoStart || false;
        dynamicFields.appendChild(makeRow('Auto-start at Start Time', auto));
    }

    if(type === 'checklist'){
        const ta = document.createElement('textarea'); ta.id='checklistTasks'; ta.placeholder='One task per line'; ta.rows=6;
        if(existing?.tasks) ta.value = existing.tasks.map(t=>t.text).join('\n');
        dynamicFields.appendChild(makeRow('Tasks', ta));
    }

    if(type === 'payment'){
        const amt = document.createElement('input'); amt.type='number'; amt.step='0.01'; amt.id='paymentAmount'; amt.placeholder='Amount'; amt.value = existing?.amount||'';
        dynamicFields.appendChild(makeRow('Amount', amt));
        const due = document.createElement('input'); due.type='date'; due.id='paymentDueDate'; due.value = existing?.dueDate||'';
        dynamicFields.appendChild(makeRow('Due Date', due));
    }

    if(type === 'loan'){
        const monthly = document.createElement('input'); monthly.type='number'; monthly.step='0.01'; monthly.id='loanMonthlyPayment'; monthly.placeholder='Monthly Payment'; monthly.value = existing?.monthlyPayment||'';
        dynamicFields.appendChild(makeRow('Monthly Payment', monthly));
        const total = document.createElement('input'); total.type='number'; total.id='loanTotalMonths'; total.placeholder='Total Months'; total.value = existing?.totalMonths||12;
        dynamicFields.appendChild(makeRow('Total Months', total));
        const paid = document.createElement('input'); paid.type='number'; paid.id='loanPaidMonths'; paid.placeholder='Paid Months'; paid.value = existing?.paidMonths||0;
        dynamicFields.appendChild(makeRow('Paid Months', paid));
        const due = document.createElement('input'); due.type='date'; due.id='loanDueDate'; due.value = existing?.dueDate||'';
        dynamicFields.appendChild(makeRow('Next Due Date', due));
    }

    if(type === 'date'){
        const d = document.createElement('input'); d.type='date'; d.id='targetDate'; d.value = existing?.targetDate||'';
        dynamicFields.appendChild(makeRow('Target Date', d));
    }

    if(type === 'savings'){
        const target = document.createElement('input'); target.type='number'; target.step='0.01'; target.id='savingsTarget'; target.placeholder='Target Amount'; target.value = existing?.targetAmount||'';
        dynamicFields.appendChild(makeRow('Target Amount', target));
        const current = document.createElement('input'); current.type='number'; current.step='0.01'; current.id='savingsCurrent'; current.placeholder='Current Amount'; current.value = existing?.currentAmount||0;
        dynamicFields.appendChild(makeRow('Current Amount', current));
    }
}

catTypeSelect.addEventListener('change',(e)=> renderDynamicFields(e.target.value));

// --- Create / Edit Category ---
let editingCategoryId = null;
function openNewCategory(){
    editingCategoryId = null;
    document.getElementById('modalTitle').textContent = 'New Category';
    categoryForm.reset();
    renderDynamicFields('timer');
    showModal(categoryModal);
}

categoryForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const name = catNameInput.value.trim();
    const type = catTypeSelect.value;
    if(!name || !type) return alert('Please fill name and type');

    const payload = { label: name, type };

    if(type === 'timer'){
        const h = parseInt(document.getElementById('timerHours').value)||0;
        const m = parseInt(document.getElementById('timerMinutes').value)||0;
        payload.durationMinutes = h*60 + m;
        payload.startTime = document.getElementById('timerStartTime').value || null;
        payload.autoStart = document.getElementById('timerAuto').checked;
    }
    if(type === 'checklist'){
        const tasks = (document.getElementById('checklistTasks').value||'').split('\n').map(t=>t.trim()).filter(Boolean);
        payload.tasks = tasks.map(t=>({ text: t, done: false }));
    }
    if(type === 'payment'){
        payload.amount = parseFloat(document.getElementById('paymentAmount').value)||0;
        payload.dueDate = document.getElementById('paymentDueDate').value || null;
        payload.status = payload.amount>0? 'pending' : 'paid';
    }
    if(type === 'loan'){
        payload.monthlyPayment = parseFloat(document.getElementById('loanMonthlyPayment').value)||0;
        payload.totalMonths = parseInt(document.getElementById('loanTotalMonths').value)||12;
        payload.paidMonths = parseInt(document.getElementById('loanPaidMonths').value)||0;
        payload.dueDate = document.getElementById('loanDueDate').value||null;
        payload.history = [];
    }
    if(type === 'date'){
        payload.targetDate = document.getElementById('targetDate').value||null;
    }
    if(type === 'savings'){
        payload.targetAmount = parseFloat(document.getElementById('savingsTarget').value)||0;
        payload.currentAmount = parseFloat(document.getElementById('savingsCurrent').value)||0;
    }

    if(editingCategoryId){
        const cat = categories.find(c=>c.id===editingCategoryId);
        Object.assign(cat, payload);
    } else {
        const newCat = Object.assign({ id: uid('cat'), createdAt: new Date().toISOString() }, payload);
        categories.push(newCat);
    }

    save();
    hideModal(categoryModal);
    renderAll();
});

// --- Rendering ---
function renderAll(){ renderGrid(); renderDashboard(); }

function renderGrid(){
    gridContainer.innerHTML = '';
    categories.forEach(cat=> gridContainer.appendChild(makeCard(cat)));
}

function makeCard(cat){
    const card = document.createElement('div'); card.className='category-card';
    const header = document.createElement('div'); header.className='card-header';
    const h = document.createElement('h3'); h.textContent = `${cat.label}`; header.appendChild(h);
    const typeBadge = document.createElement('span'); typeBadge.className='card-type'; typeBadge.textContent = cat.type.toUpperCase(); header.appendChild(typeBadge);
    const body = document.createElement('div'); body.className='card-body';
    const summary = document.createElement('div'); summary.className='card-summary'; summary.innerHTML = summarize(cat);
    const progressWrap = document.createElement('div'); progressWrap.className='progress-bar';
    const fill = document.createElement('div'); fill.className='progress-fill'; fill.style.width = getProgress(cat)+'%'; progressWrap.appendChild(fill);
    const progressText = document.createElement('div'); progressText.className='progress-text'; progressText.textContent = getProgress(cat)+'%';
    body.appendChild(summary); body.appendChild(progressWrap); body.appendChild(progressText);
    const footer = document.createElement('div'); footer.className='card-footer';
    const openBtn = document.createElement('button'); openBtn.className='btn btn-small btn-primary'; openBtn.textContent='Open'; openBtn.onclick = (e)=>{ e.stopPropagation(); openDetails(cat.id); };
    const editBtn = document.createElement('button'); editBtn.className='btn btn-small btn-secondary'; editBtn.textContent='Edit'; editBtn.onclick = (e)=>{ e.stopPropagation(); openEdit(cat.id); };
    const delBtn = document.createElement('button'); delBtn.className='btn btn-small btn-danger'; delBtn.textContent='Delete'; delBtn.onclick = (e)=>{ e.stopPropagation(); if(confirm('Delete category?')){ categories = categories.filter(c=>c.id!==cat.id); save(); renderAll(); } };
    footer.appendChild(openBtn); footer.appendChild(editBtn); footer.appendChild(delBtn);

    card.appendChild(header); card.appendChild(body); card.appendChild(footer);
    card.addEventListener('click', ()=> openDetails(cat.id));
    return card;
}

function summarize(cat){
    switch(cat.type){
        case 'timer': return `Duration: ${Math.floor((cat.durationMinutes||0)/60)}h ${(cat.durationMinutes||0)%60}m ${cat.startTime? `<br>Start: ${cat.startTime}`: ''}`;
        case 'checklist': {
            const total=(cat.tasks||[]).length; const done=(cat.tasks||[]).filter(t=>t.done).length; return `${done}/${total} completed`;
        }
        case 'payment': return `₱${(cat.amount||0).toFixed(2)} — ${cat.status||'pending'}`;
        case 'loan': { const rem=(cat.totalMonths||0)-(cat.paidMonths||0); const bal=(cat.monthlyPayment||0)*rem; return `₱${bal.toFixed(2)} remaining — ${rem} months`; }
        case 'date': return `${getDaysRemaining(cat.targetDate)} days remaining`;
        case 'savings': return `₱${(cat.currentAmount||0).toFixed(2)} / ₱${(cat.targetAmount||0).toFixed(2)}`;
    }
    return '';
}

function getProgress(cat){
    switch(cat.type){
        case 'checklist': { const total=(cat.tasks||[]).length; const done=(cat.tasks||[]).filter(t=>t.done).length; return total? Math.round(done/total*100):0; }
        case 'savings': return ((cat.currentAmount||0)/(cat.targetAmount||1)*100).toFixed(0);
        case 'loan': return Math.round(((cat.paidMonths||0)/(cat.totalMonths||1))*100);
        case 'payment': return cat.status==='paid'?100:0;
        default: return 0;
    }
}

function getDaysRemaining(target){ if(!target) return '—'; const t=new Date(target); const diff = (t - new Date())/(1000*60*60*24); return Math.ceil(diff); }

// --- Details / Actions ---
function openDetails(catId){
    const cat = categories.find(c=>c.id===catId); if(!cat) return;
    detailsContent.innerHTML = renderDetails(cat);
    attachDetailsListeners(cat);
    showModal(detailsModal);
}

function renderDetails(cat){
    let html = `<h2>${cat.label} — ${cat.type.toUpperCase()}</h2>`;
    switch(cat.type){
        case 'timer': {
            html += `<p>Duration: ${Math.floor((cat.durationMinutes||0)/60)}h ${(cat.durationMinutes||0)%60}m</p>`;
            html += `<div id="timerDisplay_${cat.id}" class="timer-display">00:00:00</div>`;
            html += `<div class="modal-actions"><button id="startTimer_${cat.id}" class="btn btn-primary">Start</button><button id="pauseTimer_${cat.id}" class="btn btn-secondary">Pause</button><button id="resetTimer_${cat.id}" class="btn btn-secondary">Reset</button></div>`;
            break;
        }
        case 'checklist': {
            html += `<div class="checklist-container">`;
            (cat.tasks||[]).forEach((t,i)=>{
                html += `<div class="checklist-item"><input type="checkbox" id="chk_${cat.id}_${i}" data-cat="${cat.id}" data-i="${i}" ${t.done? 'checked':''}><label for="chk_${cat.id}_${i}">${t.text}</label></div>`;
            });
            html += `</div><div class="modal-actions"><button id="addTask_${cat.id}" class="btn btn-secondary">Add Task</button></div>`;
            break;
        }
        case 'payment': {
            html += `<div class="modal-info"><div class="info-row"><span>Amount</span><strong>₱${(cat.amount||0).toFixed(2)}</strong></div><div class="info-row"><span>Due</span><strong>${cat.dueDate||'—'}</strong></div><div class="info-row"><span>Status</span><strong>${cat.status||'pending'}</strong></div></div>`;
            html += `<div class="modal-actions">${cat.status==='paid'? `<button id="markPending_${cat.id}" class="btn btn-secondary">Mark Pending</button>`: `<button id="markPaid_${cat.id}" class="btn btn-primary">Mark Paid</button>`}</div>`;
            break;
        }
        case 'loan': {
            const rem=(cat.totalMonths||0)-(cat.paidMonths||0); const bal=(cat.monthlyPayment||0)*rem;
            html += `<div class="modal-info"><div class="info-row"><span>Monthly</span><strong>₱${(cat.monthlyPayment||0).toFixed(2)}</strong></div><div class="info-row"><span>Paid Months</span><strong>${cat.paidMonths||0}</strong></div><div class="info-row"><span>Remaining Balance</span><strong>₱${bal.toFixed(2)}</strong></div></div>`;
            if(rem>0) html += `<div class="modal-actions"><button id="payInstall_${cat.id}" class="btn btn-primary">Pay Installment</button></div>`; else html += `<div style="color:green;font-weight:700;">Loan Complete ✓</div>`;
            break;
        }
        case 'date': html += `<div class="countdown-display">${getDaysRemaining(cat.targetDate)} days remaining</div>`; break;
        case 'savings': html += `<div class="modal-info"><div class="info-row"><span>Target</span><strong>₱${(cat.targetAmount||0).toFixed(2)}</strong></div><div class="info-row"><span>Current</span><strong>₱${(cat.currentAmount||0).toFixed(2)}</strong></div></div><div class="modal-actions"><input id="addSave_${cat.id}" type="number" step="0.01" placeholder="Amount" style="flex:1;padding:8px;"><button id="addSaveBtn_${cat.id}" class="btn btn-primary">Add</button></div>`; break;
    }
    return html;
}

function attachDetailsListeners(cat){
    if(cat.type === 'timer'){
        document.getElementById(`startTimer_${cat.id}`).addEventListener('click', ()=> startTimer(cat));
        document.getElementById(`pauseTimer_${cat.id}`).addEventListener('click', ()=> pauseTimer(cat));
        document.getElementById(`resetTimer_${cat.id}`).addEventListener('click', ()=> resetTimer(cat));
        updateTimerUI(cat);
    }
    if(cat.type === 'checklist'){
        (cat.tasks||[]).forEach((t,i)=>{
            const el = document.getElementById(`chk_${cat.id}_${i}`);
            if(el) el.addEventListener('change',(e)=>{ cat.tasks[i].done = e.target.checked; save(); renderAll(); });
        });
        const addBtn = document.getElementById(`addTask_${cat.id}`);
        if(addBtn) addBtn.addEventListener('click', ()=>{
            const txt = prompt('New task'); if(!txt) return; cat.tasks.push({ text: txt, done: false }); save(); openDetails(cat.id); renderAll();
        });
    }
    if(cat.type === 'payment'){
        const paidBtn = document.getElementById(`markPaid_${cat.id}`);
        if(paidBtn) paidBtn.addEventListener('click', ()=>{ cat.status='paid'; cat.paidDate = new Date().toISOString().split('T')[0]; save(); openDetails(cat.id); renderAll(); });
        const pendingBtn = document.getElementById(`markPending_${cat.id}`);
        if(pendingBtn) pendingBtn.addEventListener('click', ()=>{ cat.status='pending'; cat.paidDate=null; save(); openDetails(cat.id); renderAll(); });
    }
    if(cat.type === 'loan'){
        const payBtn = document.getElementById(`payInstall_${cat.id}`);
        if(payBtn) payBtn.addEventListener('click', ()=>{ cat.paidMonths = (cat.paidMonths||0) + 1; (cat.history = cat.history||[]).push({ date: new Date().toISOString().split('T')[0], amount: cat.monthlyPayment||0 }); save(); openDetails(cat.id); renderAll(); });
    }
    if(cat.type === 'savings'){
        const addInput = document.getElementById(`addSave_${cat.id}`);
        const addBtn = document.getElementById(`addSaveBtn_${cat.id}`);
        if(addBtn) addBtn.addEventListener('click', ()=>{ const v = parseFloat(addInput.value)||0; if(v>0){ cat.currentAmount = (cat.currentAmount||0)+v; save(); openDetails(cat.id); renderAll(); } });
    }
}

function openEdit(catId){
    const cat = categories.find(c=>c.id===catId); if(!cat) return;
    editingCategoryId = catId;
    document.getElementById('modalTitle').textContent = 'Edit Category';
    catNameInput.value = cat.label; catTypeSelect.value = cat.type; renderDynamicFields(cat.type, cat);
    showModal(categoryModal);
}

// --- Timer core ---
function startTimer(cat){
    const key = `t_${cat.id}`;
    if(!timers[key]) timers[key] = { remaining: (cat.durationMinutes||0)*60, interval:null };
    if(timers[key].interval) return;
    timers[key].interval = setInterval(()=>{ if(timers[key].remaining<=0){ clearInterval(timers[key].interval); timers[key].interval=null; alert(`${cat.label} complete!`); return;} timers[key].remaining--; updateTimerUI(cat); },1000);
    updateTimerUI(cat);
}
function pauseTimer(cat){ const key=`t_${cat.id}`; if(timers[key]&&timers[key].interval){ clearInterval(timers[key].interval); timers[key].interval=null; } }
function resetTimer(cat){ const key=`t_${cat.id}`; if(timers[key]&&timers[key].interval){ clearInterval(timers[key].interval); } timers[key]={ remaining:(cat.durationMinutes||0)*60, interval:null }; updateTimerUI(cat); }
function updateTimerUI(cat){ const key=`t_${cat.id}`; const el = document.getElementById(`timerDisplay_${cat.id}`); if(!el) return; if(!timers[key]) timers[key]={ remaining:(cat.durationMinutes||0)*60, interval:null }; const r=timers[key].remaining; const hh=Math.floor(r/3600); const mm=Math.floor((r%3600)/60); const ss=r%60; el.textContent = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; }

// --- Auto-start timers ---
function checkAutoStarts(){ const now=new Date(); const tm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`; categories.forEach(cat=>{ if(cat.type==='timer' && cat.autoStart && cat.startTime){ const key=`auto_${cat.id}_${new Date().toISOString().split('T')[0]}`; if(!localStorage.getItem(key) && tm>=cat.startTime){ startTimer(cat); localStorage.setItem(key,'1'); } } }); }
setInterval(checkAutoStarts, 60*1000);

// --- Dashboard ---
function renderDashboard(){
    totalCategoriesEl.textContent = categories.length;
    const active = categories.filter(c=>{ if(c.type==='timer') return (c.durationMinutes||0)>0; if(c.type==='checklist') return (c.tasks||[]).length>0; return true; }).length;
    activeCategoriesEl.textContent = active;
    const tasksTotal = categories.reduce((s,c)=> s + ((c.type==='checklist')? (c.tasks||[]).length : 0), 0);
    const tasksDone = categories.reduce((s,c)=> s + ((c.type==='checklist')? (c.tasks||[]).filter(t=>t.done).length : 0), 0);
    tasksCompletedEl.textContent = `${tasksDone}/${tasksTotal}`;
    const loansRemain = categories.reduce((s,c)=> s + ((c.type==='loan')? Math.max(0,(c.totalMonths||0)-(c.paidMonths||0)) : 0), 0);
    loansRemainingEl.textContent = loansRemain;
    const upcoming = categories.reduce((s,c)=> s + ((c.type==='payment' && c.dueDate && daysUntil(c.dueDate)<=7 && c.status!=='paid')?1:0),0);
    upcomingPaymentsEl.textContent = upcoming;
    const overall = categories.reduce((acc,c)=> acc + Number(getProgress(c)),0) / Math.max(1,categories.length);
    overallProgressEl.textContent = `${Math.round(overall)}%`;
}

function daysUntil(dateStr){ if(!dateStr) return Infinity; return Math.ceil((new Date(dateStr)-new Date())/(1000*60*60*24)); }

// --- Init ---
load();
renderAll();
checkAutoStarts();

// Expose a small API for console debugging
window.app = { categories, save, renderAll };
