import { useOutletContext } from "react-router";


const dict = {
    ja: {
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
    en: {
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
    }
};

const TermsOfUse = () => {
    const { lang } = useOutletContext();

    const locale = dict[lang];

    return (
        <div className="text-accent mt-16 leading-6 max-w-xl">
            <div className="sticky top-20 pt-4 bg-background px-4">
                <h1 className="text-3xl font-bold flex gap-2"><img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/refs/heads/main/assets/Scroll/Color/scroll_color.svg" alt="Fluent Scroll emoji" /> {locale.title}</h1>
                <p className="text-muted mt-4 font-mono"><b>{locale.lastUpdated}:</b> {locale.updatedDate}</p>
                <hr className="my-8 border-border" />
            </div>
            <ol className="list-decimal list-inside marker:font-bold space-y-8 mt-8 px-4">
                <li className="space-y-2">
                    <strong>{locale.acceptance.title}</strong>
                    <p className="ml-4">{locale.acceptance.content[0]}<b>{locale.appName}</b>{locale.acceptance.content[1]}</p>
                </li>
                <li className="space-y-2">
                    <strong>{locale.usage.title}</strong>
                    <p className="ml-4">{locale.usage.desc}</p>
                    <ul className="ml-4 list-disc list-inside space-y-2">
                        <li className=""><b>{locale.usage.content.list1[0]}:</b> {locale.usage.content.list1[1]}</li>
                        <li><b>{locale.usage.content.list2[0]}:</b> {locale.usage.content.list2[1]}</li>
                    </ul>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.disclaimer.title}</strong>
                    <p className="ml-4">{locale.disclaimer.desc1[0]}<b>{locale.disclaimer.desc1[1]}</b>{locale.disclaimer.desc1[2]}<b>{locale.disclaimer.desc1[3]}</b>{locale.disclaimer.desc1[4]}</p>
                    <p className="ml-4"><b>{locale.disclaimer.desc2[0]}</b>{locale.disclaimer.desc2[1]}</p>
                    <ul className="ml-4 list-inside list-disc">
                        <li>{locale.disclaimer.list[0]}</li>
                        <li>{locale.disclaimer.list[1]}</li>
                    </ul>
                </li>
                <li className="space-y-2">
                    <strong>{locale.limitation.title}</strong>
                    <p className="ml-4">{locale.limitation.desc1[0]}<b>{locale.appName}</b>{locale.limitation.desc1[1]}<b>{locale.limitation.desc1[2]}</b>{locale.limitation.desc1[3]}</p>
                    <p className="italic ml-4">{locale.limitation.desc2}</p>
                </li>
                <li className="space-y-2">
                    <strong className="">{locale.changes.title}</strong>
                    <p className="ml-4">{locale.changes.desc}</p>
                </li>
            </ol>
        </div>
    );
};

export default TermsOfUse;
