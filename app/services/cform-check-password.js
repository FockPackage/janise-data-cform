import Service from 'ember-service';
import inject from 'ember-service/inject';
import config from 'choice-dashboard/config/environment';

export default Service.extend({
  ajax: inject('cform-ajax'),

  test(password) {
    return this.get('ajax').request(`${config.API_ENDPOINT}/UM/CheckPassword`, {
      data: { password: password }
    })
      .then(response => {
        if(response.Result.IsRight) return true;
        throw new Error('密码错误！');
      });
  }
});
