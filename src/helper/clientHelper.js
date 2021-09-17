import moment from 'moment';
export let bufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString('base64');
};

export let getLastItemOfArray = (arr) => {
  if (!arr.length) return [];
  return arr[arr.length - 1];
};

export let covertTimestamp = (timestamp) => {
  if (!timestamp) return '';
  return moment(timestamp).locale('vi').startOf('seconds').fromNow();
};
