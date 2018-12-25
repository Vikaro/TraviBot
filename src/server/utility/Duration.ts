var readline = require('readline');

export default class Duration {
    constructor(duration) {
        var splitted = duration.split(":");
        this.Hours = parseInt(splitted[0]);
        this.Minutes = parseInt(splitted[1]);
        this.Seconds = parseInt(splitted[2]);
        this.String = duration;
    }
    Hours;
    Minutes;
    Seconds;
    String;

    AddSeconds(number) {
        this.Seconds += number;
        if (this.Seconds >= 60) {
            this.Minutes++;
            this.Seconds -= 60;
        }
        if (this.Minutes >= 60) {
            this.Hours++;
            this.Minutes -= 60;
        }
    }
    GetMiliseconds = () => {
        return ((this.Hours * 60 + this.Minutes) * 60 + this.Seconds) * 1000;
    }
    GetString = () => `${this.Hours}:${this.Minutes}:${this.Seconds}`;
}


export const delay = (time: string) => {
    return new Promise((resolve, reject) => {
        if (time == null) reject("duration error");
        const due = new Duration(time);
        const timeLeft = new Duration("0:0:0");

        const intervalId = setInterval(() => {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            process.stdout.write(`${timeLeft.GetString()} / ${due.GetString()}`);
            timeLeft.AddSeconds(1);
        }, 1000);
        setTimeout(() => {
            clearInterval(intervalId);
            resolve()
        }, due.GetMiliseconds());
    })
}