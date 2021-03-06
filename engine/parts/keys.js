//---------------------------------------------------------------------------------------------//
//---------------------------------| Key Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.key = {
   upList: {},
   downList: {},
   heldList: {},
   events: [],
   addEvent: function(keyCode, eventType) {
      var num = cs.key.events.length
      cs.key.events[num] = {
         event: eventType,
         key: keyCode
      }
   },
   execute: function() {
      for (var i = 0; i < cs.key.events.length; i++) {
         var event = cs.key.events[i].event;
         var key = cs.key.events[i].key
         cs.key.processEvent(key, event)
      }
      cs.key.events = [];
   },
   processEvent: function(keyCode, type) {
      if (type == 'up') {
         cs.key.upList[keyCode] = true
         return
      }

      cs.key.downList[keyCode] = true;
      cs.key.heldList[keyCode] = true;
   },
   reset: function() {
      for (var tmp in cs.key.downList) {
         cs.key.downList[tmp] = false
         if (cs.key.upList[tmp]){
            cs.key.heldList[tmp] = false
         }
         
         cs.key.upList[tmp] = false
      }
   },
   updateDown: function(keyEvent) {
      keyEvent.preventDefault();
      if (!keyEvent.repeat) {
         cs.key.virtualDown(keyEvent.keyCode);
      }
   },
   updateUp: function(keyEvent) {
      cs.key.virtualUp(keyEvent.keyCode);
   },
   virtualDown: function(keyCode) {
      cs.key.addEvent(keyCode, 'down');
   },
   virtualUp: function(keyCode) {
      cs.key.addEvent(keyCode, 'up');
   },
   virtualPress: function(key) {
      this.virtualDown(key);
      this.virtualUp(key);
   },
   up: function(keyID) {
      return cs.key.upList[keyID] || false
   },
   down: function(keyID) {
      return cs.key.downList[keyID] || false
   },
   held: function(keyID) {
      return cs.key.heldList[keyID] || false
   }
}
