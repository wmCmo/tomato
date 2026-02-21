import formatDateEn from "../utils/formatDateEn";
import formatDateEnNoYear from "../utils/formatDateEnNoYear";

const en = {
    langTag: "en-US",
    components: {
        return2Home: "Home",
    },
    ui: {
        delete: "Delete",
        cancel: "Cancel",
        save: "Save",
        warnDelete: ["This action ", "cannot", " be undone."],
    },
    policy: {
        header: "Privacy Policy",
    },
    home: {
        nav: {
            header: "Zach's Tomato",
            desc: "Your minimal Pomodoro timer",
        },
        choices: ["Pomodoro", "Short Break", "Long Break"],
        messages: {
            start: "Click Start and let's get things done!",
            work: "Time to Work!",
            rest: "Time to Rest!",
        },
        session: "Session",
    },
    profile: {
        welcome: "Welcome back,",
        status: "I want to tell everyone that...",
        highScore: "High Score",
        emptySession: "Empty session",
        thisWeek: "This week",
        viewMore: "View More",
        days: [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
        ],
        copied: "Profile URL Copied",
        formatDate: formatDateEn,
        errorItem: "profile",
    },
    record: {
        header: "Your Record",
        return: "Back to Profile",
        empty: [
            "Your sessions are currently ",
            "empty.",
            " Let's go back to homepage and lock in!~",
        ],
        months: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        warning: "Deleting a record, are you sure?",
        formatDate: formatDateEnNoYear,
    },
    setting: {
        question: "What should we call you?",
        danger: "Danger Zone",
        delete: {
            button: "Delete Account",
            warning: "Deleting your account, are you sure?",
        },
        clear: {
            button: "Clear All Records",
            warning: "Deleting all records, are you sure?",
        },
        logout: "Logout",
        errorItem: "information",
    },
    notFound: {
        desc: "Maybe I'm not what you're looking for?",
        suggest: "Try navigating back to",
    },
    login: {
        header: "Let's sign you in!",
        google: "Login with Google",
    },
    error: {
        header: "There was a trouble getting your ",
        desc: "Maybe go back to homepage again?",
        updateDb: "There was a problem updating your database.",
        signIn: "Failed to sign in with Google",
        delete: "There was a problem deleting your record",
        logOut: "We had a trouble logging you out.",
        clear: "We had trouble clearing your records",
        processFile: "There was a problem processing your file",
        upload: "Failed to upload image.",
        getUrl: "There was a problem getting your avatar URL.",
        updateProfile: "There was a problem updating your profile.",
        terminate: "Failed to delete your account.",
    },
};

export default en;
