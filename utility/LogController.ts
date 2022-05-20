import moment from "moment";

const Reset = "\x1b[0m"
const Bright = (str: string) => { console.log("\x1b[1m%s" + Reset, str) }
const Dim = (str: string) => { console.log("\x1b[2m%s" + Reset, str) }
const Underscore = (str: string) => { console.log("\x1b[4m%s" + Reset, str) }
const Blink = (str: string) => { console.log("\x1b[5m%s" + Reset, str) }
const Reverse = (str: string) => { console.log("\x1b[7m%s" + Reset, str) }
const Hidden = (str: string) => { console.log("\x1b[8m%s" + Reset, str) }

const FgBlack = (str: string) => { console.log("\x1b[30m%s" + Reset, str) }
const FgRed = (str: string) => { console.log("\x1b[31m%s" + Reset, str) }
const FgGreen = (str: string) => { console.log("\x1b[32m%s" + Reset, str) }
const FgYellow = (str: string) => { console.log("\x1b[33m%s" + Reset, str) }
const FgBlue = (str: string) => { console.log("\x1b[34m%s" + Reset, str) }
const FgMagenta = (str: string) => { console.log("\x1b[35m%s" + Reset, str) }
const FgCyan = (str: string) => { console.log("\x1b[36m%s" + Reset, str) }
const FgWhite = (str: string) => { console.log("\x1b[37m%s" + Reset, str) }

const BgBlack = (str: string) => { console.log("\x1b[40m%s" + Reset, str) }
const BgRed = (str: string) => { console.log("\x1b[41m%s" + Reset, str) }
const BgGreen = (str: string) => { console.log("\x1b[42m%s" + Reset, str) }
const BgYellow = (str: string) => { console.log("\x1b[43m%s" + Reset, str) }
const BgBlue = (str: string) => { console.log("\x1b[44m%s" + Reset, str) }
const BgMagenta = (str: string) => { console.log("\x1b[45m%s" + Reset, str) }
const BgCyan = (str: string) => { console.log("\x1b[46m%s" + Reset, str) }
const BgWhite = (str: string) => { console.log("\x1b[47m%s" + Reset, str) }

export class Debug {

  public static Log(message: string, payload?: any) {
    console.log("")
    console.log("- " + moment(moment.now()).format("hh:mm:ss.SSS"))
    BgGreen(`    - ${message}
         ${payload ? `${(JSON.stringify(payload || { payload: "n/a" }) + "")
        .replace(/{/g, "{\n           ")
        .replace(/}/g, "\n         }\n")
        .replace(/,/g, ",\n           ")
        }`
        : ``}`)
  }

  public static Error(message: string, payload?: any) {
    console.log("")
    console.log("- " + moment(moment.now()).format("hh:mm:ss.SSS"))
    BgRed(`    - ${message}
         ${payload ? `${(JSON.stringify(payload || { payload: "n/a" }) + "")
        .replace(/{/g, "{\n           ")
        .replace(/}/g, "\n         }\n")
        .replace(/,/g, ",\n           ")
        }`
        : ``}`)
  }

  public static Require(sourceFunction: string, obj: any) {
    let errors: string[] = [];
    Object.keys(obj).forEach(key => {
      if (obj[key] == undefined) {
        errors.push(key);
      }
    });

    errors.forEach(error => {
      Debug.Error("MISSING KEY: " + error);
    })
  }
}