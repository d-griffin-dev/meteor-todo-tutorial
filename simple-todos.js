Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Template.body.helpers({
    tasks: function(){
      if (Session.get('hideCompleted')) {
        // if hide completed is checked, filter out the tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // otherwise return all the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function() {
      return Session.get('hideCompleted');
    },
    incompleteCount: function() {
      return Tasks.find({'checked': {$ne: true}}).count();
    }
  });

  Template.body.events({
    'submit .new-task': function(event){
      // prevent the standard form submit event
      event.preventDefault();

      // get value from form element
      var text = event.target.text.value;

      // insert a task into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date(),            // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });

      // clear form
      event.target.text.value = '';
    },
    'change .hide-completed input': function(event){
      Session.set('hideCompleted', event.target.checked);
    }
  });

  Template.task.events({
    'click .toggle-checked': function() {
      // set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    'click .delete': function(){
      Tasks.remove(this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  })

}
