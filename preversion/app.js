window.addEventListener("load", () => {


    const params = new URLSearchParams(location.search);
    const spot = params.get("spot");

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

    const spotNameEl = document.getElementById("spotName");
    const message = document.getElementById("message");
    const target = document.querySelector(".target");
    const debugEl = document.getElementById("debug");

    if (!spot || !markerFiles[spot]) {
        if (message) {
            message.textContent = "スポット情報がありません";
        }
        return;
    }

    if (spotNameEl) {
        spotNameEl.textContent = spotNames[spot];
    }

    if (debugEl) {
        debugEl.textContent = markerFiles[spot];
    }

    const scene = document.querySelector("a-scene");

    const init = () => {

        const markerEl = document.getElementById("marker");

        if (!markerEl) {
            console.error("marker が見つかりません");
            return;
        }

        markerEl.setAttribute("url", markerFiles[spot]);

        markerEl.addEventListener("markerFound", () => {

            if (target) {
                target.style.borderColor = "#4caf50";
                target.style.background = "rgba(76,175,80,0.2)";
            }

            if (localStorage.getItem(spot)) {
                if (message) {
                    message.textContent = "✔ 取得済み";
                }
                return;
            }

            localStorage.setItem(spot, "clear");

            if (message) {
                message.textContent = "🎉 スタンプ獲得！";
                message.style.color = "#2e7d32";
                message.style.fontWeight = "bold";
            }
        });

        markerEl.addEventListener("markerLost", () => {

            if (target) {
                target.style.borderColor = "#ff9800";
                target.style.background = "transparent";
            }

            if (!localStorage.getItem(spot) && message) {
                message.textContent = "マーカーを中央に合わせてください";
                message.style.color = "#000";
                message.style.fontWeight = "normal";
            }
        });
    };

    if (scene.hasLoaded) {
        init();
    } else {
        scene.addEventListener("loaded", init);
    }


});
