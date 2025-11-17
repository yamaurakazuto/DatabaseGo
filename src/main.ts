const form = document.querySelector<HTMLFormElement>('#text-form');
const input = document.querySelector<HTMLInputElement>('#text-input');
const output = document.querySelector<HTMLParagraphElement>('#output');

if (!form || !input || !output) {
  throw new Error('Form elements could not be found in the document.');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();

  if (!value) {
    output.textContent = '文字を入力してください。';
    output.dataset.status = 'warning';
    return;
  }

  output.textContent = `入力された文字: ${value}`;
  output.dataset.status = 'success';
});

input.addEventListener('input', () => {
  if (output.dataset.status) {
    output.textContent = '';
    delete output.dataset.status;
  }
});
