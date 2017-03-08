import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
  keyForRelationship(key) {
    return `${key}_id`;
  }
});
