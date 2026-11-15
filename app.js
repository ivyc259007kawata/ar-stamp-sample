
(() => {

    // =================================
    // 1. ゲーム設定
    // =================================

    const SPOTS = {
        spot1: {
            name: "探検スポット1",
            description: "最初の場所で謎を解こう！",
            letter: "り"
        },

        spot2: {
            name: "探検スポット2",
            description: "ここにもふしぎが隠れているよ！",
            letter: "す"
        },

        spot3: {
            name: "探検スポット3",
            description: "よく観察して答えを見つけよう！",
            letter: "く"
        },

        spot4: {
            name: "探検スポット4",
            description: "あと少し！文字を集めよう！",
            letter: "す"
        },

        spot5: {
            name: "探検スポット5",
            description: "最後のスタンプを手に入れよう！",
            letter: "ま"
        }
    };


    // =================================
    // 2. スポットIDとARページの対応表
    // =================================

    const SPOT_PAGES = {
        spot1: "ar.html",
        spot2: "ar2.html",
        spot3: "ar3.html",
        spot4: "ar4.html",
        spot5: "ar5.html"
    };


    // =================================
    // 3. クラス別ルート
    // =================================

    const ROUTES = {
        A: ["spot1", "spot2", "spot3", "spot4", "spot5"],
        B: ["spot2", "spot3", "spot1", "spot4", "spot5"],
        C: ["spot3", "spot1", "spot2", "spot4", "spot5"],
        D: ["spot2", "spot1", "spot3", "spot4", "spot5"],
        E: ["spot1", "spot3", "spot2", "spot4", "spot5"]
    };


    // =================================
    // 4. 最終問題の設定
    // =================================

    const FINAL_ANSWER = "くりすます";

    const FINAL_DESTINATION = "体育館";


    // =================================
    // 5. 使用するルートを決める
    // =================================

    const params = new URLSearchParams(window.location.search);

    const requestedRoute = params.get("route") || "A";

    const ROUTE_ID = ROUTES[requestedRoute]
        ? requestedRoute
        : "A";

    const CURRENT_ROUTE = ROUTES[ROUTE_ID];


    // =================================
    // 6. 保存設定
    // =================================

    // ルートごとに保存先を分ける
    // 同じ端末でも別ルートの進捗が混ざらない

    const STORAGE_KEY = `arTreasureProgress_v1_${ROUTE_ID}`;


    // =================================
    // 7. 初期データ
    // =================================

    function createInitialProgress() {

        return {
            cleared: {
                spot1: false,
                spot2: false,
                spot3: false,
                spot4: false,
                spot5: false
            },

            finalSolved: false
        };
    }


    // =================================
    // 8. 進捗を取得
    // =================================

    function getProgress() {

        try {

            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return createInitialProgress();
            }

            const data = JSON.parse(saved);

            const initial = createInitialProgress();

            // 保存データの形を確認
            if (!data || typeof data !== "object") {
                return initial;
            }

            // 各スポットのクリア状態を取得
            Object.keys(SPOTS).forEach((spotId) => {

                initial.cleared[spotId] =
                    data.cleared?.[spotId] === true;

            });

            // 最終問題のクリア状態を取得
            initial.finalSolved =
                data.finalSolved === true;

            return initial;

        } catch (error) {

            console.error(
                "進捗データの読み込みに失敗しました。",
                error
            );

            return createInitialProgress();
        }
    }


    // =================================
    // 9. 進捗を保存
    // =================================

    function saveProgress(progress) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(progress)
            );

            return true;

        } catch (error) {

            console.error(
                "進捗データの保存に失敗しました。",
                error
            );

            return false;
        }
    }


    // =================================
    // 10. クリア数を取得
    // =================================

    function getStampCount() {

        const progress = getProgress();

        return Object.values(progress.cleared)
            .filter(Boolean)
            .length;
    }


    // =================================
    // 11. 次に行く場所を取得
    // =================================

    function getNextSpot() {

        const progress = getProgress();

        return CURRENT_ROUTE.find((spotId) => {
            return !progress.cleared[spotId];
        }) || null;
    }


    // =================================
    // 12. スポットをクリアする
    // =================================

    function completeSpot(spotId) {

        // 存在するスポットか確認
        if (!SPOTS[spotId]) {

            console.error(
                "存在しないスポットです。",
                spotId
            );

            return false;
        }

        const progress = getProgress();

        // すでにクリア済みなら終了
        if (progress.cleared[spotId]) {
            return false;
        }

        // 現在挑戦する順番か確認
        const nextSpot = getNextSpot();

        if (nextSpot !== spotId) {

            console.warn(
                "まだこのスポットには挑戦できません。",
                spotId
            );

            return false;
        }

        // クリア状態にする
        progress.cleared[spotId] = true;

        // 保存
        if (!saveProgress(progress)) {
            return false;
        }

        console.log(
            "スポットクリア！",
            SPOTS[spotId].name
        );

        return true;
    }


    // =================================
    // 13. スタンプの文字を取得
    // =================================

    function getStampLetters() {

        const progress = getProgress();

        return CURRENT_ROUTE
            .filter((spotId) => {
                return progress.cleared[spotId];
            })
            .map((spotId) => {
                return SPOTS[spotId].letter;
            });
    }


    // =================================
    // 14. 最終問題に挑戦できるか
    // =================================

    function canPlayFinalPuzzle() {

        return getStampCount() === 5;
    }


    // =================================
    // 15. 答えを整える
    // =================================

    function normalizeAnswer(answer) {

        return answer
            .normalize("NFKC")
            .trim()
            .replace(/\s/g, "")
            .replace(/[\u30A1-\u30F6]/g, (char) => {

                return String.fromCharCode(
                    char.charCodeAt(0) - 0x60
                );

            });
    }


    // =================================
    // 16. 最終問題の答え合わせ
    // =================================

    function submitFinalAnswer(answer) {

        // 5つのスタンプが集まっているか確認
        if (!canPlayFinalPuzzle()) {
            return false;
        }

        const normalized = normalizeAnswer(answer);

        // 答えが違う場合
        if (normalized !== FINAL_ANSWER) {
            return false;
        }

        const progress = getProgress();

        // 最終問題をクリア済みにする
        progress.finalSolved = true;

        // 保存に成功したか確認
        if (!saveProgress(progress)) {
            return false;
        }

        return true;
    }


    // =================================
    // 17. 最終問題をクリア済みか確認
    // =================================

    function isFinalSolved() {

        return getProgress().finalSolved;
    }


    // =================================
    // 18. トップページの表示を更新
    // =================================

    function updateMainPage() {

        const spotList = document.getElementById("spotList");

        // トップページ以外では終了
        if (!spotList) {
            return;
        }

        const progress = getProgress();

        const clearedCount = getStampCount();

        const nextSpot = getNextSpot();


        // -----------------------------
        // 進捗表示
        // -----------------------------

        const count = document.getElementById("progressCount");

        const fill = document.getElementById("progressFill");

        const message = document.getElementById("progressMessage");

        const progressBar = document.getElementById("progressBar");

        const percentage = (clearedCount / 5) * 100;

        if (count) {
            count.textContent = `${clearedCount} / 5`;
        }

        if (fill) {
            fill.style.width = `${percentage}%`;
        }

        if (progressBar) {

            progressBar.setAttribute(
                "aria-valuenow",
                String(clearedCount)
            );

        }

        if (message) {

            if (clearedCount === 5) {

                message.textContent =
                    "おめでとう！5つの文字が集まったよ！";

            } else if (clearedCount === 0) {

                message.textContent =
                    "さあ、最初の謎に挑戦しよう！";

            } else {

                message.textContent =
                    `あと ${5 - clearedCount} 個で最後の謎が出現！`;

            }
        }


        // -----------------------------
        // ルート表示
        // -----------------------------

        const routeLabel = document.getElementById("routeLabel");

        if (routeLabel) {

            routeLabel.textContent = `ルート ${ROUTE_ID}`;

        }


        // -----------------------------
        // スタンプ表示
        // -----------------------------

        const stampList = document.getElementById("stampList");

        if (stampList) {

            stampList.innerHTML = "";

            CURRENT_ROUTE.forEach((spotId, index) => {

                const isCleared = progress.cleared[spotId];

                const card = document.createElement("div");

                card.className = isCleared
                    ? "stamp-card collected"
                    : "stamp-card";


                // スタンプ番号
                const number = document.createElement("span");

                number.className = "stamp-number";

                number.textContent = `STAMP ${index + 1}`;


                // スタンプの文字
                const letter = document.createElement("span");

                letter.className = "stamp-letter";

                letter.textContent = isCleared
                    ? SPOTS[spotId].letter
                    : "？";


                card.append(number, letter);

                stampList.appendChild(card);

            });
        }


        // -----------------------------
        // スポット表示
        // -----------------------------

        spotList.innerHTML = "";

        CURRENT_ROUTE.forEach((spotId, index) => {

            const spot = SPOTS[spotId];

            const isCleared = progress.cleared[spotId];

            const isCurrent = nextSpot === spotId;

            const card = document.createElement("article");

            card.className = "spot-card";


            // クリア済みの場合
            if (isCleared) {

                card.classList.add("cleared");

            }

            // 現在挑戦する場所の場合
            if (isCurrent) {

                card.classList.add("current");

            }


            // スポット番号
            const number = document.createElement("span");

            number.className = "spot-number";

            number.textContent = `SPOT ${index + 1}`;


            // スポット名
            const title = document.createElement("h3");

            title.textContent = spot.name;


            // 説明
            const description = document.createElement("p");

            description.textContent = spot.description;


            // 状態表示
            const status = document.createElement("span");

            status.className = "spot-status";

            if (isCleared) {

                status.textContent = "クリア済み";

            } else if (isCurrent) {

                status.textContent = "いま挑戦する場所";

            } else {

                status.textContent = "まだ進めないよ";

            }


            card.append(
                number,
                title,
                description,
                status
            );


            // -----------------------------
            // 出発ボタン・ロック表示
            // -----------------------------

            if (isCurrent) {

                const link = document.createElement("a");

                link.className = "spot-link";

                const page = SPOT_PAGES[spotId];

                link.href =
                    `${page}?spot=${spotId}&route=${ROUTE_ID}`;

                link.textContent = "冒険に出発！";

                card.appendChild(link);

            } else if (!isCleared) {

                const locked = document.createElement("div");

                locked.className = "spot-locked";

                locked.textContent = "🔒 まだ進めないよ";

                card.appendChild(locked);

            } else {

                const completed = document.createElement("div");

                completed.className = "spot-locked";

                completed.textContent = "⭐ スタンプ獲得！";

                card.appendChild(completed);

            }

            spotList.appendChild(card);

        });


        // -----------------------------
        // 最終問題
        // -----------------------------

        const finalSection = document.getElementById("finalSection");

        const finalLetters = document.getElementById("finalLetters");

        const answerForm = document.getElementById("answerForm");

        const answerMessage = document.getElementById("answerMessage");

        const destination = document.getElementById("destination");

        const destinationName = document.getElementById("destinationName");


        // 5つ集まったら最終問題を表示
        if (finalSection) {

            finalSection.hidden = !canPlayFinalPuzzle();

        }


        // 集めた文字を表示
        if (canPlayFinalPuzzle() && finalLetters) {

            finalLetters.innerHTML = "";

            getStampLetters().forEach((letter) => {

                const item = document.createElement("span");

                item.className = "final-letter";

                item.textContent = letter;

                finalLetters.appendChild(item);

            });
        }


        // 最終問題をクリア済みの場合
        if (isFinalSolved()) {

            if (answerForm) {

                answerForm.hidden = true;

            }

            if (answerMessage) {

                answerMessage.textContent = "";

            }

            if (destination) {

                destination.hidden = false;

            }

            if (destinationName) {

                destinationName.textContent = FINAL_DESTINATION;

            }

        } else {

            if (answerForm) {

                answerForm.hidden = false;

            }

            if (destination) {

                destination.hidden = true;

            }

        }
    }


    // =================================
    // 19. 最終問題の入力イベント
    // =================================

    function setupFinalPuzzle() {

        const form = document.getElementById("answerForm");

        if (!form) {
            return;
        }

        form.addEventListener("submit", (event) => {

            event.preventDefault();

            const input = document.getElementById("finalAnswer");

            const message = document.getElementById("answerMessage");

            if (!input || !message) {
                return;
            }

            const answer = input.value;

            if (submitFinalAnswer(answer)) {

                message.textContent =
                    "せいかい！よくできました！";

                updateMainPage();

            } else {

                message.textContent =
                    "おしい！文字の順番をもう一度考えてみよう！";

                input.value = "";

                input.focus();

            }

        });
    }


    // =================================
    // 20. 他のページから使える機能
    // =================================

    window.StampApp = {

        // ゲーム設定
        SPOTS,
        ROUTES,


        // 現在のルートを取得
        getRoute() {

            return ROUTE_ID;

        },


        // 進捗関連
        getProgress,
        saveProgress,
        getStampCount,
        getStampLetters,
        getNextSpot,


        // スポットがクリア済みか確認
        isCleared(spotId) {

            if (!SPOTS[spotId]) {
                return false;
            }

            return getProgress().cleared[spotId] === true;

        },


        // スポットをクリアする
        completeSpot,


        // 最終問題関連
        canPlayFinalPuzzle,
        submitFinalAnswer,
        isFinalSolved,


        // 最終目的地を取得
        getFinalDestination() {

            return FINAL_DESTINATION;

        },


        // トップページの表示更新
        updateMainPage

    };


    // =================================
    // 21. ページ読み込み時
    // =================================

    document.addEventListener("DOMContentLoaded", () => {

        setupFinalPuzzle();

        updateMainPage();

    });


    // 別ページから戻ったとき
    window.addEventListener("pageshow", updateMainPage);


    // 別タブで進捗が変わったとき
    window.addEventListener("storage", updateMainPage);

})();
