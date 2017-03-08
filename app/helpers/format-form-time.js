import Ember from 'ember';

export function formatFormTime(params/*, hash*/) {
  return params[0].split('：')[1];
}

export default Ember.Helper.helper(formatFormTime);
