/* eslint ember/order-in-components: 0 */
import Component from '@ember/component';

export default Component.extend({
  classNames: ['school-session-attributes-collapsed'],
  tagName: 'section',
  showSessionAttendanceRequired: false,
  showSessionSupplemental: false,
  showSessionSpecialAttireRequired: false,
  showSessionSpecialEquipmentRequired: false,
});
