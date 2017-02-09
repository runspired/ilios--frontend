import Ember from 'ember';

const { Component, computed, RSVP } = Ember;
const { all, defer, Promise } = RSVP;

/**
 * Displays all given terms that belong to a given vocabulary as a list of tags.
 */
export default Component.extend({

  classNames: ['detail-terms'],

  /**
   * Flag indicating whether terms can be removed from the list or not.
   *
   * @property canEdit
   * @type {boolean}
   * @public
   */
  canEdit: false,

  /**
   * A vocabulary model.
   *
   * @property vocabulary
   * @type {DS.Model}
   */
  vocabulary: null,

  /**
   * A list of term models.
   *
   * @property terms
   * @type {Array}
   * @public
   */
  terms: [],

  /**
   * A sorted list of the filtered terms.
   * Terms are sorted by title including parent titles.
   *
   * @property sortedTerms
   * @type {Ember.computed}
   * @public
   */
  sortedTerms: computed('filteredTerms.[]', function() {
    return new Promise(resolve => {
      let terms = this.get('filteredTerms');
      let promises = [];
      let temp = [];
      terms.forEach(term => {
        let promise = new Promise(resolve => {
          term.get('titleWithParentTitles').then(title => {
            temp.pushObject({
              'term': term,
              'title': title
            });
            resolve();
          });
        });
        promises.pushObject(promise);
      });

      all(promises).then(() => {
        let sorted = temp.sort(function(a, b) {
          let titleA = a.title.toLowerCase();
          let titleB = b.title.toLowerCase();
          return (titleA > titleB ? 1 : (titleA < titleB ? -1 : 0));
        });
        resolve(sorted.mapBy('term'));
      });
    });
  }),

  /**
   * A filtered list of the given terms.
   * Terms are filtered by the given vocabulary.
   *
   * @property filteredTerms
   * @type {Ember.computed}
   * @public
   */
  filteredTerms: computed('terms.[]', 'vocabulary', function () {
    let terms = this.get('terms');
    let vocab = this.get('vocabulary');
    let filteredTerms = [];
    terms.forEach((term) => {
      if (term.get('vocabulary.id') === vocab.get('id')) {
        filteredTerms.push(term);
      }
    });
    return filteredTerms;
  }),

  actions: {
    remove: function (term) {
      if (this.get('canEdit')) {
        this.sendAction('remove', term);
      }
    }
  }
});
