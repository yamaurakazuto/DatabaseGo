interface Todo {
  id: number;
  title: string;
  done: boolean;
  createdAt: number;
}

const form = document.querySelector<HTMLFormElement>('#todo-form');
const input = document.querySelector<HTMLInputElement>('#todo-input');
const list = document.querySelector<HTMLUListElement>('#todo-list');
const emptyState = document.querySelector<HTMLDivElement>('#empty-state');
const stats = document.querySelector<HTMLDivElement>('#todo-stats');
const clearButton = document.querySelector<HTMLButtonElement>('#clear-completed');
const message = document.querySelector<HTMLParagraphElement>('#message');

if (!form || !input || !list || !emptyState || !stats || !clearButton || !message) {
  throw new Error('Required UI elements are missing from the document.');
}

let todos: Todo[] = [];

const formatDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
};

const updateStats = () => {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.done).length;
  const remaining = total - completed;

  stats.innerHTML = `
    <div class="stat">
      <span class="label">合計</span>
      <strong>${total}</strong>
    </div>
    <div class="stat">
      <span class="label">未完了</span>
      <strong>${remaining}</strong>
    </div>
    <div class="stat">
      <span class="label">完了</span>
      <strong>${completed}</strong>
    </div>
  `;

  clearButton.disabled = completed === 0;
};

const renderTodos = () => {
  list.innerHTML = '';

  if (todos.length === 0) {
    emptyState.hidden = false;
    updateStats();
    return;
  }

  emptyState.hidden = true;

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = 'todo-item';
    item.dataset.id = todo.id.toString();

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.ariaLabel = `${todo.title} を完了としてマーク`;
    const content = document.createElement('div');
    content.className = 'todo-content';

    const title = document.createElement('p');
    title.className = 'todo-title';
    title.textContent = todo.title;

    const meta = document.createElement('span');
    meta.className = 'todo-meta';
    meta.textContent = `作成: ${formatDate(todo.createdAt)}`;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'ghost';
    deleteButton.textContent = '削除';
    deleteButton.ariaLabel = `${todo.title} を削除`;

    actions.append(deleteButton);
    content.append(title, meta);
    item.append(checkbox, content, actions);

    if (todo.done) {
      item.classList.add('completed');
    }

    list.appendChild(item);
  });

  updateStats();
};

const showMessage = (text: string, tone: 'info' | 'warning' = 'info') => {
  message.textContent = text;
  message.dataset.tone = tone;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();

  if (!title) {
    showMessage('タスク名を入力してください。', 'warning');
    input.focus();
    return;
  }

  const newTodo: Todo = {
    id: Date.now(),
    title,
    done: false,
    createdAt: Date.now(),
  };

  todos = [newTodo, ...todos];
  input.value = '';
  showMessage('タスクを追加しました。');
  renderTodos();
});

list.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const item = target.closest<HTMLLIElement>('li.todo-item');

  if (!item) return;
  const id = Number(item.dataset.id);

  if (target.tagName === 'INPUT') {
    todos = todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
    renderTodos();
    return;
  }

  if (target.tagName === 'BUTTON') {
    todos = todos.filter((todo) => todo.id !== id);
    showMessage('タスクを削除しました。');
    renderTodos();
  }
});

clearButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.done);
  showMessage('完了済みのタスクを整理しました。');
  renderTodos();
});

input.addEventListener('input', () => {
  if (message.textContent) {
    message.textContent = '';
    delete message.dataset.tone;
  }
});

renderTodos();
