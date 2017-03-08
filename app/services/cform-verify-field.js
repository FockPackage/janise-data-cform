import Service from 'ember-service';

export default Service.extend({
  // 判断字段输入的值是否符合规则，符合返回 true
  test(field, value) {
    let re = '';
    const validValue = value.trim();
    switch (field) {
      case "email": {
        re = /[\w+-\.]+@[\w-]{1,62}(\.[\w-]{1,62})*\.[a-z]{2,62}\.?/i;
        break;
      }
      case "userName": {
        re = /[a-z0-9]{3,20}/i;
        break;
      }
      case "password": {
        return validValue.length >= 6;
      }
      case "website": {
        re = /http(s)?:\/\/[\w-]{1,62}(\.[\w-]{1,62})*\.[a-z]{2,62}\.?/i;
        break;
      }
      default:
        return validValue.length > 0;
    }

    const result = validValue.match(re) || false;
    return result && result[0] === validValue;
  },

  hasAlert(alertObject = {}) {
    for (let key in alertObject) {
      if(alertObject[key]) return true;
    }
    return false;
  }
});
