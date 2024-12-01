const icons = [
  {
    iconName: 'paper',
    iconColor: 'hsl(230, 89%, 62%)'
  },
  {
    iconName: 'scissors',
    iconColor: 'hsl(39, 89%, 49%)'
  },
  {
    iconName: 'rock',
    iconColor: 'hsl(349, 71%, 52%)'
  }
]

const rules = {
  paper: {
    paper: 'draw',
    scissors: 'lose',
    rock: 'win'
  },
  scissors: {
    paper: 'win',
    scissors: 'draw',
    rock: 'lose'
  },
  rock: {
    paper: 'lose',
    scissors: 'win',
    rock: 'draw'
  }
}

let score = 0;
const scoreText = document.querySelector('.score-value');
scoreText.textContent = score;


async function fetchIcons() {
  const fetchPromises = icons.map(icon =>
    fetch(`./images/icon-${icon.iconName}.svg`)
      .then(resp => resp.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");

        const scriptElements = doc.getElementsByTagName('script');
        while (scriptElements.length > 0) {
          scriptElements[0].parentNode.removeChild(scriptElements[0]);
        }

        const cleanedSVG = new XMLSerializer().serializeToString(doc);
        icon.iconSVG = cleanedSVG;
      })
  );
  await Promise.all(fetchPromises);
}

async function fetchRules() {
  await fetch('./images/image-rules.svg').then(resp => resp.text()).then(text => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");

    const scriptElements = doc.getElementsByTagName('script');
    while (scriptElements.length > 0) {
      scriptElements[0].parentNode.removeChild(scriptElements[0]);
    }

    const cleanedSVG = new XMLSerializer().serializeToString(doc);
    document.querySelector('#rules .content').innerHTML = cleanedSVG;
  });
}

fetchIcons().then(() => {
  icons.forEach((icon, indx) => {
    const gameItems = document.querySelector('.game-body .items')
    const item = document.createElement('div')
    item.classList.add('item');
    item.id = indx;
    item.innerHTML = icon.iconSVG
    item.style.borderColor = icon.iconColor;
    gameItems.appendChild(item);

    item.addEventListener('click', (e) => {
      let item = e.target;
      if (item.className !== 'item')
        while (item.className !== 'item') {
          item = item.parentElement
        }
      const gameBody = document.querySelector('.game-body');
      gameBody.style.display = 'none';
      handleUserSelection(item)
    })
  })
});

fetchRules();

function handleUserSelection(selection) {
  const itemId = selection.getAttribute('id');
  const icon = icons[itemId]
  const gameResult = document.querySelector('.game-result .user');
  const item = document.createElement('div')

  item.classList.add('item');
  item.innerHTML = icon.iconSVG
  item.style.borderColor = icon.iconColor;
  gameResult.appendChild(item);

  getHouseChoice(icon.iconName);
}

function getHouseChoice(userSelection) {
  const choice = Math.floor(Math.random() * 100 % 3);
  const icon = icons[choice]
  const gameResult = document.querySelector('.game-result .house');
  const item = document.createElement('div')

  item.classList.add('item');
  item.innerHTML = icon.iconSVG
  item.style.borderColor = icon.iconColor;
  gameResult.appendChild(item);

  judgeResult(userSelection, icon.iconName);
}

function judgeResult(userSelection, houseSelection) {
  const result = rules[userSelection][houseSelection]
  const resultDiv = document.querySelector('.game-result');
  const button = document.querySelector('.game-result .result button');

  document.querySelector('.game-result .result p').textContent = result !== 'draw' ? `YOU ${result.toUpperCase()}` : `IT'S A ${result.toUpperCase()}`;
  button.classList.add(result);
  resultDiv.style.display = 'flex';

  if (result === 'win') resultDiv.firstElementChild.firstElementChild.classList.add('winner');
  if (result === 'lose') resultDiv.lastElementChild.firstElementChild.classList.add('winner');

  scoreText.textContent = result === 'win' ? score += 1 : score;
}

function reloadGame() {
  const gameBody = document.querySelector('.game-body');
  gameBody.style.display = 'block'
  const resultDiv = document.querySelector('.game-result');
  resultDiv.firstElementChild.firstElementChild.remove();
  resultDiv.lastElementChild.firstElementChild.remove();
  resultDiv.style.display = 'none';
}

function removePopover() {
  document.getElementById('rules').hidePopover();
}
