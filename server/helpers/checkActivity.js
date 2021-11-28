function checkActivity(start, end) {
  const currentDate = new Date();
  const from = start;
  const to = end;
  const check = new Date(currentDate);
  if (check > from && check < to) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkActivity;
