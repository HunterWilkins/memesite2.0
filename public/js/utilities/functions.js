module.exports = function() {
    return {
        calcTimeElapsed: function(dbItem) {
            let timeElapsed;
            let timeDesc;

            if (dbItem.timeCreated) {
                timeElapsed = (Date.now() - item.timeCreated) / 1000;
                timeDesc = "sec";

                if (timeElapsed >= 60 && timeElapsed < 3600) {
                    timeElapsed /= 60;
                    timeDesc = "min";
                }

                else if (timeElapsed >= 3600 && timeElapsed < 86400) {
                    timeElapsed /= 60*60;
                    if (timeElapsed <= 2) {
                        timeDesc = "hr";
                    }
                    else {
                        timeDesc = "hrs";
                    }
                }

                if (timeElapsed >= 86400) {
                    timeElapsed /= 60*60*24;
                    timeDesc = "days";
                }

                if (timeDesc === "days" && timeElapsed >= 30) {
                    timeElapsed /= 30;
                    timeDesc = "months";
                }

                if (timeDesc === "months" && timeElapsed >= 12) {
                    timeElapsed /= 12;
                    timeDesc = "yrs";
                }
            }
        }
    }
}