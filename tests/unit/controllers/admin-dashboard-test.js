import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | AdminDashboard ', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    var controller = this.owner.lookup('controller:admin-dashboard');
    assert.ok(controller);
  });
});
