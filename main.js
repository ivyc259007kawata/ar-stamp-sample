document.addEventListener("DOMContentLoaded", () => {

    const spotIds = [
        "shrine",
        "park",
        "library"
    ];

    function updateMainPage() {

        // app.jsの共通機能から進捗を取得
        const progress =
            window.StampApp.getProgress();

        let clearedCount = 0;

        spotIds.forEach((spotId) => {

            const isCleared =
                progress[spotId];

            const status =
                document.getElementById(
                    `status-${spotId}`
                );

            const card =
                document.querySelector(
                    `[data-spot="${spotId}"]`
                );

            if (!status || !card) return;

            const button =
                card.querySelector(
                    ".spot-button"
                );

            const buttonText =
                card.querySelector(
                    ".button-text"
                );

            if (isCleared) {

                clearedCount++;

                status.textContent =
                    "クリア済み";

                status.classList.add(
                    "cleared"
                );

                button.classList.add(
                    "cleared-button"
                );

                buttonText.textContent =
                    "もう一度挑戦";

            } else {

                status.textContent =
                    "未クリア";

                status.classList.remove(
                    "cleared"
                );

                button.classList.remove(
                    "cleared-button"
                );

                buttonText.textContent =
                    "冒険に出発！";
            }
        });

        // =============================
        // 全体の進捗
        // =============================

        const count =
            document.getElementById(
                "progressCount"
            );

        const fill =
            document.getElementById(
                "progressFill"
            );

        const message =
            document.getElementById(
                "progressMessage"
            );

        count.textContent =
            `${clearedCount} / 3`;

        const percentage =
            (clearedCount / 3) * 100;

        fill.style.width =
            `${percentage}%`;

        // =============================
        // コンプリート判定
        // =============================

        const completeHomeMessage =
            document.getElementById(
                "completeHomeMessage"
            );

        const stampBanner =
            document.querySelector(
                ".stamp-banner"
            );

        if (clearedCount === 3) {

            message.textContent =
                "おめでとう！すべての謎をクリアしたよ！";

            // コンプリートメッセージを表示
            if (completeHomeMessage) {
                completeHomeMessage.style.display =
                    "flex";
            }

            // スタンプカード案内を少し特別にする
            if (stampBanner) {
                stampBanner.classList.add(
                    "complete"
                );
            }

        } else if (clearedCount === 0) {

            message.textContent =
                "さあ、最初の謎に挑戦しよう！";

            // コンプリート表示を隠す
            if (completeHomeMessage) {
                completeHomeMessage.style.display =
                    "none";
            }

            if (stampBanner) {
                stampBanner.classList.remove(
                    "complete"
                );
            }

        } else {

            message.textContent =
                `あと ${3 - clearedCount} 個でコンプリート！`;

            // コンプリート表示を隠す
            if (completeHomeMessage) {
                completeHomeMessage.style.display =
                    "none";
            }

            if (stampBanner) {
                stampBanner.classList.remove(
                    "complete"
                );
            }
        }
    }

    // 最初に表示
    updateMainPage();

    // 別ページから戻ったときにも更新
    window.addEventListener(
        "pageshow",
        updateMainPage
    );

    // 同じサイトの別タブで進捗が変わった場合
    window.addEventListener(
        "storage",
        updateMainPage
    );
});