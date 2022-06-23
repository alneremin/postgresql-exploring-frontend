export const Log = (function () {
    const logDenyTags = [
        //"TablePanel",
        "TopBar",
        "BaseBarScreen",
        "BaseScreen",
        "AppReducer",
        "MessageDialogs",
        //"KeyHandlersManager",
        "Actions"
        //"HttpService",
        //"ApiService"
    ];

    const logDenyStrings = ["tableFColumns", "mapStateToProps", "/settings"];

    const log = (tag: string, color: string, text: string, obj?: any) => {
        if (
            !logDenyTags.includes(tag) &&
            logDenyStrings.find((value) => text.indexOf(value) >= 0) === undefined
        ) {
            const msg = text.replace("{}", JSON.stringify(obj));
            const tagCss = `font-size: 12pt; font-weight: bold`;
            const textCss = `color: ${color}; font-size: 12pt`;
            console.log(`%c[${tag}] %c${msg}`, tagCss, textCss);
        }
    };

    const e = (tag: string, text: string, obj?: any) => log(tag, "red", text, obj);
    const i = (tag: string, text: string, obj?: any) => log(tag, "#0000B2", text, obj);
    const d = (tag: string, text: string, obj?: any) => log(tag, "black", text, obj);
    const d1 = (tag: string, text: string, obj?: any) => log(tag, "#A52A2A", text, obj);
    const d2 = (tag: string, text: string, obj?: any) => log(tag, "#2EA2A1", text, obj);
    const d3 = (tag: string, text: string, obj?: any) => log(tag, "#FFA500", text, obj);
    const d4 = (tag: string, text: string, obj?: any) => log(tag, "#800080", text, obj);
    const d5 = (tag: string, text: string, obj?: any) => log(tag, "#1E90FF", text, obj);
    const d6 = (tag: string, text: string, obj?: any) => log(tag, "#8B6914", text, obj);
    const d7 = (tag: string, text: string, obj?: any) => log(tag, "#008000", text, obj);

    return {
        e: e,
        i: i,
        d: d,
        d1: d1,
        d2: d2,
        d3: d3,
        d4: d4,
        d5: d5,
        d6: d6,
        d7: d7
    };
})();
