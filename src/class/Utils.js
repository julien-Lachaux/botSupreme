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
    },

    getDeliveryCountries() {
        return [
            this.addDeliveryCountry('GB', 'UK'),
            this.addDeliveryCountry('NB', 'UK (N. IRELAND)'),
            this.addDeliveryCountry('AT', 'AUSTRIA'),
            this.addDeliveryCountry('BY', 'BELARUS'),
            this.addDeliveryCountry('BE', 'BELGIUM'),
            this.addDeliveryCountry('BG', 'BULGARIA'),
            this.addDeliveryCountry('HR', 'CROATIA'),
            this.addDeliveryCountry('CZ', 'CZECH REPUBLIC'),
            this.addDeliveryCountry('EE', 'DENMARK'),
            this.addDeliveryCountry('FI', 'FINLAND'),
            this.addDeliveryCountry('FR', 'FRANCE'),
            this.addDeliveryCountry('DE', 'GERMANY'),
            this.addDeliveryCountry('GR', 'GREECE'),
            this.addDeliveryCountry('HU', 'HUNGARY'),
            this.addDeliveryCountry('IS', 'ICELAND'),
            this.addDeliveryCountry('IE', 'IRELAND'),
            this.addDeliveryCountry('IT', 'ITALY'),
            this.addDeliveryCountry('LV', 'LATVIA'),
            this.addDeliveryCountry('LT', 'LITHUANIA'),
            this.addDeliveryCountry('LU', 'LUXEMBOURG'),
            this.addDeliveryCountry('MC', 'MONACO'),
            this.addDeliveryCountry('NL', 'NETHERLANDS'),
            this.addDeliveryCountry('NO', 'NORWAY'),
            this.addDeliveryCountry('PL', 'POLAND'),
            this.addDeliveryCountry('PT', 'PORTUGAL'),
            this.addDeliveryCountry('RO', 'ROMANIA'),
            this.addDeliveryCountry('RU', 'RUSSIA'),
            this.addDeliveryCountry('SK', 'SLOVAKIA'),
            this.addDeliveryCountry('SI', 'SLOVENIA'),
            this.addDeliveryCountry('ES', 'SPAIN'),
            this.addDeliveryCountry('SE', 'SWEDEN'),
            this.addDeliveryCountry('CH', 'SWITZERLAND'),
            this.addDeliveryCountry('TR', 'TURKEY')
        ]
    },

    addDeliveryCountry(value, name) {
        return {
            value:  value,
            name:   name
        }
    },

    getPaymentMethods() {
        return [
            this.addPaymentMethod('visa', 'Visa'),
            this.addPaymentMethod('master', 'Mastercard'),
            this.addPaymentMethod('american_express', 'American Express')
        ]
    },

    addPaymentMethod(value, name) {
        return {
            value:  value,
            name:   name
        }
    }
}