var tzwhere = require('tzwhere');
var moment = require('moment');

tzwhere.init();

module.exports = {
    timeBasedGreeting: function(lat, lon) {
        var message = '';
        var categories = [];
        var hour = timeAtLocation(lat, lon);
        if (hour < 6){
            message = 'Late night or super early hunger?';
            categories = ['Diner', 'Pub', 'Hotel Bar', '24/7'];
        } else if (hour < 9) {
            message = 'Breakfast time maybe?';
            categories = ['Diner', 'Breakfast', 'Café'];
        } else if (hour < 11) {
            message = 'Looking for a snack or brunch maybe?';
            categories = ['Brunch', 'Café', 'Breakfast'];
        } else if (hour < 1) {
            message = 'Lunch time!';
            categories = ['American', 'Italian', 'Chinese', 'Casual'];
        } else if (hour < 18) {
            message = 'Hmmmm afternoon food.';
            categories = ['Café', 'Pub'];
        } else {
            message = 'Good evening, dinner time maybe?';
            categories = ['American', 'Italian', 'Fine Dining'];
        }
        return {message, categories};
    }
}

function timeAtLocation(lat, long) {
        return moment.utc().add(tzwhere.tzOffsetAt(lat, long), 'ms').hour();
}
