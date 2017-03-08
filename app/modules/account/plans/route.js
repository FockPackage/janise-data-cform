import Route from 'ember-route';

export default Route.extend({
  model() {
    return {
      planList: [
        {
          name: 'Starter',
          price: 0,
          description: 'Host unlimited sites without paying us a dime with Client Billing.',
          features: [
            { label: 'lable 1', tip: 'tip 1' },
            { label: 'lable 2', tip: 'tip 2' },
            { label: 'lable 3', tip: 'tip 3' },
          ],
          upgrade: 'Downgrade',
          button: 'border downgrade'
        },
        {
          name: 'Advanced',
          price: 50,
          description: 'Host unlimited sites without paying us a dime with Client Billing.',
          features: [
            { label: 'lable 1', tip: 'tip 1' },
            { label: 'lable 2', tip: 'tip 2' },
            { label: 'lable 3', tip: 'tip 3' },
          ],
          upgrade: 'Your plan',
          button: 'dark your-plan'
        },
        {
          name: 'Ultimate',
          price: 100,
          description: 'Host unlimited sites without paying us a dime with Client Billing.',
          features: [
            { label: 'lable 1', tip: 'tip 1' },
            { label: 'lable 2', tip: 'tip 2' },
            { label: 'lable 3', tip: 'tip 3' },
          ],
          upgrade: 'Upgrade',
          button: 'blue'
        }
      ]
    }
  }
});
