import formatDateJa from "../utils/formatDateJa";
import formatDateJaNoYear from "../utils/formatDateJaNoYear";

const ja = {
    components: {
        return2Home: "ホームページ",
    },
    ui: {
        delete: "削除",
        cancel: "キャンセル",
        save: "保存",
        warnDelete: ["この操作は元に ", "戻せません", "。"],
    },
    home: {
        nav: {
            header: "ザカのトマト",
            desc: "あなたのミニマルなポモドーロタイマー",
        },
        choices: ["ポモドーロ", "短い休憩", "長い休憩"],
        messages: {
            start: "さあ、作業を始めましょう！",
            work: "集中して取り組みましょう！",
            rest: "休憩の時間です！",
        },
        session: "回数",
    },
    profile: {
        welcome: "お帰りなさい！",
        status: "今日はこれを達成する！",
        highScore: "自己ベスト",
        emptySession: "まだ記録がないみたいです．．．",
        thisWeek: "今週の記録",
        viewMore: "もっと見る",
        days: [
            "日",
            "月",
            "火",
            "水",
            "木",
            "金",
            "土",
        ],
        copied: "プロフィールのURLをコピーしました",
        formatDate: formatDateJa,
        errorItem: "プロフィール",
    },
    record: {
        header: "これまでの記録",
        return: "プロフィールに戻る",
        empty: [
            "まだセッションの記録が",
            "ありません",
            "。ホームページに戻って作業を開始しましょう！",
        ],
        months: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
        warning: "記録を削除します。本当によろしいですか？",
        formatDate: formatDateJaNoYear,
    },
    setting: {
        question: "なんて呼べばいいですか？",
        danger: "デンジャーゾーン",
        delete: {
            button: "アカウントを削除する",
            warning: "アカウントは削除されます。本当によろしいですか？",
        },
        clear: {
            button: "記録をリセットする",
            warning: "すべての記録はリセットされます。本当によろしいですか？",
        },
        logout: "ログアウト",
        errorItem: "プロフィール",
    },
    notFound: {
        desc: "お探しのものは、ここにはないみたいです．．．",
        suggest: "ホームページに戻ってみませんか？",
    },
    login: {
        header: "さっそく始めましょう！",
        google: "Googleでログインする",
    },
    error: {
        header: "のデータの取得中に問題が発生しました",
        desc: "一度ホームページに戻ってみてください。",
    },
};

export default ja;
