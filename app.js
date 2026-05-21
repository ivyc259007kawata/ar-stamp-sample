const marker = document.querySelector('#marker');
const params = new URLSearchParams(location.search);
const spot = params.get('spot');
const message = document.getElementById('message');

if (marker && spot) {

  marker.addEventListener('markerFound', () => {

    if (localStorage.getItem(spot)) {
      message.textContent = '✔ 取得済み';
      return;
    }

    localStorage.setItem(spot, 'clear');
    message.textContent = '✔ スタンプ獲得！';

  });

}