import { helper } from 'ember-helper';
import { htmlSafe } from 'ember-string';

export default helper((args, hash) => {
  let result = '', key;

  for (key in hash) {
    if (hash[key] && hash.hasOwnProperty(key)) {
      if (key === 'background-image') {
        result += `${key}: url(${hash[key]});`;
      } else {
        result += `${key}: ${hash[key]};`
      }
    }
  }
  return htmlSafe(result);
});
