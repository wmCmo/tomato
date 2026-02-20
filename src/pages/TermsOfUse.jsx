import { useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";

const dict = {
    ja: {
        terms: {
            appName: "Zach's Tomato",
            updatedDate: "2026年2月",
            title: "利用規約",
            lastUpdated: "最終更新日",
            acceptance: {
                title: "規約への同意",
                content: [
                    "",
                    "（以下「本サービス」）にアクセスただきありがとうございます。本サービスを利用することで、この規約に同意したものとみなされます。もし同意いただけない場合は、残念ですが利用をお控えください。"
                ]
            },
            usage: {
                title: "利用と禁止事項",
                desc: "このアプリは、皆さんの集中力を高める手助けをするための生産性向上ツールです。",
                content: {
                    list1: ["適正な利用", "本サービスを不正に利用しないと約束してください。これには、Notion APIへのスパム行為、認証の回避、またはサーバーへの過度な負荷をかける行為などが含まれます。"],
                    list2: ["利用停止", "ルール違反（API制限悪用など）が確認された場合、事前の通知なく直ちにサービスへのアクセスを一時停止、または終了する権利を留保します。"]
                }
            },
            disclaimer: {
                title: "免責事項 (現状有姿)",
                desc1: ["本サービスは", '「現状有姿」', "かつ", '「提供可能な範囲」', "で提供されます"],
                desc2: ["僕は個人開発者として", "コミュニティの役に立つためにこのツールを提供しています。安定稼働には全力を尽くしますが、以下の点をご了承ください："],
                list: ["サービスの信頼性や正確性については保証しません。", "サービスがあなたの要件を完全に満たすこと、または中断されないことを保証するものではありません。"]
            },
            limitation: {
                title: "責任の制限",
                desc1: ["法律で認められる最大限の範囲において、", "および開発者は、本サービスの利用に起因する間接的、偶発的、または結果的な損害（", "でーたの損失", "、利益の損失、サービスの中断を含む）について、一切の責任を負いません。"],
                desc2: "(ぶっちゃけた話：バグのせいでNotionのデータが消えたり、締め切りに間に合わなかったとしても、僕は法的な責任を負えません。ごめんなさい！)"
            },
            changes: {
                title: "規約の変更",
                desc: "この規約は必要に応じて更新することがあります。変更後も使い続けてくれた場合、新しい規約に同意してくれたものとみなします。"
            }
        },
        policy: {
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
                notion: ["Notion連携", "Notionを接続する場合、", "暗号化されたアクセストークン", "と、あなたが許可したデータベースIDだけを保存します。あなたのNotionワークスペース全体を勝手に見たりはできません。"],
                technical: ["技術データ：", "アプリを良くするために、匿名化された分析データ（Google Analyticsなど）を使って、どの機能が人気か（ボタンクリックなど）を見ています。"]
            },
            thirdParty: {
                title: "利用している第三者サービス",
                desc: "信頼できる以下のインフラを使わせてもらっています。",
                supabase: "データベースのログイン昨日を安全に管理しています。",
                notion: "完了したセッションをあなたのNotionに同期します。",
                google: "匿名の利用統計を見ています。"
            },
            cookies: {
                title: "クッキーとローカルストレージ",
                desc: "スムーズに使ってもらうため、いくつかの保存技術を使っています。",
                auth: ["認証用Cookie", "", "Supabase", "が、ログイン状態を維持するために使います。"],
                analytics: ["分析用Cookie", "Google Analyticsなど（例：", "のトークン）が、人気の機能を知るために匿名のデータを集めます。"],
                referral: ["紹介用Cookie", "", "経由で来てくれた人を把握するために、彼らのCookieが使われることがあります。"],
                storage: {
                    title: ["ローカルストレージ", "ブラウザの中に、あなたのUI設定を保存します。"],
                    desc: "例えば",
                    list1: ["UI", "ダークモードやフォントの設定。"],
                    list2: ["セッション状態", "まだデータベースに保存されていない、途中のタイマーの状態など。"]
                },
                block: "これらはブラウザの設定でブロックできますが、そうするととログインできなくなったり設定が消えたりするかもしれません。"
            },
            dataControl: {
                title: "データの管理と削除",
                desc: "データはあなたのものです。いつでもアカウントや記録を消すことができます",
                list1: ["", "プロフィールページ", "歯車アイコンへ行ってください。"],
                list2: ["", "アカウントを削除する", "または", "記録をリセットするを選べます。"],
                result: ["結果", "データベースから、あなたのデータは完全に消えます。"]
            },
            security: {
                title: "セキュリティ",
                desc: "大事なトークン（Notionキーなど）は暗号化して、できる限りの対策をしています。ただ、ウェブサービスに「100％安全」は存在しないので、そこだけはご理解ください。"
            },
            children: {
                title: "子供のプライバシー",
                desc: "このサービスは13歳未満向けではありません。もし13歳未満の子が個人情報を送ってしまったと分かったら、僕の方ですぐにサーバーから削除します。"
            },
            changes: {
                title: "ポリシーの変更",
                desc: "アプリの成長に合わせて、このポリシーも更新することがあります。重要な変更があれば、ページの一番上の日付でお知らせします。"
            },
            contact: {
                title: "お問い合わせ",
                desc: "プライバシーについて気になることがあれば、僕に直接連絡してください。",
                issue: "Issueを作ってくれると嬉しいです。"
            }
        },
    },
    en: {
        terms: {
            appName: "Zach's tomato",
            updatedDate: "February 2026",
            title: "Terms of Use",
            lastUpdated: "Last Updated",
            acceptance: {
                title: "Acceptance of Terms",
                content: [
                    "By accessing and using ",
                    " (the \"Service\"), you agree to be bound by these Terms. If you do not agree to these terms, please do not use the Service."
                ]
            },
            usage: {
                title: "Usage & Conduct",
                desc: "This app is a productivity tool designed to help you focus.",
                content: {
                    list1: ["Fare use", "You agree not to misuse the Service. this includes, but is not limited to, spamming the Notion API, attempting to bypass authentication, or overburdening our servers."],
                    list2: ["Termination", "We reserve the right to suspend or terminate your access to the Service immediately, without prior notice, if you violate these Terms (e.g., abusing API limits)."]
                }
            },
            disclaimer: {
                title: "Disclaimer of Warranties (\"As-Is\")",
                desc1: ["The Service is provided on as ", '"AS IS"', " and ", '"AS AVAILABLE"', " basis."],
                desc2: ["I am a solo developer", " offering this tool to help the community. While I strive for stability:"],
                list: ["I make no warranties regarding the reliability or accuracy of the service.", "I do not guarantee that the service will meet your requirements or be uninterrupted."]
            },
            limitation: {
                title: "Limitation of Liability",
                desc1: ["To the maximum extend permitted by law, ", " and its developer shall not be liable for any indirect, incidental, or consequential damages, including ", "loss of data", ", loss of profits, or service interruptions, resulting from your use of the Service."],
                desc2: "(Translation: If you miss a deadline or lose a Notion entry because of a bug, I am not legally responsible.)"
            },
            changes: {
                title: "Changes of Terms",
                desc: "I may update these terms from time to time. Continued use of the Service after any changes constitutes your acceptance of the new Terms."
            }
        },
        policy: {
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
        },
    }
};

const TermsOfUse = () => {
    const navigate = useNavigate();
    const { lang } = useOutletContext();
    const { hash } = useLocation();

    const locale = dict[lang];

    const handleScroll = id => {
        const el = document.getElementById(id);
        const destination = `/terms#${id}`;
        navigate(destination, { replace: true });
        navigator.clipboard.writeText(`https://wmcmo.github.io/tomato${destination}`);
        el?.scrollIntoView({ block: "start" });
    };

    useEffect(() => {
        if (!hash) return;
        const id = hash.slice(1);
        handleScroll(id);
    }, [hash]);


    return (
        <div className="text-accent mt-20 leading-6 max-w-xl">
            <div className="sticky top-20 bg-background px-4 pt-8">
                <button onClick={() => handleScroll("policy")}>
                    <h1 className="text-3xl font-bold flex gap-2"><img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Locked%20with%20pen/Color/locked_with_pen_color.svg" alt="Fluent Scroll emoji" /> {locale.policy.title}</h1>
                </button>
                <p className="text-muted mt-4 font-mono"><b>{locale.policy.lastUpdated}:</b> {locale.policy.updatedDate}</p>
                <hr className="my-8 border-border" />
            </div>
            <ol id="policy" className="scroll-mt-64 list-decimal list-inside marker:font-bold space-y-8 mt-8 px-4 mb-20">
                <li className="space-y-2">
                    <strong>{locale.policy.introduction.title}</strong>
                    <p className="ml-4"><b>{locale.policy.appName}</b>{locale.policy.introduction.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.policy.information.title}</strong>
                    <p className="ml-4">{locale.policy.information.desc}:</p>
                    <ol className="list-[lower-alpha] list-inside ml-4 space-y-2">
                        <li className="space-y-2">
                            <span><b>{locale.policy.information.google[0]}:</b> {locale.policy.information.google[1]}</span>
                            <ol className="ml-4 list-[lower-roman] list-inside">
                                <li className=""><b>{locale.policy.information.public[0]}:</b> {locale.policy.information.public[1]} <code className="inline-code">.../profile/19c2c5...</code>{locale.policy.information.public[2]}</li>
                            </ol>
                        </li>
                        <li><b>{locale.policy.information.pomodoro[0]}:</b> {locale.policy.information.pomodoro[1]}</li>
                        <li><b>{locale.policy.information.notion[0]}:</b> {locale.policy.information.notion[1]}<b>{locale.policy.information.notion[2]}</b>{locale.policy.information.notion[3]}</li>
                        <li><b>{locale.policy.information.technical[0]}:</b> {locale.policy.information.technical[1]}</li>
                    </ol>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.policy.thirdParty.title}</strong>
                    <p className="ml-4">{locale.policy.thirdParty.desc}:</p>
                    <ol className="ml-4 space-y-2 list-inside list-[lower-alpha]">
                        <li><b>Supabase:</b> {locale.policy.thirdParty.supabase}</li>
                        <li><b>Notion API:</b> {locale.policy.thirdParty.notion}</li>
                        <li><b>Google Analytics:</b> {locale.policy.thirdParty.google}</li>
                    </ol>
                </li>
                <li className="space-y-2">
                    <strong>{locale.policy.cookies.title}</strong>
                    <p className="ml-4">{locale.policy.cookies.desc}</p>
                    <ol className="space-y-2 list-inside list-[lower-alpha] ml-4">
                        <li><b>{locale.policy.cookies.auth[0]}:</b> {locale.policy.cookies.auth[1]}<b>{locale.policy.cookies.auth[2]}</b>{locale.policy.cookies.auth[3]}</li>
                        <li><b>{locale.policy.cookies.analytics[0]}:</b> {locale.policy.cookies.analytics[1]}<code className="inline-code">_ga</code>{locale.policy.cookies.analytics[2]}</li>
                        <li><b>{locale.policy.cookies.referral[0]}:</b> {locale.policy.cookies.referral[1]}<b>Product Hunt</b>{locale.policy.cookies.referral[2]}<code className="inline-code">producthunt_session</code>{locale.policy.comma}<code className="inline-code">ajs_anonymous_id</code>{locale.policy.cookies.referral[3]}</li>
                        <li className="space-y-2">
                            <span><b>{locale.policy.cookies.storage.title[0]}:</b> {locale.policy.cookies.storage.title[1]}</span>
                            <p>{locale.policy.cookies.storage.desc}:</p>
                            <ol className="space-y-2 list-inside list-[lower-roman] ml-4">
                                <li><b>{locale.policy.cookies.storage.list1[0]}:</b> {locale.policy.cookies.storage.list1[1]}</li>
                                <li><b>{locale.policy.cookies.storage.list2[0]}:</b> {locale.policy.cookies.storage.list2[1]}</li>
                            </ol>
                        </li>
                    </ol>
                    <p>{locale.policy.cookies.block}</p>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.policy.dataControl.title}</strong>
                    <p className="ml-4">{locale.policy.dataControl.desc}:</p>
                    <ol className="list-inside list-[lower-alpha] space-y-2 ml-4">
                        <li>{locale.policy.dataControl.list1[0]}<b>{locale.policy.dataControl.list1[1]}</b> → ⚙️ <b>{locale.policy.dataControl.list1[2]}</b></li>
                        <li>{locale.policy.dataControl.list2[0]}<b>{locale.policy.dataControl.list2[1]}</b>{locale.policy.dataControl.list2[2]}<b>{locale.policy.dataControl.list2[3]}</b></li>
                        <li><i>{locale.policy.dataControl.result[0]}:</i> {locale.policy.dataControl.result[1]}</li>
                    </ol>
                </li>
                <li className="space-y-2">
                    <strong>{locale.policy.security.title}</strong>
                    <p>{locale.policy.security.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.policy.children.title}</strong>
                    <p>{locale.policy.children.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.policy.changes.title}</strong>
                    <p>{locale.policy.changes.desc}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.policy.contact.title}</strong>
                    <p>{locale.policy.contact.desc}:</p>
                    <ul className="space-y-2">
                        <li><b>Email:</b> <code className="inline-code"><button className="active:opacity-50" onClick={() => navigator.clipboard.writeText("titan.zp4@gmail.com")}>titan.zp4@gmail.com</button></code></li>
                        <li><b>Github:</b> <a href="https://github.com/wmCmo/tomato" target="_blank" className="hover:underline text-rose-400">{locale.policy.contact.issue}</a></li>
                    </ul>
                </li>
            </ol>
            <div className="sticky top-20 bg-background px-4 pt-8">
                <button onClick={() => handleScroll('terms')}>
                    <h1 className="text-3xl font-bold flex gap-2"><img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Scroll/Color/scroll_color.svg" alt="Fluent Scroll emoji" /> {locale.terms.title}</h1>
                </button>
                <p className="text-muted mt-4 font-mono"><b>{locale.terms.lastUpdated}:</b> {locale.terms.updatedDate}</p>
                <hr className="my-8 border-border" />
            </div>
            <ol id="terms" className="scroll-mt-64 list-decimal list-inside marker:font-bold space-y-8 mt-8 px-4">
                <li className="space-y-2">
                    <strong>{locale.terms.acceptance.title}</strong>
                    <p className="ml-4">{locale.terms.acceptance.content[0]}<b>{locale.terms.appName}</b>{locale.terms.acceptance.content[1]}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.terms.usage.title}</strong>
                    <p className="ml-4">{locale.terms.usage.desc}</p>
                    <ul className="ml-4 list-disc list-inside space-y-2">
                        <li className=""><b>{locale.terms.usage.content.list1[0]}:</b> {locale.terms.usage.content.list1[1]}</li>
                        <li><b>{locale.terms.usage.content.list2[0]}:</b> {locale.terms.usage.content.list2[1]}</li>
                    </ul>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.terms.disclaimer.title}</strong>
                    <p className="ml-4">{locale.terms.disclaimer.desc1[0]}<b>{locale.terms.disclaimer.desc1[1]}</b>{locale.terms.disclaimer.desc1[2]}<b>{locale.terms.disclaimer.desc1[3]}</b>{locale.terms.disclaimer.desc1[4]}</p>
                    <p className="ml-4"><b>{locale.terms.disclaimer.desc2[0]}</b>{locale.terms.disclaimer.desc2[1]}</p>
                    <ul className="ml-4 list-inside list-disc">
                        <li>{locale.terms.disclaimer.list[0]}</li>
                        <li>{locale.terms.disclaimer.list[1]}</li>
                    </ul>
                </li>
                <li className="space-y-2">
                    <strong>{locale.terms.limitation.title}</strong>
                    <p className="ml-4">{locale.terms.limitation.desc1[0]}<b>{locale.terms.appName}</b>{locale.terms.limitation.desc1[1]}<b>{locale.terms.limitation.desc1[2]}</b>{locale.terms.limitation.desc1[3]}</p>
                    <p className="italic ml-4">{locale.terms.limitation.desc2}</p>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.terms.changes.title}</strong>
                    <p className="ml-4">{locale.terms.changes.desc}</p>
                </li>
            </ol>
        </div>
    );
};

export default TermsOfUse;
