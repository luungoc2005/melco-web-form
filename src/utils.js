export const formatTime = (time) => {
  let tmp = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (tmp.length > 1) {
    tmp = tmp.slice (1);
    tmp[5] = + tmp[0] < 12 ? ' am' : ' pm';
    tmp[0] = + tmp[0] % 12 || 12;
  }
  return tmp.join ('');
}