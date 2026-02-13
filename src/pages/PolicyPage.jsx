import { useOutletContext } from "react-router";


const dict = {
    ja: {
        appName: "Zach's Tomato",
        title: "プライバシーポリシー",
        lastUpdated: "最終更新日",
        comma: "、",
        updatedDate: "2026年2月",
        introduction: {
            title: "はじめに",
            desc: "および開発者は、あなたのプライバシーを尊重します。これはオープンソースのツールであり、皆さんの集中を助けるために開発しました。データを第三者に売るようなことは絶対にしません。タイマー機能やNotion同期を動かすために必要な情報だけを扱います。"
        },
        information: {
            title: "収集する情報",
            desc: "サービスを動かすために、以下の情報をお預かりします。",
            google: ["Googleアカウント情報", "サインイン時に、メールアドレス、名前、プロフィール画像を受け取ります。これはアカウントを作ってプロフィールを表示するためだけに使います。"],
            public: ["公開設定について", "あなたのプロフィールページは、固有のURL（例：", "を知っている人ならだれでも見ることができます。URLは推測しにくいものですが、リンクを知っている人は名前や加増を見れる点だけ注意してください。"],
            pomodoro: ["ポモドーロのアクティビティ：", "タイマーの記録や時間を保存します。"],
            notion: ["Notion連携", "Notionを接続する場合、", "暗号化されたアクセストークンと", " and the specific Database IDs you explicitly authorize. We cannot access your entire Notion workspace, only the pages you share with the integration."],
            technical: ["Technical Data", "We use anonymous analytics (like Google Analytics) to understand which features are used most (e.g., button clicks, browser type). This helps us improve the app."]
        },
        thirdParty: {
            title: "Third-Party Services",
            desc: "We rely on trusted third-party infrastructure",
            supabase: "Securely hosts our database and manages user authentication.",
            notion: "Syncs your completed focus sessions to your personal Notion workspace.",
            google: "Provides anonymized usage statistics."
        },
        cookies: {
            title: "Cookies & Local Storage",
            desc: "We use storage technologies to provide a seamless experience and to understand how users find us.",
            auth: ["Authentication Cookies", "Used by ", "Supabase", " to keep you logged in across browser sessions."],
            analytics: ["Analytics Cookies", "We use Google Analytics (e.g., ", " token) to collect anonymized data such as which features are popular and how long users stay on the site."],
            referral: ["Referral & Session Cookies", "Since we are featured on ", ", their cookies (e.g., ", ") may be used to track the effectiveness of our launch campaign and referral traffic."],
            storage: {
                title: ["Local Storage", "We use your browser's Local Storage to save your UI preferences locally."],
                desc: "This includes",
                list1: ["UI Settings", "Light/Dark mode, font selections, and custom timer durations."],
                list2: ["Session State", "Keeping track of your current Pomodoro progress before it syncs to your database."]
            },
            block: "You can manage or block these via your browser settings, though doing so may prevent you from logging in or saving your preferences."
        },
        dataControl: {
            title: "Data Control & Deletion",
            desc: "You own your data. You can delete your account and all stored records at any time",
            list1: ["Go to ", "Profile Page", "Gear Icon."],
            list2: ["Select ", "Clear All Records", " or ", "Delete Account."],
            result: ["Result", "Your data is permanently removed from our Supabase database."]
        },
        security: {
            title: "Security",
            desc: "We take reasonable measures to protect your data, including encrypting sensitive tokens (like Notion keys) at rest. However, no web service is 100% secure, and we cannot guarantee absolute security."
        },
        children: {
            title: "Children’s Privacy",
            desc: "Our service does not address anyone under the age of13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will immediately delete this from our servers."
        },
        changes: {
            title: "Changes to this Policy",
            desc: "We may update this policy as the app evolves. Significant changes will be reflected by the “Last Updated” data at the top of this page."
        },
        contact: {
            title: "Contact",
            desc: "For questions or privacy concerns, please reach out",
            issue: "Open an issue"
        }
    },
    en: {
        appName: "Zach's Tomato",
        title: "Privacy Policy for Zach's tomato",
        lastUpdated: "Last Updated",
        comma: ",",
        updatedDate: "February 2026",
        introduction: {
            title: "Introduction",
            desc: " (”we”, “our”, or “the app”) respects your privacy. We are an open-source productivity tool designed to help you focus. We do not sell your data. We only process information necessary to make the timer and Notion sync work."
        },
        information: {
            title: "Information We Collect",
            desc: "To provide our services, we collect the following",
            google: ["Google Account Data", "When you sign in, we receive your email address, name, and profile picture. We use this solely to create your account and display your profile."],
            public: ["Public Visibility", "Please note that your profile pages is accessible to anyone who has your unique profile URL (e.g., ", "). While these URLs are unique and hard to guess, the name and picture associated with the profile are visible to anyone who possesses the link."],
            pomodoro: ["Pomodoro Activity", "We store your timer sessions and timestamps."],
            notion: ["Notion Integration", "If you connect Notion, we store ", "encrypted access tokens", " and the specific Database IDs you explicitly authorize. We cannot access your entire Notion workspace, only the pages you share with the integration."],
            technical: ["Technical Data", "We use anonymous analytics (like Google Analytics) to understand which features are used most (e.g., button clicks, browser type). This helps us improve the app."]
        },
        thirdParty: {
            title: "Third-Party Services",
            desc: "We rely on trusted third-party infrastructure",
            supabase: "Securely hosts our database and manages user authentication.",
            notion: "Syncs your completed focus sessions to your personal Notion workspace.",
            google: "Provides anonymized usage statistics."
        },
        cookies: {
            title: "Cookies & Local Storage",
            desc: "We use storage technologies to provide a seamless experience and to understand how users find us.",
            auth: ["Authentication Cookies", "Used by ", "Supabase", " to keep you logged in across browser sessions."],
            analytics: ["Analytics Cookies", "We use Google Analytics (e.g., ", " token) to collect anonymized data such as which features are popular and how long users stay on the site."],
            referral: ["Referral & Session Cookies", "Since we are featured on ", ", their cookies (e.g., ", ") may be used to track the effectiveness of our launch campaign and referral traffic."],
            storage: {
                title: ["Local Storage", "We use your browser's Local Storage to save your UI preferences locally."],
                desc: "This includes",
                list1: ["UI Settings", "Light/Dark mode, font selections, and custom timer durations."],
                list2: ["Session State", "Keeping track of your current Pomodoro progress before it syncs to your database."]
            },
            block: "You can manage or block these via your browser settings, though doing so may prevent you from logging in or saving your preferences."
        },
        dataControl: {
            title: "Data Control & Deletion",
            desc: "You own your data. You can delete your account and all stored records at any time",
            list1: ["Go to ", "Profile Page", "Gear Icon."],
            list2: ["Select ", "Clear All Records", " or ", "Delete Account."],
            result: ["Result", "Your data is permanently removed from our Supabase database."]
        },
        security: {
            title: "Security",
            desc: "We take reasonable measures to protect your data, including encrypting sensitive tokens (like Notion keys) at rest. However, no web service is 100% secure, and we cannot guarantee absolute security."
        },
        children: {
            title: "Children’s Privacy",
            desc: "Our service does not address anyone under the age of13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will immediately delete this from our servers."
        },
        changes: {
            title: "Changes to this Policy",
            desc: "We may update this policy as the app evolves. Significant changes will be reflected by the “Last Updated” data at the top of this page."
        },
        contact: {
            title: "Contact",
            desc: "For questions or privacy concerns, please reach out",
            issue: "Open an issue"
        }
    }
};

const PolicyPage = () => {
    const { lang } = useOutletContext();
    const locale = dict[lang];

    return (
        <div className="text-accent mt-16 leading-6 max-w-xl">
            <div className="sticky top-20 pt-4 bg-background px-4">
                <h1 className="text-3xl font-bold flex gap-2"><img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Locked%20with%20pen/Color/locked_with_pen_color.svg" alt="Fluent Scroll emoji" /> {locale.title}</h1>
                <p className="text-muted mt-4 font-mono"><b>{locale.lastUpdated}:</b> {locale.updatedDate}</p>
                <hr className="my-8 border-border" />
            </div>
            <ol className="list-decimal list-inside marker:font-bold space-y-8 mt-8 px-4">
                <li className="space-y-2">
                    <strong>{locale.introduction.title}</strong>
                    <p className="ml-4"><b>{locale.appName}</b>{locale.introduction.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.information.title}</strong>
                    <p className="ml-4">{locale.information.desc}:</p>
                    <ol className="list-[lower-alpha] list-inside ml-4 space-y-2">
                        <li className="space-y-2">
                            <span><b>{locale.information.google[0]}:</b> {locale.information.google[1]}</span>
                            <ol className="ml-4 list-[lower-roman] list-inside">
                                <li className=""><b>{locale.information.public[0]}:</b> {locale.information.public[1]} <code className="inline-code">.../profile/19c2c5...</code>{locale.information.public[2]}</li>
                            </ol>
                        </li>
                        <li><b>{locale.information.pomodoro[0]}:</b> {locale.information.pomodoro[1]}</li>
                        <li><b>{locale.information.notion[0]}:</b> {locale.information.notion[1]}<b>{locale.information.notion[2]}</b>{locale.information.notion[3]}</li>
                        <li><b>{locale.information.technical[0]}:</b> {locale.information.technical[1]}</li>
                    </ol>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.thirdParty.title}</strong>
                    <p className="ml-4">{locale.thirdParty.desc}:</p>
                    <ol className="ml-4 space-y-2 list-inside list-[lower-alpha]">
                        <li><b>Supabase:</b> {locale.thirdParty.supabase}</li>
                        <li><b>Notion API:</b> {locale.thirdParty.notion}</li>
                        <li><b>Google Analytics:</b> {locale.thirdParty.google}</li>
                    </ol>
                </li>
                <li className="space-y-2">
                    <strong>{locale.cookies.title}</strong>
                    <p className="ml-4">{locale.cookies.desc}</p>
                    <ol className="space-y-2 list-inside list-[lower-alpha] ml-4">
                        <li><b>{locale.cookies.auth[0]}:</b> {locale.cookies.auth[1]}<b>{locale.cookies.auth[2]}</b>{locale.cookies.auth[3]}</li>
                        <li><b>{locale.cookies.analytics[0]}:</b> {locale.cookies.analytics[1]}<code className="inline-code">_ga</code>{locale.cookies.analytics[2]}</li>
                        <li><b>{locale.cookies.referral[0]}:</b> {locale.cookies.referral[1]}<b>Product Hunt</b>{locale.cookies.referral[2]}<code className="inline-code">producthunt_session</code>{locale.comma}<code className="inline-code">ajs_anonymous_id</code>{locale.cookies.referral[3]}</li>
                        <li className="space-y-2">
                            <span><b>{locale.cookies.storage.title[0]}:</b> {locale.cookies.storage.title[1]}</span>
                            <p>{locale.cookies.storage.desc}:</p>
                            <ol className="space-y-2 list-inside list-[lower-roman] ml-4">
                                <li><b>{locale.cookies.storage.list1[0]}:</b> {locale.cookies.storage.list1[1]}</li>
                                <li><b>{locale.cookies.storage.list2[0]}:</b> {locale.cookies.storage.list2[1]}</li>
                            </ol>
                        </li>
                    </ol>
                    <p>{locale.cookies.block}</p>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.dataControl.title}</strong>
                    <p className="ml-4">{locale.dataControl.desc}:</p>
                    <ol className="list-inside list-[lower-alpha] space-y-2 ml-4">
                        <li>{locale.dataControl.list1[0]}<b>{locale.dataControl.list1[1]}</b> → ⚙️ <b>{locale.dataControl.list1[2]}</b></li>
                        <li>{locale.dataControl.list2[0]}<b>{locale.dataControl.list2[1]}</b>{locale.dataControl.list2[2]}<b>{locale.dataControl.list2[3]}</b></li>
                        <li><i>{locale.dataControl.result[0]}:</i> {locale.dataControl.result[1]}</li>
                    </ol>
                </li>
                <li className="space-y-2">
                    <strong>{locale.security.title}</strong>
                    <p>{locale.security.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.children.title}</strong>
                    <p>{locale.children.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.changes.title}</strong>
                    <p>{locale.changes.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.contact.title}</strong>
                    <p>{locale.contact.desc}:</p>
                    <ul className="space-y-2">
                        <li><b>Email:</b> <code className="inline-code"><button className="active:opacity-50" onClick={() => navigator.clipboard.writeText("titan.zp4@gmail.com")}>titan.zp4@gmail.com</button></code></li>
                        <li><b>Github:</b> <a href="https://github.com/wmCmo/tomato" target="_blank" className="hover:underline text-rose-400">{locale.contact.issue}</a></li>
                    </ul>
                </li>
            </ol>
        </div>
    );
};

export default PolicyPage;
