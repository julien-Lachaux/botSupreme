export const Utils = {

    log(sElementToLog) {
        console.log(sElementToLog)
        console.log("\r")
    },

    getMonths() {
        return [
            this.addMonth(1, 'Janvier', 'January'),
            this.addMonth(2, 'Février', 'February'),
            this.addMonth(3, 'Mars', 'March'),
            this.addMonth(4, 'Avril', 'April'),
            this.addMonth(5, 'Mai', 'May'),
            this.addMonth(6, 'Juin', 'June'),
            this.addMonth(7, 'Juillet', 'July'),
            this.addMonth(8, 'Aout', 'August'),
            this.addMonth(9, 'Septembre', 'September'),
            this.addMonth(10, 'Octobre', 'October'),
            this.addMonth(11, 'Novembre', 'November'),
            this.addMonth(12, 'Decembre', 'December'),
        ]
    },

    addMonth(number, french, english) {
        return {
            number: number,
            french: french,
            english: english
        }
    }
}