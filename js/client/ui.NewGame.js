goog.provide('spo.ui.NewGame');

goog.require('spo.template');
goog.require('spo.ui.NewTeam');

/**
 * Provide the 'new game' widget in game list. It only serves to create the new
 * game's name and then add it to the list.
 * Further editing should be handled by other components.
 *
 * @constructor
 * @extends {spo.ui.NewTeam}
 * @param {goog.dom.DomHelper=} odh An optional DOM helper.
 */
spo.ui.NewGame = function(odh) {
  goog.base(this, odh);
};
goog.inherits(spo.ui.NewGame, spo.ui.NewTeam);

/**
 * @inheritDoc
 */
spo.ui.NewGame.prototype.createDom = function() {
  this.decorateInternal(
    /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
    spo.template.createGame({}))));
};

/**
 * @inheritDoc
 */
spo.ui.NewGame.prototype.getCreatePacket = function(name) {
  return {
    'url': '/game/create',
    'data': {
      'name': name
    }
  }
};
