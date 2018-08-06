'use strict';

var height = 20; // 設定高度
var width = 20; // 設定寬度
var arr = []; // 設定儲存陣列

// 遊戲開始
start(10);

// 轉換難度
var form = document.querySelector('.form');
form.addEventListener('change', function (e) {
  var degree = e.srcElement.defaultValue;
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

function start(boom) {
  var container = document.querySelector('.container');
  container.innerHTML = '';
  var floor = height * width;
  for (var i = 0; i < height; i++) {
    var arrIn = []; // 設定內存陣列 儲存二維陣列給一維用
    var tr = document.createElement('tr');
    container.appendChild(tr);
    for (var j = 0; j < width; j++) {
      var _floor = document.createElement('td');
      _floor.className = 'floor hide';
      arrIn.push(_floor); // 把td加入陣列中
      container.appendChild(_floor);
    }
    arr[i] = arrIn; // 完整陣列
  }
  // 隨機加入炸彈 使用遞迴法
  (function boom(n) {
    if (n === 0) {
      return 1;
    };
    var x = Math.floor(Math.random() * width);
    var y = Math.floor(Math.random() * height);
    // 判斷是否已經加入炸彈
    if (!arr[x][y].classList.contains('boom')) {
      arr[x][y].classList.add('boom');
      return boom(n - 1);
    }
    return boom(n);
  })(boom);

  // 陣列加入監聽;

  var _loop = function _loop(_i) {
    var _loop2 = function _loop2(_j) {
      arr[_i][_j].addEventListener('click', function () {
        play(_i, _j);
      });
    };

    for (var _j = 0; _j < width; _j++) {
      _loop2(_j);
    }
  };

  for (var _i = 0; _i < height; _i++) {
    _loop(_i);
  }

  // 監聽的callback函數
  function play(i, j) {
    var n = 0;
    for (var y = -1; y <= 1; y++) {
      for (var x = -1; x <= 1; x++) {
        // 判斷陣列是否超出範圍 超出就continue 之後判斷此點周圍炸彈 n+1
        if (i - y < 0 || j - x < 0 || i - y > height - 1 || j - x > width - 1) {
          continue;
        } else if (arr[i - y][j - x].classList.contains('boom')) {
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
        window.setTimeout(function () {
          cb();
        }, 100);
      })(function () {
        window.alert('boom');return start(boom);
      });
    }

    // 判斷是否已經打開 不要讓程式一直run
    if (!arr[i][j].classList.contains('hide')) {
      return 1;
    }
    if (n !== 0) {
      arr[i][j].textContent = n;
      arr[i][j].classList.remove('hide');
      floor -= 1;
      if (floor === boom) {
        return window.alert('You,win');
      }
      return 1;
    }

    // 判斷邊界是否超出範圍
    if (i === 0 || j === 0 || i === height - 1 || j === width - 1) {
      arr[i][j].classList.remove('hide');
      floor -= 1;
      if (floor === boom) {
        return window.alert('You,win');
      }
      return 1;
    }
    // 用遞迴判斷8個方向
    arr[i][j].classList.remove('hide');
    floor -= 1;
    if (floor === boom) {
      return window.alert('You,win');
    }

    return play(i - 1, j - 1) + play(i - 1, j) + play(i - 1, j + 1) + play(i + 1, j - 1) + play(i + 1, j) + play(i, j - 1) + play(i, j + 1) + play(i + 1, j + 1);
  };
}
//# sourceMappingURL=all.js.map
