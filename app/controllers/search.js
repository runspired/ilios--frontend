import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: {
    query: 'q',
  },
  query: null,
});