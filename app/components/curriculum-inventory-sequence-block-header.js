import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import { validator, buildValidations } from 'ember-cp-validations';
import ValidationErrorDisplay from 'ilios-common/mixins/validation-error-display';

const Validations = buildValidations({
  blockTitle: [
    validator('presence', true),
    validator('length', {
      min: 3,
      max: 200
    })
  ]
});

export default Component.extend(Validations, ValidationErrorDisplay, {
  store: service(),
  classNames: ['curriculum-inventory-sequence-block-header'],

  canUpdate: false,
  report: null,
  reportName: null,

  publishTarget: alias('sequenceBlock'),

  didReceiveAttrs(){
    this._super(...arguments);
    this.set('blockTitle', this.get('sequenceBlock.title'));
  },

  actions: {
    changeTitle() {
      const block = this.sequenceBlock;
      const newTitle = this.blockTitle;
      this.send('addErrorDisplayFor', 'blockTitle');
      return new Promise((resolve, reject) => {
        this.validate().then(({validations}) => {
          if (validations.get('isValid')) {
            this.send('removeErrorDisplayFor', 'blockTitle');
            block.set('title', newTitle);
            block.save().then((newBlock) => {
              this.set('blockTitle', newBlock.get('title'));
              this.set('sequenceBlock', newBlock);
              resolve();
            });
          } else {
            reject();
          }
        });
      });
    },

    revertTitleChanges() {
      const block = this.sequenceBlock;
      this.set('blockTitle', block.get('title'));
    }
  }
});
