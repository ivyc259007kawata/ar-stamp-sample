window.addEventListener('load', () => {

    const params =
        new URLSearchParams(location.search);

    const spot =
        params.get('spot');

    const markerFiles = {
        jinja: "img/jinja.patt",
        park: "img/park.patt",
        libra: "img/libra.patt"
    };

    const spotNames = {
        jinja: "🏯 神社",
        park: "🌸 公園",
        libra: "📚 図書館"
    };

    const spotName =
        document.getElementById("spotName");

    const message =
        document.getElementById("message");

    const target =
        document.querySelector(".target");

    const marker =
        document.querySelector("#marker");

    const debug =
        document.getElementById("debug");

    // スポット名表示
    if (spotName) {
        spotName.textContent =
            spotNames[spot] || "スポット";
    }

    // URLパラメータチェック
    if (!spot) {
        message.textContent =
            "スポット情報がありません";
        return;
    }

    // マーカー設定
    if (marker && markerFiles[spot]) {

        marker.setAttribute(
            "url",
            markerFiles[spot]
        );

    }

    // デバッグ表示
    if (debug) {

        debug.textContent =
            markerFiles[spot];

    }

    // カメラ設定
    const cameraEl =
        document.getElementById("camera");

    const isMobile =
        /iPhone|Android/i.test(
            navigator.userAgent
        );

    const fov =
        isMobile ? 65 : 80;

    if (cameraEl) {

        cameraEl.setAttribute(
            "camera",
            "fov",
            fov
        );

    }

    const scene =
        document.querySelector("a-scene");

    const attachMarkerListener = () => {

        const marker =
            document.querySelector("#marker");

        if (!marker) return;

        // マーカー検出
        marker.addEventListener(
            "markerFound",
            () => {

                target.style.borderColor =
                    "#4caf50";

                target.style.background =
                    "rgba(76,175,80,0.2)";

                if (
                    localStorage.getItem(spot)
                ) {

                    message.textContent =
                        "✔ 取得済み";

                    return;
                }

                localStorage.setItem(
                    spot,
                    "clear"
                );

                message.textContent =
                    "🎉 スタンプ獲得！";

                message.style.color =
                    "#2e7d32";

                message.style.fontWeight =
                    "bold";
            }
        );

        // マーカーを見失った
        marker.addEventListener(
            "markerLost",
            () => {

                target.style.borderColor =
                    "#ff9800";

                target.style.background =
                    "transparent";

                if (
                    !localStorage.getItem(spot)
                ) {

                    message.textContent =
                        "マーカーを中央に合わせてください";

                    message.style.color =
                        "#000";

                    message.style.fontWeight =
                        "normal";
                }
            }
        );
    };

    if (scene.hasLoaded) {

        attachMarkerListener();

    } else {

        scene.addEventListener(
            "loaded",
            attachMarkerListener
        );

    }

});