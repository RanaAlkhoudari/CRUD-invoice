/**
 * This method uses two parameters the start and the end date and it returns a boolean value
 *
 * @param {Date} start The start date
 * @param {Date} end   The end date
 * @returns {Boolean}  Returns true if the current date is between the start and the end date
 */

function checkActivity(start, end) {
  const currentDate = new Date();
  const from = start;
  const to = end;
  const check = new Date(currentDate);
  //Checking if the current date is between two dates the start and the end date
  if (check > from && check < to) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkActivity;
