// Minimal JS to show login/signup modals and navigate to the dashboard
function createModal(title, submitText){
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <h2>${title}</h2>
    <input class="input" placeholder="Email" id="modalEmail">
    <input class="input" placeholder="Password" type="password" id="modalPassword">
    <div class="remember-row">
      <input type="checkbox" id="modalRemember">
      <label for="modalRemember">Remember me</label>
    </div>
    <div class="actions">
      <button class="btn outline" id="cancelBtn">Cancel</button>
      <button class="btn primary" id="submitBtn">${submitText}</button>
    </div>
  `;
  backdrop.appendChild(modal);

  // prefill remembered email if present
  try{
    const remembered = localStorage.getItem('capypal_remember_email');
    if(remembered){
      const em = backdrop.querySelector('#modalEmail'); if(em) em.value = remembered;
      const rem = backdrop.querySelector('#modalRemember'); if(rem) rem.checked = true;
    }
  }catch(e){}

  backdrop.querySelector('#cancelBtn').addEventListener('click', ()=> document.body.removeChild(backdrop));
  backdrop.querySelector('#submitBtn').addEventListener('click', ()=>{
    // Very small simulation: validate basic input and redirect
    const email = backdrop.querySelector('#modalEmail').value.trim();
    const pass = backdrop.querySelector('#modalPassword').value.trim();
    const remember = !!backdrop.querySelector('#modalRemember').checked;
    if(!email || !pass){
      alert('Please enter email and password');
      return;
    }
    try{
      if(remember) localStorage.setItem('capypal_remember_email', email);
      else localStorage.removeItem('capypal_remember_email');
    }catch(e){}
    // In a real app we'd call a backend here. For now navigate to home.
    window.location.href = 'home.html';
  });

  return backdrop;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const s = document.getElementById('signupBtn');
  const l = document.getElementById('loginBtn');
  if(s) s.addEventListener('click', ()=> document.body.appendChild(createModal('Create account','Sign up')));
  if(l) l.addEventListener('click', ()=> document.body.appendChild(createModal('Welcome back','Login')));
});

// Guest button: quick access without account
document.addEventListener('DOMContentLoaded', ()=>{
  const g = document.getElementById('guestBtn');
  if(g) g.addEventListener('click', ()=>{
    try{ localStorage.setItem('capypal_user','guest'); }catch(e){}
    window.location.href = 'home.html';
  });
});

// --- Home page logic: tasks + timer ---
function tasksModule(){
  const KEY = 'capypal_tasks_v1';
  const taskListEl = document.getElementById('taskList');
  const addBtn = document.getElementById('addTaskBtn');
  const input = document.getElementById('taskInput');
  const newTaskBtn = document.getElementById('newTaskBtn');

  function load(){
    const raw = localStorage.getItem(KEY);
    return raw? JSON.parse(raw): [];
  }
  function save(tasks){ localStorage.setItem(KEY, JSON.stringify(tasks)); }

  function render(){
    const tasks = load();
    taskListEl.innerHTML = '';
    tasks.forEach((t, i)=>{
      const li = document.createElement('li');
      li.className = 'task-item';
      li.innerHTML = `
        <div class="left">
          <div class="checkbox" data-index="${i}">${t.done? '✓':''}</div>
          <div class="task-text">${t.text}</div>
        </div>
        <div>
          <button class="btn outline" data-del="${i}">Delete</button>
        </div>
      `;
      taskListEl.appendChild(li);
    });
    updateCounts();
  }

  function updateCounts(){
    const tasks = load();
    const total = tasks.length;
    const done = tasks.filter(t=>t.done).length;
    const inProgress = Math.max(0, total - done);
    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = done;
    document.getElementById('inProgressCount').textContent = inProgress;
  }

  taskListEl.addEventListener('click', (e)=>{
    if(e.target.matches('[data-del]')){
      const i = Number(e.target.getAttribute('data-del'));
      const tasks = load(); tasks.splice(i,1); save(tasks); render();
    } else if(e.target.closest('.checkbox')){
      const idx = Number(e.target.getAttribute('data-index'));
      const tasks = load(); tasks[idx].done = !tasks[idx].done; save(tasks); render();
    }
  });

  addBtn.addEventListener('click', ()=>{
    const v = input.value.trim(); if(!v) return;
    const tasks = load(); tasks.push({text:v, done:false}); save(tasks); input.value=''; render();
  });

  if(newTaskBtn) newTaskBtn.addEventListener('click', ()=>{ document.getElementById('taskInput').focus(); });

  render();
}

function timerModule(){
  const display = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  let total = 25*60; // seconds
  let remaining = total;
  let interval = null;

  function format(s){ const m=Math.floor(s/60); const sec=s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}` }
  function update(){ display.textContent = format(remaining); }

  function start(){ if(interval) return; interval = setInterval(()=>{ remaining--; if(remaining<=0){ clearInterval(interval); interval=null; remaining=0; update(); alert('Focus session complete!'); } update(); },1000); }
  function pause(){ if(interval){ clearInterval(interval); interval=null; } }
  function reset(){ pause(); remaining = total; update(); }

  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);

  update();
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('taskList')) tasksModule();
  if(document.getElementById('timerDisplay')) timerModule();
});
