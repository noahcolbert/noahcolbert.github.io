// typing.js

// 1) Utility to pause
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// 2) Type one line into container, char-by-char
async function typeLine(text, { container, cursor, mask = false, delayAfter = 500 }) {
  const lineEl = document.createElement('div');
  container.appendChild(lineEl);

  for (let ch of text) {
    // If mask==true (for passwords), replace with •
    lineEl.textContent += mask ? '•' : ch;
    await sleep(50);
  }

  // After finishing the text, leave cursor at end
  lineEl.appendChild(cursor);
  await sleep(delayAfter);
  // move cursor to a new line
  lineEl.removeChild(cursor);
  return;
}

async function runTerminal(steps) {
  const container = document.getElementById('terminal');

  // prepare a single blinking cursor element
  const cursor = document.createElement('span');
  cursor.className = 'blinking';
  cursor.textContent = '▯';

  // run through each step
  for (let step of steps) {
    await typeLine(step.text, {
      container,
      cursor,
      mask: step.mask || false,
      delayAfter: step.delayAfter
    });
  }

  // reveal real page
  document.getElementById('page-content').classList.remove('hidden');
}

// 4) Build your dynamic date text first
const now = new Date();
const formattedDate = now.toDateString();
const formattedTime = now.toLocaleTimeString();

// 5) Define your sequence of lines—edit this per-page:
const steps = [
  { text: 'Non-Descript Linux 1.0.0-aarch64 (ttys000)',       delayAfter: 500 },
  { text: 'login: root',                                       delayAfter: 500 },
  { text: 'Password:',         mask: false,    delayAfter: 1000 },  // no mask-chars typed
  { text: `Last login: ${formattedDate} ${formattedTime} on ttys000`, delayAfter: 500 },
  { text: '[root@local ~]# ',                                 delayAfter: 300 },
  { text: 'cd /Noah_Colbert/',                                delayAfter: 500 },
];

// 6) Kick it off when DOM is ready
window.addEventListener('DOMContentLoaded', () => runTerminal(steps));
