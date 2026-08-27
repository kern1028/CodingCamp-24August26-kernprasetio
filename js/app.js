/* ═══════════════════════════════════════════════
   ☕ Life Dashboard — app.js
   Vanilla JS | LocalStorage | No frameworks
═══════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────
   STORAGE HELPERS
────────────────────────────────────────────── */
const store = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
};

/* ──────────────────────────────────────────────
   TOAST
────────────────────────────────────────────── */
const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(msg, duration = 2500) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}

/* ══════════════════════════════════════════════
   1. CLOCK & GREETING
══════════════════════════════════════════════ */
const clockEl       = document.getElementById('clock');
const dateEl        = document.getElementById('dateDisplay');
const greetingMsgEl = document.getElementById('greetingMsg');
const greetingNameEl= document.getElementById('userName');
const btnEditName   = document.getElementById('btnEditName');
const nameModal     = document.getElementById('nameModal');
const nameInput     = document.getElementById('nameInput');
const btnSaveName   = document.getElementById('btnSaveName');
const btnCancelName = document.getElementById('btnCancelName');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good Morning ☀️';
  if (hour >= 12 && hour < 17) return 'Good Afternoon 🌤';
  if (hour >= 17 && hour < 21) return 'Good Evening 🌆';
  return 'Good Night 🌙';
}

function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2,'0');
  const m    = String(now.getMinutes()).padStart(2,'0');
  const s    = String(now.getSeconds()).padStart(2,'0');
  clockEl.textContent = `${h}:${m}:${s}`;
  dateEl.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  greetingMsgEl.textContent = getGreeting(now.getHours());
}

function loadUserName() {
  const name = store.get('userName', 'Friend');
  greetingNameEl.textContent = name;
}

/* Name modal */
btnEditName.addEventListener('click', () => {
  nameInput.value = store.get('userName', '');
  nameModal.classList.add('active');
  nameInput.focus();
});
btnSaveName.addEventListener('click', saveName);
btnCancelName.addEventListener('click', () => nameModal.classList.remove('active'));
nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });
nameModal.addEventListener('click', e => { if (e.target === nameModal) nameModal.classList.remove('active'); });

function saveName() {
  const val = nameInput.value.trim();
  if (!val) { showToast('⚠️ Please enter your name'); return; }
  store.set('userName', val);
  greetingNameEl.textContent = val;
  nameModal.classList.remove('active');
  showToast(`🌸 Welcome, ${val}!`);
}

setInterval(updateClock, 1000);
updateClock();
loadUserName();

/* ══════════════════════════════════════════════
   2. FOCUS TIMER (Pomodoro)
══════════════════════════════════════════════ */
const timerDisplayEl   = document.getElementById('timerDisplay');
const timerLabelEl     = document.getElementById('timerLabel');
const timerProgressBar = document.getElementById('timerProgressBar');
const durationValueEl  = document.getElementById('durationValue'); // now an <input>
const btnStart         = document.getElementById('btnStart');
const btnStop          = document.getElementById('btnStop');
const btnReset         = document.getElementById('btnReset');
const btnDurDown       = document.getElementById('btnDurDown');
const btnDurUp         = document.getElementById('btnDurUp');
const pomodoroCountEl  = document.getElementById('pomodoroCount');

let timerDuration  = store.get('timerDuration', 25); // minutes
let timeLeft       = timerDuration * 60;             // seconds
let timerInterval  = null;
let timerRunning   = false;
let pomodoroCount  = store.get('pomodoroCount', 0);

const TIMER_LABELS = {
  idle:    'Ready to focus?',
  running: 'Stay focused — you got this! 💪',
  paused:  'Paused — take a breath 🌿',
  done:    'Session complete! 🎉 Great work!'
};

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2,'0');
  const s = String(secs % 60).padStart(2,'0');
  return `${m}:${s}`;
}

function updateTimerUI() {
  timerDisplayEl.textContent = formatTime(timeLeft);
  const total    = timerDuration * 60;
  const progress = total > 0 ? (timeLeft / total) * 100 : 0;
  timerProgressBar.style.width = progress + '%';
}

function setDuration(mins) {
  timerDuration = Math.max(1, Math.min(90, mins));
  store.set('timerDuration', timerDuration);
  durationValueEl.value = timerDuration;        // input.value not .textContent
  if (!timerRunning) {
    timeLeft = timerDuration * 60;
    updateTimerUI();
  }
}

function startTimer() {
  if (timerRunning) return;
  if (timeLeft <= 0) timeLeft = timerDuration * 60;
  timerRunning = true;
  timerDisplayEl.classList.add('running');
  timerDisplayEl.classList.remove('finished');
  timerLabelEl.textContent = TIMER_LABELS.running;
  btnStart.textContent = '▶ Running';
  btnStart.disabled = true;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerInterval = null;
      timerDisplayEl.classList.remove('running');
      timerDisplayEl.classList.add('finished');
      timerLabelEl.textContent = TIMER_LABELS.done;
      btnStart.textContent = '▶ Start';
      btnStart.disabled = false;
      pomodoroCount++;
      store.set('pomodoroCount', pomodoroCount);
      pomodoroCountEl.textContent = pomodoroCount;
      showToast('🍅 Focus session complete! Take a break!', 4000);
      // browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('☕ Focus session done!', { body: 'Time for a well-earned break.' });
      }
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  timerDisplayEl.classList.remove('running');
  timerLabelEl.textContent = TIMER_LABELS.paused;
  btnStart.textContent = '▶ Start';
  btnStart.disabled = false;
  showToast('⏸ Timer paused');
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  timeLeft = timerDuration * 60;
  timerDisplayEl.classList.remove('running','finished');
  timerLabelEl.textContent = TIMER_LABELS.idle;
  btnStart.textContent = '▶ Start';
  btnStart.disabled = false;
  updateTimerUI();
  showToast('↺ Timer reset');
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', stopTimer);
btnReset.addEventListener('click', resetTimer);
btnDurDown.addEventListener('click', () => { if (!timerRunning) setDuration(timerDuration - 1); });
btnDurUp.addEventListener('click',   () => { if (!timerRunning) setDuration(timerDuration + 1); });

// Keyboard input: user can type a number directly into the duration field
durationValueEl.addEventListener('input', () => {
  if (timerRunning) { durationValueEl.value = timerDuration; return; }
  const val = parseInt(durationValueEl.value, 10);
  if (!isNaN(val) && val >= 1 && val <= 90) setDuration(val);
});
durationValueEl.addEventListener('blur', () => {
  // Snap to valid range on blur in case user left it blank / out of range
  const val = parseInt(durationValueEl.value, 10);
  setDuration(isNaN(val) ? timerDuration : val);
});
durationValueEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') { durationValueEl.blur(); }
});

// Request notification permission on first interaction
document.addEventListener('click', () => {
  if (Notification && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, { once: true });

// Init timer display
durationValueEl.value       = timerDuration;
pomodoroCountEl.textContent = pomodoroCount;
updateTimerUI();

/* ══════════════════════════════════════════════
   3. TO-DO LIST  (with deadline + priority)
══════════════════════════════════════════════ */

/* ── DOM refs ── */
const todoInputEl    = document.getElementById('todoInput');
const todoDueDateEl  = document.getElementById('todoDueDate');
const todoPriorityEl = document.getElementById('todoPriority');
const btnAddTodo     = document.getElementById('btnAddTodo');
const btnToggleForm  = document.getElementById('btnToggleForm');
const btnCancelForm  = document.getElementById('btnCancelForm');
const todoFormWrap   = document.getElementById('todoFormWrap');
const todoListEl     = document.getElementById('todoList');
const todoEmptyEl    = document.getElementById('todoEmpty');
const todoStatsEl    = document.getElementById('todoStats');
const sortSelectEl   = document.getElementById('sortSelect');
const filterTabsEl   = document.getElementById('filterTabs');

const editModal      = document.getElementById('editModal');
const editInputEl    = document.getElementById('editInput');
const editDueDateEl  = document.getElementById('editDueDate');
const editPriorityEl = document.getElementById('editPriority');
const btnSaveEdit    = document.getElementById('btnSaveEdit');
const btnCancelEdit  = document.getElementById('btnCancelEdit');

let todos      = store.get('todos', []);
let editingId  = null;
let activeFilter = 'all';

/* ── ID generator (shared with links section) ── */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/* ── HTML escape ── */
function escapeHtml(str) {
  return str
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ── Preset date helpers ── */
function getPresetDate(preset) {
  const d = new Date();
  d.setSeconds(0, 0);
  if (preset === 'today') {
    d.setHours(23, 59);
  } else if (preset === 'tomorrow') {
    d.setDate(d.getDate() + 1);
    d.setHours(23, 59);
  } else if (preset === 'nextweek') {
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59);
  }
  // format to datetime-local value (YYYY-MM-DDTHH:MM)
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ── Time status helpers ── */
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function getTimeStatus(todo) {
  if (todo.done) return { label: '✓ Done', cls: 'time-status--done' };
  if (!todo.dueDate) return null;

  const now      = Date.now();
  const due      = new Date(todo.dueDate).getTime();
  const diffMs   = due - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs  = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) {
    const ago = Math.abs(diffMins);
    const label = ago < 60
      ? `⚠️ Overdue ${ago}m ago`
      : ago < 1440
        ? `⚠️ Overdue ${Math.floor(ago/60)}h ago`
        : `⚠️ Overdue ${Math.floor(ago/1440)}d ago`;
    return { label, cls: 'time-status--overdue', overdue: true };
  }
  if (diffMins < 60)  return { label: `⏰ Due in ${diffMins}m`,          cls: 'time-status--today' };
  if (diffHrs  < 6)   return { label: `⏰ Due in ${diffHrs}h`,            cls: 'time-status--today' };
  if (diffDays === 0) return { label: `📅 Due today`,                      cls: 'time-status--today' };
  if (diffDays === 1) return { label: `📅 Due tomorrow`,                   cls: 'time-status--soon' };
  if (diffDays < 7)   return { label: `📅 Due in ${diffDays} days`,        cls: 'time-status--soon' };
  return { label: `📅 ${new Date(todo.dueDate).toLocaleDateString()}`,     cls: 'time-status--ok' };
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const n = new Date();
  return d.getFullYear() === n.getFullYear()
      && d.getMonth()    === n.getMonth()
      && d.getDate()     === n.getDate();
}
function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr).getTime();
  const n = Date.now();
  // future but not today
  return d > n && !isToday(dateStr);
}

/* ── Filter & sort ── */
function getFilteredSortedTodos() {
  let filtered = [...todos];

  // Filter
  if (activeFilter === 'today') {
    filtered = filtered.filter(t => !t.done && isToday(t.dueDate));
  } else if (activeFilter === 'upcoming') {
    filtered = filtered.filter(t => !t.done && isUpcoming(t.dueDate));
  } else if (activeFilter === 'completed') {
    filtered = filtered.filter(t => t.done);
  }

  // Sort
  const mode = sortSelectEl.value;
  filtered.sort((a, b) => {
    if (mode === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (mode === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (mode === 'alpha')    return a.text.localeCompare(b.text);
    if (mode === 'done')     return Number(a.done) - Number(b.done);
    return a.createdAt - b.createdAt; // default
  });

  return filtered;
}

/* ── Save ── */
function saveTodos() { store.set('todos', todos); }

/* ── Render ── */
function renderTodos() {
  const filtered = getFilteredSortedTodos();
  todoListEl.innerHTML = '';

  const total = todos.length;
  const done  = todos.filter(t => t.done).length;
  todoStatsEl.textContent = `${total} task${total !== 1 ? 's' : ''} · ${done} done`;
  todoEmptyEl.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach(todo => {
    const timeStatus = getTimeStatus(todo);
    const isOverdue  = timeStatus?.overdue && !todo.done;

    const li = document.createElement('li');
    li.className = ['todo-item', todo.done ? 'done' : '', isOverdue ? 'overdue' : '', todo.id === highlightedId ? 'highlighted' : ''].filter(Boolean).join(' ');
    li.dataset.id = todo.id;

    // Priority badge
    const priorityLabels = { high:'🔴 High', medium:'🟡 Medium', low:'🟢 Low' };
    const priorityBadge  = `<span class="priority-badge ${todo.priority}">${priorityLabels[todo.priority] || 'Medium'}</span>`;

    // Time status badge
    const timeBadge = timeStatus
      ? `<span class="todo-time-status ${timeStatus.cls}">${timeStatus.label}</span>`
      : '';

    li.innerHTML = `
      <div class="todo-top-row">
        <input type="checkbox" class="todo-checkbox" ${todo.done ? 'checked' : ''} aria-label="Mark done" />
        <div class="todo-name-wrap">
          <div class="todo-text">${escapeHtml(todo.text)}</div>
          <div class="todo-meta-chips">
            ${priorityBadge}
          </div>
        </div>
      </div>
      <div class="todo-due-row">
        <div>${timeBadge}</div>
        <div class="todo-actions">
          <button class="btn-icon btn-start-task" title="Highlight task">📌 Focus</button>
          <button class="btn-icon btn-edit-task"  title="Edit task">✏️</button>
          <button class="btn-icon btn-delete-task" title="Delete task">🗑️</button>
        </div>
      </div>`;

    li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
    li.querySelector('.btn-start-task').addEventListener('click', () => highlightTask(todo.id));
    li.querySelector('.btn-edit-task').addEventListener('click',  () => openEditModal(todo.id));
    li.querySelector('.btn-delete-task').addEventListener('click',() => deleteTodo(todo.id));

    todoListEl.appendChild(li);
  });
}

/* ── Add form toggle ── */
btnToggleForm.addEventListener('click', () => {
  const isOpen = todoFormWrap.classList.toggle('open');
  btnToggleForm.textContent = isOpen ? '✕ Close' : '+ New Task';
  if (isOpen) todoInputEl.focus();
});
btnCancelForm.addEventListener('click', () => {
  todoFormWrap.classList.remove('open');
  btnToggleForm.textContent = '+ New Task';
  clearAddForm();
});

function clearAddForm() {
  todoInputEl.value    = '';
  todoDueDateEl.value  = '';
  todoPriorityEl.value = 'medium';
}

/* ── Preset buttons (add form) ── */
document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    todoDueDateEl.value = getPresetDate(btn.dataset.preset);
  });
});

/* ── Preset buttons (edit modal) ── */
document.querySelectorAll('[data-edit-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    editDueDateEl.value = getPresetDate(btn.dataset.editPreset);
  });
});

/* ── Add task ── */
function addTodo() {
  const text = todoInputEl.value.trim();
  if (!text) { showToast('⚠️ Please enter a task name'); todoInputEl.focus(); return; }

  const duplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) { showToast('⚠️ Task already exists!'); todoInputEl.focus(); return; }

  todos.push({
    id:        genId(),
    text,
    done:      false,
    dueDate:   todoDueDateEl.value  || null,
    priority:  todoPriorityEl.value || 'medium',
    createdAt: Date.now()
  });
  saveTodos();
  renderTodos();
  clearAddForm();
  todoInputEl.focus();
  showToast('✅ Task added!');
}

/* ── Toggle done ── */
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  saveTodos();
  renderTodos();
  showToast(todo.done ? '🌿 Task complete!' : '↩️ Task reopened');
}

/* ── Delete ── */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  showToast('🗑️ Task deleted');
}

/* ── Highlight task ── */
let highlightedId = null;
function highlightTask(id) {
  // Toggle: clicking the same task again removes highlight
  if (highlightedId === id) {
    highlightedId = null;
    showToast('📌 Highlight removed');
  } else {
    highlightedId = id;
    const todo = todos.find(t => t.id === id);
    showToast(`📌 Focused on: "${todo?.text}"`, 3000);
  }
  // Update highlight class without full re-render (avoid scroll jump)
  document.querySelectorAll('.todo-item').forEach(el => {
    el.classList.toggle('highlighted', el.dataset.id === highlightedId);
  });
  document.querySelectorAll('.btn-start-task').forEach(btn => {
    const li = btn.closest('.todo-item');
    btn.classList.toggle('active-highlight', li?.dataset.id === highlightedId);
  });
}

/* ── Edit modal ── */
function openEditModal(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  editingId             = id;
  editInputEl.value     = todo.text;
  editDueDateEl.value   = todo.dueDate || '';
  editPriorityEl.value  = todo.priority || 'medium';
  editPomosEl.value     = todo.pomodoros || 1;
  editModal.classList.add('active');
  editInputEl.focus();
  editInputEl.select();
}

function saveEdit() {
  const text = editInputEl.value.trim();
  if (!text) { showToast('⚠️ Task name cannot be empty'); return; }

  const duplicate = todos.some(t => t.id !== editingId && t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) { showToast('⚠️ Another task with that name already exists!'); return; }

  const todo = todos.find(t => t.id === editingId);
  if (todo) {
    todo.text      = text;
    todo.dueDate   = editDueDateEl.value  || null;
    todo.priority  = editPriorityEl.value || 'medium';
    saveTodos();
    renderTodos();
    showToast('✏️ Task updated!');
  }
  editModal.classList.remove('active');
  editingId = null;
}

/* ── Filter tabs ── */
filterTabsEl.addEventListener('click', e => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  filterTabsEl.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeFilter = tab.dataset.filter;
  renderTodos();
});

/* ── Sort ── */
sortSelectEl.addEventListener('change', renderTodos);

/* ── Edit modal buttons / keyboard ── */
btnAddTodo.addEventListener('click', addTodo);
todoInputEl.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
btnSaveEdit.addEventListener('click', saveEdit);
btnCancelEdit.addEventListener('click', () => { editModal.classList.remove('active'); editingId = null; });
editInputEl.addEventListener('keydown', e => { if (e.key === 'Enter') saveEdit(); });
editModal.addEventListener('click', e => { if (e.target === editModal) { editModal.classList.remove('active'); editingId = null; } });

/* ── Live countdown refresh every minute ── */
setInterval(renderTodos, 60000);

renderTodos();

/* ══════════════════════════════════════════════
   4. QUICK LINKS
══════════════════════════════════════════════ */
const linkNameEl  = document.getElementById('linkName');
const linkUrlEl   = document.getElementById('linkUrl');
const btnAddLink  = document.getElementById('btnAddLink');
const linksGridEl = document.getElementById('linksGrid');
const linksEmptyEl= document.getElementById('linksEmpty');

let links = store.get('quickLinks', [
  { id: genId(), name: 'Google',   url: 'https://www.google.com' },
  { id: genId(), name: 'YouTube',  url: 'https://www.youtube.com' },
  { id: genId(), name: 'GitHub',   url: 'https://www.github.com' }
]);

function saveLinks() {
  store.set('quickLinks', links);
}

function getFavicon(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
  } catch { return null; }
}

function renderLinks() {
  linksGridEl.innerHTML = '';
  linksEmptyEl.style.display = links.length === 0 ? 'block' : 'none';

  links.forEach(link => {
    const favicon = getFavicon(link.url);
    const chip = document.createElement('div');
    chip.className = 'link-chip-wrap';
    chip.style.display = 'inline-flex';
    chip.style.alignItems = 'center';

    const anchor = document.createElement('a');
    anchor.className = 'link-chip';
    anchor.href      = link.url;
    anchor.target    = '_blank';
    anchor.rel       = 'noopener noreferrer';
    anchor.innerHTML = favicon
      ? `<img class="favicon" src="${favicon}" alt="" onerror="this.style.display='none'"/>${escapeHtml(link.name)}`
      : escapeHtml(link.name);

    const delBtn = document.createElement('button');
    delBtn.className = 'link-chip-delete';
    delBtn.title     = 'Remove link';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', e => {
      e.preventDefault();
      deleteLink(link.id);
    });

    anchor.appendChild(delBtn);
    linksGridEl.appendChild(anchor);
  });
}

function addLink() {
  const name = linkNameEl.value.trim();
  const url  = linkUrlEl.value.trim();

  if (!name) { showToast('⚠️ Please enter a link name'); linkNameEl.focus(); return; }
  if (!url)  { showToast('⚠️ Please enter a URL');       linkUrlEl.focus();  return; }

  // Auto-prepend https:// if missing
  const fullUrl = /^https?:\/\//i.test(url) ? url : 'https://' + url;

  try { new URL(fullUrl); } catch {
    showToast('⚠️ That doesn\'t look like a valid URL');
    linkUrlEl.focus();
    return;
  }

  links.push({ id: genId(), name, url: fullUrl });
  saveLinks();
  renderLinks();
  linkNameEl.value = '';
  linkUrlEl.value  = '';
  linkNameEl.focus();
  showToast(`🔖 "${name}" added!`);
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
  showToast('🗑️ Link removed');
}

btnAddLink.addEventListener('click', addLink);
linkUrlEl.addEventListener('keydown',  e => { if (e.key === 'Enter') addLink(); });
linkNameEl.addEventListener('keydown', e => { if (e.key === 'Enter') linkUrlEl.focus(); });

renderLinks();

/* ══════════════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  // Escape closes any open modal
  if (e.key === 'Escape') {
    nameModal.classList.remove('active');
    editModal.classList.remove('active');
    editingId = null;
  }
});
