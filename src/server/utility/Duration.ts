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