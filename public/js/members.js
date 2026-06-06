const API = '/api/members';

const body = document.getElementById('membersBody'),
      addBtn = document.getElementById('addM');

// Load all members
async function load() {
  const res = await fetch(API);
  const data = await res.json();

  body.innerHTML = data.map(m => `
    <tr>
      <td>${m.id}</td>
      <td>${escapeHtml(m.membername)}</td>
      <td>${m.joindate || ''}</td>
      <td>
        <button class="del" data-id="${m.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  attach();
}

// Escape HTML
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

// Delete handler
function attach() {
  document.querySelectorAll('.del').forEach(btn => {
    btn.onclick = async e => {
      if (!confirm('Delete?')) return;

      await fetch(`${API}/${e.target.dataset.id}`, {
        method: 'DELETE'
      });

      load();
    };
  });
}

// Add member
addBtn.onclick = async () => {
  const name = document.getElementById('mname').value.trim();
  const join = document.getElementById('joindate').value;

  if (!name) return alert('Name required');

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      membername: name,
      joindate: join
    })
  });

  document.getElementById('mname').value = '';
  load();
};

// Initial load
load();
