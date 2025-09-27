i/**
 * Convert relative months to actual month numbers
 * @param {number} month - The month number to check (-8 to 18)
 * @returns {number|null} - The converted month number (1-12) or null if invalid
 */
function checkMonth(month) {
    if (month > 0) {
        return month;
    } else {
        const mapping = {
            0: 12,
            '-1': 11,
            '-2': 10,
            '-3': 9,
            '-4': 8,
            '-5': 7,
            '-6': 6,
            '-7': 5,
            '-8': 4,
            '13': 1,
            '14': 2,
            '15': 3,
            '16': 4,
            '17': 5,
            '18': 6
        };
        return mapping[month] || null;
    }
}

module.exports = {
    checkMonth
};