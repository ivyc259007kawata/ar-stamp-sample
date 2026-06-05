window.addEventListener('load', () => {

    const params =
        new URLSearchParams(location.search);

    const spot =
        params.get('spot');

    const spotNames = {
        jinja: "🏯 神社",
        park: "🌸 公園",
        libra: "📚 図書館"
    };

    const spotName =
        document.getElementById("spotName");

    if (spotName) {
        spotName.textContent =
            spotNames[spot] || "スポット";
    }

    const message =
        document.getElementById('message');

    const target =
        document.querySelector('.target');

    if (!spot) {
        message.textContent =
            'スポット情報がありません';
        return;
    }

    // カメラ設定
    const cameraEl =
        document.getElementById('camera');

    const isMobile =
        /iPhone|Android/i.test(
            navigator.userAgent
        );

    const fov =
        isMobile ? 65 : 80;

    if (cameraEl) {
        cameraEl.setAttribute(
            'camera',
            'fov',
            fov
        );
    }

    const scene =
        document.querySelector('a-scene');

    const attachMarkerListener = () => {

        const marker =
            document.querySelector('#marker');

        if (!marker) return;

        // マーカー発見
        marker.addEventListener(
            'markerFound',
            () => {

                target.style.borderColor =
                    '#4caf50';

                target.style.background =
                    'rgba(76,175,80,0.2)';

                if (
                    localStorage.getItem(spot)
                ) {

                    message.textContent =
                        '✔ 取得済み';

                    return;
                }

                localStorage.setItem(
                    spot,
                    'clear'
                );

                message.textContent =
                    '🎉 スタンプ獲得！';

                message.style.color =
                    '#2e7d32';

                message.style.fontWeight =
                    'bold';
            }
        );

        // マーカー見失い
        marker.addEventListener(
            'markerLost',
            () => {

                target.style.borderColor =
                    '#ff9800';

                target.style.background =
                    'transparent';

                if (
                    !localStorage.getItem(spot)
                ) {

                    message.textContent =
                        'マーカーを中央に合わせてください';

                    message.style.color =
                        '#000';
                }
            }
        );
    };

    if (scene.hasLoaded) {
        attachMarkerListener();
    } else {
        scene.addEventListener(
            'loaded',
            attachMarkerListener
        );
    }

});