goog.provide('spo.control.Users');

goog.require('spo.control.Base');
goog.require('spo.ui.User');
goog.require('spo.ui.Users');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');

/**
 * Provides the control for the User list (team edit view).
 *
 * @constructor
 * @extends {spo.control.Base}
 * @param {Element} container The element to render in.
 */
spo.control.Users = function(container) {
  goog.base(this, container);
  this.view_ = null;
};
goog.inherits(spo.control.Users, spo.control.Base);

/**
 * Sets the active team with its corresponding user list. This control can
 * be used continuously for the management of users of different teams in the
 * same game.
 *
 * @param {spo.ds.Team} team The team to work with.
 * @param {spo.ds.UserList} userlist The user list to display (should be
 *                                   matching the team).
 */
spo.control.Users.prototype.setList = function(team, userlist) {
  this.team_ = team;
  this.list_ = userlist;
  this.loadView();
};

/**
 * Cleans up the view (i.e. prepair to use a new one).
 *
 * @private
 */
spo.control.Users.prototype.clean_ = function() {
  if (goog.isDefAndNotNull(this.view_)) {
    goog.dispose(this.view_);
  }
};

/**
 * @inheritDoc
 */
spo.control.Users.prototype.disposeInternal = function() {
  this.clean_();
  delete this.team_;
  delete this.list_;
  delete this.view_;
  goog.base(this, 'disposeInternal');
};

/**
 * Handles the user action delegated from sub-components.
 *
 * @private
 * @param  {spo.control.Event} ev The control event generated in a
 *                                sub-component.
 */
spo.control.Users.prototype.handleControlAction_ = function(ev) {
  var id = ev.target.getModel().getId();
  var action = ev.getAction();
  console.log('Received action and id:', action, id);
  if (action == spo.control.Action.SAVE) {
    spo.ds.Resource.getInstance().get({
      'url': '/player/update/' + id,
      'data': ev.target.getValues()
    }, function(resp) {
      console.log('The response on save', resp);
    });
  } else if (action == spo.control.Action.DELETE) {
    spo.ds.Resource.getInstance().get({
      'url': '/player/remove/' + id
    }, function(resp) {
      console.log('The response on delete', resp);
    })
  }
};

/**
 * Loads the view into existence after the needed data has been retrieved.
 *
 * @protected
 */
spo.control.Users.prototype.loadView = function() {
  this.clean_();
  this.view_ = new spo.ui.Users();
  this.view_.setModel(this.team_);
  this.view_.render(this.container_);

  var len = this.list_.getCount();
  var user;
  for (var i = 0; i < len; i++) {
    user = new spo.ui.User();
    user.setModel(this.list_.getByIndex(i));
    this.view_.addChild(user, true);
  }
  this.getHandler().listen(this.view_, spo.control.EventType.CONTROL_ACTION,
    this.handleControlAction_);
};

