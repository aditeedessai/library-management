const API = '/api/issued';

const selM = document.getElementById('selMember'),
      selB = document.getElementById('selBook'),
      body = document.getElementById('issuedBody'),
      issueBtn = document.getElementById('issueBtn');

// Load dropdown values
async function loadSelectors() {
  const ms = await (await fetch('/api/members')).json();
  selM.innerHTML = ms
    .map(m => `<option value="${m.id}">${m.membername}</option>`)
    .join('');

  const bs = await (await fetch('/api/books')).json();
  selB.innerHTML = bs
    .map(b => `<option value="${b.id}">${b.title}</option>`)
    .join('');
}

// Load issued records
async function load() {
  const res = await fetch(API);
  const data = await res.json();

  body.innerHTML = data
    .map(i => `
      <tr>
        <td>${i.id}</td>
        <td>${escapeHtml(i.membername)}</td>
        <td>${escapeHtml(i.title)}</td>
        <td>${i.issuedate}</td>
        <td>${i.returndate || ''}</td>
        <td>
          <button class="del" data-id="${i.id}">Delete</button>
        </td>
      </tr>
    `)
    .join('');

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
      await fetch(`${API}/${e.target.dataset.id}`, { method: 'DELETE' });
      load();
    };
  });
}

// Issue a book
issueBtn.onclick = async () => {
  const member_id = selM.value;
  const book_id = selB.value;
  const issuedate = document.getElementById('issuedate').value;
  const returndate = document.getElementById('returndate').value;

  if (!member_id || !book_id || !issuedate)
    return alert('Select member, book and issue date');

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ member_id, book_id, issuedate, returndate })
  });

  load();
};

// Initialize
loadSelectors().then(load);
