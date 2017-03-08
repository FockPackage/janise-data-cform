import Component from 'ember-component';
import { A } from 'ember-array/utils';

export default Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    const currentCompany = A(this.companyList).findBy('CompanyID', this.currentCompanyId);
    this.set('currentCompany', currentCompany);
  }
});
