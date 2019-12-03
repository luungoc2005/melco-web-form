export const formatTime = (time, intl) => {
  let tmp = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  const am_text = intl.formatMessage({
    id: 'common.time_format.am_text',
    defaultMessage: 'am'
  })
  const pm_text = intl.formatMessage({
    id: 'common.time_format.pm_text',
    defaultMessage: 'pm'
  })
  if (tmp.length > 1) {
    tmp = tmp.slice (1);
    tmp[0] = + tmp[0] % 12 || 12;
  }
  
  // console.log(tmp)
  return tmp.length > 1
  ? intl.formatMessage({
      id: 'common.time_format.time_format',
      defaultMessage: '{hours}:{minutes} {am_pm}'
    }, {
      hours: tmp[0],
      minutes: tmp[2],
      am_pm: tmp[0] < 12 ? am_text : pm_text
    })
  : "";
}