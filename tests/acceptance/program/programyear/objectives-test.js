import {
  module,
  skip,
  test
} from 'qunit';
import setupAuthentication from 'ilios/tests/helpers/setup-authentication';
import { click, find, findAll, settled, visit } from '@ember/test-helpers';
import $ from 'jquery';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { getElementText, getText } from 'ilios/tests/helpers/custom-helpers';
const url = '/programs/1/programyears/1?pyObjectiveDetails=true';

module('Acceptance: Program Year - Objectives', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  hooks.beforeEach(async function () {
    const school = this.server.create('school');
    await setupAuthentication({ school });
    this.server.create('program', {
      school,
    });
    this.server.create('programYear', {
      programId: 1,
    });
    this.server.create('cohort', {
      programYearId: 1
    });
    this.server.create('competency', {
      school,
    });
    this.server.create('competency', {
      parentId: 1,
      school,
      programYearIds: [1],
    });
    this.server.create('competency', {
      parentId: 1,
      school,
      programYearIds: [1],
    });
    this.server.create('competency', {
      school,
      programYearIds: [1],
    });
    this.server.create('competency', {
      school,
      programYearIds: [1],
    });
    this.server.createList('meshDescriptor', 4);

    this.server.create('objective', {
      programYearIds: [1],
      competencyId: 2,
      meshDescriptorIds: [1, 2]
    });
    this.server.create('objective', {
      programYearIds: [1],
      competencyId: 4
    });
    this.server.create('objective', {
      programYearIds: [1]
    });
  });

  test('list', async function(assert) {
    await visit(url);
    assert.equal(findAll('.programyear-objective-list tbody tr').length, 3);

    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(1)'), getText('objective 0'));
    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(2)'), getText('competency 1 (competency 0)'));
    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(3)'), getText('descriptor 0 descriptor 1'));

    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(2) td:nth-of-type(1)'), getText('objective 1'));
    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(2) td:nth-of-type(2)'), getText('competency 3'));
    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(2) td:nth-of-type(3)'), getText('Add New'));

    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(3) td:nth-of-type(1)'), getText('objective 2'));
    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(3) td:nth-of-type(2)'), getText('Add New'));
    assert.equal(await getElementText('.programyear-objective-list tbody tr:nth-of-type(3) td:nth-of-type(3)'), getText('Add New'));
  });

  skip('manage terms', async function() {
    //skip until we convert this test to the page object system
  });

  skip('save terms', async function() {
    //skip until we convert this test to the page object system
  });

  skip('cancel term changes', async function() {
    //skip until we convert this test to the page object system
  });

  test('manage competencies', async function(assert) {
    assert.expect(14);
    await visit(url);
    let tds = findAll('.programyear-objective-list tbody tr:nth-of-type(1) td');
    assert.equal(tds.length, 3);
    await click(find('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(2) .link'));
    assert.equal(await getElementText(find('.specific-title')), 'SelectParentCompetencyforObjective');
    assert.equal(await getElementText(find('.objective-manage-competency .objectivetitle')), getText('objective 0'));
    assert.equal(await getElementText(find('.objective-manage-competency .parent-picker')), getText('competency0 competency1 competency2 competency3 competency4'));
    let items = findAll('.parent-picker .clickable');
    assert.equal(items.length, 4);
    assert.ok(find('.parent-picker h5').classList.contains('selected'));
    assert.ok(find(items[0]).classList.contains('selected'));
    assert.ok(!find(items[1]).classList.contains('selected'));
    assert.ok(!findAll('.parent-picker h5')[1].classList.contains('selected'));
    assert.ok(!findAll('.parent-picker h5')[2].classList.contains('selected'));

    await click(findAll('.objective-manage-competency .parent-picker .clickable')[2]);
    items = findAll('.parent-picker .clickable');
    assert.ok(!find(items[0]).classList.contains('selected'));
    assert.ok(!find(items[1]).classList.contains('selected'));
    assert.ok(find(items[2]).classList.contains('selected'));
    assert.ok(!find(items[3]).classList.contains('selected'));
  });

  test('save competency', async function(assert) {
    assert.expect(1);
    await visit(url);
    await click('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(2) .link');
    let objectiveManager = find('.objective-manage-competency')[0];
    await click(findAll('.parent-picker .clickable')[1], objectiveManager);
    await click('.detail-objectives button.bigadd');
    assert.equal(await getElementText(find(findAll('.programyear-objective-list tbody tr td')[1])), getText('competency 2 (competency 0)'));
  });

  test('save no competency', async function(assert) {
    assert.expect(1);
    await visit(url);
    await click('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(2) .link');
    let objectiveManager = find('.objective-manage-competency')[0];
    await click(find('.parent-picker .clickable'), objectiveManager);
    await click('.detail-objectives button.bigadd');
    assert.equal(await getElementText(find(findAll('.programyear-objective-list tbody tr td')[1])), getText('Add New'));
  });

  test('cancel competency change', async function(assert) {
    assert.expect(1);
    await visit(url);
    await click('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(2) .link');
    let objectiveManager = find('.objective-manage-competency')[0];
    await click(findAll('.parent-picker li')[1], objectiveManager);
    await click('.detail-objectives button.bigcancel');
    assert.equal(await getElementText(find(findAll('.programyear-objective-list tbody tr td')[1])), getText('competency 1 (competency 0)'));
  });

  test('cancel remove competency change', async function(assert) {
    assert.expect(1);
    await visit(url);
    await click('.programyear-objective-list tbody tr:nth-of-type(1) td:nth-of-type(2) .link');
    let objectiveManager = find('.objective-manage-competency')[0];
    await click(find('.parent-picker li'), objectiveManager);
    await click('.detail-objectives button.bigcancel');
    assert.equal(await getElementText(find(findAll('.programyear-objective-list tbody tr td')[1])), getText('competency 1 (competency 0)'));
  });

  test('add competency', async function(assert) {
    assert.expect(1);
    await visit(url);
    await click('.programyear-objective-list tbody tr:nth-of-type(3) td:nth-of-type(2) button');
    let objectiveManager = find('.objective-manage-competency')[0];
    await click(findAll('.parent-picker .clickable')[1], objectiveManager);
    await click('.detail-objectives button.bigadd');
    assert.equal(await getElementText(find(findAll('.programyear-objective-list tbody tr:nth-of-type(3) td')[1])), getText('competency 2 (competency 0)'));
  });

  test('empty objective title can not be saved', async function(assert) {
    assert.expect(3);
    await visit(url);
    const container = '.programyear-objective-list';
    const title = `${container} tbody tr:nth-of-type(1) td:nth-of-type(1)`;
    const edit = `${title} .editable span`;
    const editor = `${title} .fr-box`;
    const initialObjectiveTitle = 'objective 0';
    const save = `${title} .done`;
    const errorMessage = `${title} .validation-error-message`;

    assert.equal(await getElementText(title), getText(initialObjectiveTitle));
    await click(edit);

    const froala = $(editor);
    froala.froalaEditor('html.set', '<p>&nbsp</p><div></div><span>  </span>');
    froala.froalaEditor('undo.saveStep');
    await settled();

    assert.equal(await getElementText(errorMessage), getText('This field cannot be blank'));
    assert.ok(find(save).disabled);
  });
});
