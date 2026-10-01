(() => {
    const STORAGE_KEY = "arStampProgress";

    // 3つのスポット
    const SPOTS = {
        shrine: {
            name: "神社"
        },

        park: {
            name: "公園"
        },

        library: {
            name: "図書館"
        }
    };

    // -----------------------------
    // 現在のクリア状況を取得
    // -----------------------------
    function getProgress() {
        try {
            const saved =
                localStorage.getItem(STORAGE_KEY);

            const progress =
                saved ? JSON.parse(saved) : {};

            return {
                shrine: progress.shrine === true,
                park: progress.park === true,
                library: progress.library === true
            };

        } catch (error) {
            console.error(
                "進捗データの読み込みに失敗:",
                error
            );

            return {
                shrine: false,
                park: false,
                library: false
            };
        }
    }


    // -----------------------------
    // クリア状況を保存
    // -----------------------------
    function saveProgress(progress) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(progress)
        );
    }


    // -----------------------------
    // スポットをクリアする
    // -----------------------------
    function completeSpot(spotId) {

        if (!SPOTS[spotId]) {
            console.error(
                "存在しないスポット:",
                spotId
            );

            return false;
        }

        const progress =
            getProgress();

        // すでにクリア済みなら何もしない
        if (progress[spotId]) {
            console.log(
                "すでにクリア済み:",
                spotId
            );

            return false;
        }

        // 今回のスポットをクリア
        progress[spotId] = true;

        // 保存
        saveProgress(progress);

        console.log(
            "スポットクリア:",
            SPOTS[spotId].name
        );

        return true;
    }


    // -----------------------------
    // そのスポットをクリア済みか確認
    // -----------------------------
    function isCleared(spotId) {
        return getProgress()[spotId] === true;
    }


    // -----------------------------
    // 現在のスタンプ数
    // -----------------------------
    function getStampCount() {
        return Object.values(
            getProgress()
        ).filter(Boolean).length;
    }


    // -----------------------------
    // スタンプカード画像番号を決める
    //
    // 神社   = 1
    // 公園   = 2
    // 図書館 = 4
    //
    // 組み合わせることで
    // 0～7になる
    // -----------------------------
    function getStampCardNumber() {

        const progress =
            getProgress();

        return (
            (progress.shrine ? 1 : 0) |
            (progress.park ? 2 : 0) |
            (progress.library ? 4 : 0)
        );
    }


    // -----------------------------
    // 他のHTMLから使えるようにする
    // -----------------------------
    window.StampApp = {
        SPOTS,
        getProgress,
        completeSpot,
        isCleared,
        getStampCount,
        getStampCardNumber
    };

})();