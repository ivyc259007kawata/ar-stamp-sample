window.addEventListener('load', () => {
  const params = new URLSearchParams(location.search);
  const spot = params.get('spot');
  const message = document.getElementById('message');

  if (!spot) {
    message.textContent = 'スポット情報がありません';
    return;
  }

  // ★PC/スマホでfovを切り替えてズームを補正
  // 固定解像度を解除したため、スマホの数値を50から65（やや広角）に微調整しています
  const cameraEl = document.getElementById('camera');
  const isMobile = /iPhone|Android/i.test(navigator.userAgent);
  const fov = isMobile ? 65 : 80;
  if (cameraEl) {
    cameraEl.setAttribute('camera', 'fov', fov);
  }

  // A-Frameのシーンが準備できてからマーカーを取得
  const scene = document.querySelector('a-scene');

  const attachMarkerListener = () => {
    const marker = document.querySelector('#marker');
    if (!marker) return;

    marker.addEventListener('markerFound', () => {
      if (localStorage.getItem(spot)) {
        message.textContent = '✔ 取得済み';
        return;
      }
      localStorage.setItem(spot, 'clear');
      message.textContent = '🎉 スタンプ獲得！';
    });

    marker.addEventListener('markerLost', () => {
      // 未取得の場合だけメッセージをリセット
      if (!localStorage.getItem(spot)) {
        message.textContent = 'マーカーを読み取ってください';
      }
    });
  };

  if (scene.hasLoaded) {
    attachMarkerListener();
  } else {
    scene.addEventListener('loaded', attachMarkerListener);
  }
});