import RESTSerializer from 'ember-data/serializers/rest';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default RESTSerializer.extend(EmbeddedRecordsMixin, {
  attrs: {
    views: { embedded: 'always' }
  }
});
