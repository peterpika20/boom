const height = 20; // 設定高度
const width = 20; // 設定寬度
let arr = []; // 設定儲存陣列

// 遊戲開始
start(10);

// 轉換難度
const form = document.querySelector('.form');
form.addEventListener('change', function (e) {
  let degree = e.srcElement.defaultValue;
  switch (degree) {
    case 'easy':
      start(10);
      break;
    case 'medium':
      start(50);
      break;
    case 'difficult':
      start(100);
      break;
  }
});

function start (boom) {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  let floor = height * width;
  for (let i = 0; i < height; i++) {
    let arrIn = []; // 設定內存陣列 儲存二維陣列給一維用
    let tr = document.createElement('tr');
    container.appendChild(tr);
    for (let j = 0; j < width; j++) {
      let floor = document.createElement('td');
      floor.className = 'floor hide';
      arrIn.push(floor); // 把td加入陣列中
      container.appendChild(floor);
    }
    arr[i] = arrIn; // 完整陣列
  }
  // 隨機加入炸彈 使用遞迴法
  (function boom (n) {
    if (n === 0) { return 1; };
    let x = Math.floor(Math.random() * width);
    let y = Math.floor(Math.random() * height);
    // 判斷是否已經加入炸彈
    if (!arr[x][y].classList.contains('boom')) {
      arr[x][y].classList.add('boom');
      return boom(n - 1);
    }
    return boom(n);
  })(boom);

  // 陣列加入監聽;

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      arr[i][j].addEventListener('click', function () { play(i, j); });
    }
  }

  // 監聽的callback函數
  function play (i, j) {
    let n = 0;
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
      // 判斷陣列是否超出範圍 超出就continue 之後判斷此點周圍炸彈 n+1
        if (i - y < 0 || j - x < 0 || i - y > height - 1 || j - x > width - 1) { continue; } else if (arr[i - y][j - x].classList.contains('boom')) {
          n += 1;
          continue;
        }
      }
    }
    // 判斷踩到炸彈
    if (arr[i][j].classList.contains('boom')) {
      // 使用callback function 確保順序正確
      (function (cb) {
        arr[i][j].classList.remove('hide');
        window.setTimeout(function () { cb(); }, 100);
      })(function () { window.alert('boom'); return start(boom); });
    }

    // 判斷是否已經打開 不要讓程式一直run
    if (!arr[i][j].classList.contains('hide')) {
      return 1;
    }
    if (n !== 0) {
      arr[i][j].textContent = n;
      arr[i][j].classList.remove('hide');
      floor -= 1;
      if (floor === boom) { return window.alert('You,win'); }
      return 1;
    }

    // 判斷邊界是否超出範圍
    if (i === 0 || j === 0 || i === height - 1 || j === width - 1) {
      arr[i][j].classList.remove('hide');
      floor -= 1;
      if (floor === boom) { return window.alert('You,win'); }
      return 1;
    }
    // 用遞迴判斷8個方向
    arr[i][j].classList.remove('hide');
    floor -= 1;
    if (floor === boom) { return window.alert('You,win'); }

    return play(i - 1, j - 1) + play(i - 1, j) + play(i - 1, j + 1) + play(i + 1, j - 1) + play(i + 1, j) + play(i, j - 1) + play(i, j + 1) + play(i + 1, j + 1);
  };
}
