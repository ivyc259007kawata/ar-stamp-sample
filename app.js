const marker = document.querySelector('#marker');

const params = new URLSearchParams(location.search);

const spot = params.get('spot');

const message = document.getElementById('message');

marker.addEventListener('markerFound', () => {

  // すでに取得済みなら終了
  if(localStorage.getItem(spot)) {
    return;
  }

  // localStorageへ保存
  localStorage.setItem(spot, 'clear');

  // メッセージ変更
  message.textContent = '✔ スタンプ獲得！';

});