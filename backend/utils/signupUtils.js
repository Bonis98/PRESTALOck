//Calculate age of the user
const moment = require("moment/moment");
module.exports = {
    ageCalculation: function (dateOfBirth, dateformat) {
        //Convert date to js Date
        const dob = moment(dateOfBirth, dateformat).toDate();
        //Calculate difference from current date
        const diff_ms = Date.now() - dob.getTime();
        //Create date from millis
        const age_dt = new Date(diff_ms);
        //Return difference
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    genderControl: function (gender){
    return gender == 'M' || gender == 'F' || gender == '*';
    }
}