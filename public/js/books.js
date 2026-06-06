const API = '/api/books';
const body = document.getElementById('booksBody'),
      addBtn = document.getElementById('addBtn');

async function load() {
  const res = await fetch(API);
  const data = await res.json();

  body.innerHTML = data.map(b =>
    `<tr>
      <td>${b.id}</td>
      <td>${escapeHtml(b.title)}</td>
      <td>${escapeHtml(b.author)}</td>
      <td>${escapeHtml(b.publisher)}</td>
      <td>
        <button class="edit" data-id="${b.id}">Edit</button>
        <button class="del" data-id="${b.id}">Delete</button>
      </td>
    </tr>`
  ).join('');

  attach();
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function attach() {
  // delete buttons
  document.querySelectorAll('.del').forEach(b => {
    b.onclick = async e => {
      if (!confirm('Delete?')) return;
      const id = e.target.dataset.id;
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      load();
    };
  });

  // edit buttons
  document.querySelectorAll('.edit').forEach(b => {
    b.onclick = async e => {
      const id = e.target.dataset.id;
      const res = await fetch(`${API}/${id}`);
      const r = await res.json();

      const title = prompt('Title', r.title);
      if (title === null) return;

      const author = prompt('Author', r.author);
      if (author === null) return;

      const publisher = prompt('Publisher', r.publisher);
      if (publisher === null) return;

      await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, publisher })
      });

      load();
    };
  });
}

addBtn.onclick = async () => {
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const publisher = document.getElementById('publisher').value.trim();

  if (!title) return alert('Title required');

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, publisher })
  });

  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('publisher').value = '';

  load();
};

load();
