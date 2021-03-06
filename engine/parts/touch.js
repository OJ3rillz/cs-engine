//---------------------------------------------------------------------------------------------//
//-------------------------------| Touch Input Functions |-------------------------------------//
//---------------------------------------------------------------------------------------------//
cs.touch = {
   list : [
		{ id: -1, x: undefined, y: undefined, used: false } // mouse
	],
	eventDown: function(e){
		cs.touch.touchUse(e.changedTouches[0].identifier)
		cs.touch.eventMove(e)
	},
	eventUp: function(e){
		var id = e.changedTouches[0].identifier;
		cs.touch.touchUnuse(id);
	},
	eventMove: function(e){
      e.preventDefault();
		for(var touch of e.changedTouches) {
			cs.touch.updatePos({
				id: touch.identifier,
				x: touch.clientX,
				y: touch.clientY
			})
      }
   },
   touchUse : function(id){
		// reuse from list or add to end
      for(var i = 0; i < cs.touch.list.length; i++)
         if(cs.touch.list[i].used === false) break

      cs.touch.list[i] = {
			id: id,
         used: false,
         down: true,
			held: true,
         up: false,
         x: undefined,
         y: undefined
      }
   },
   touchUnuse : function(id){
		var touch = cs.touch.list.find(function(t) { return t.id == id })
		if(!touch) return
		
		touch.used = false
		touch.held = false
		touch.up = true
   },
   updatePos: function(eTouch){
		var touch = cs.touch.list.find(function(t) { return t.id == eTouch.id })
		if(!touch) return

		touch.x = eTouch.x
		touch.y = eTouch.y
   },
   observer: function(useGameCords){
      return {
			observing: false,
			useGameCords: useGameCords,
         down : false,
         held : false,
         up : false,
         x : 0, y : 0,
         offsetX : 0,
			offsetY : 0,
         check : function(area){
				this.observing
					? this.observe()
					: this.findTouchToObserve(area)
			},
			observe: function() {
				// im observing. lets update my values
            if(this.observing) {
               this.x = this.touch.x
               this.y = this.touch.y
               if(this.useGameCords){
                  var convertedToGameCords = cs.touch.convertToGameCords(this.x, this.y)
                  this.x = convertedToGameCords.x
						this.y = convertedToGameCords.y
               }

               this.down = this.touch.down
               this.held = this.touch.held
               this.up = this.touch.up

					if(this.up) this.observing = false
					return
            }
			},
			findTouchToObserve(area) {
				// find a touch to observe
				for(var touch of cs.touch.list) {
					// this touch is being observed or not available to latch
					if(touch.used || !touch.down) continue

					var touchX = touch.x
					var touchY = touch.y
					if(this.useGameCords) {
						var convertedToGameCords = cs.touch.convertToGameCords(touchX, touchY)
                  touchX = convertedToGameCords.x
						touchY = convertedToGameCords.y
					}

					// check if within
					if(touchX > area.x && touchX < area.x + area.width &&
						touchY > area.y && touchY < area.y + area.height ){
						// observe this touch!
						touch.used = true

						// setup
						this.observing = true
						this.touch = touch
						// handy
						this.offsetX = touchX - area.x
						this.offsetY = touchY - area.y

						this.observe()
					}
				}
         },
			isDown: function() {
				return this.touch && this.touch.down
			},
			isUp: function() {
				return this.touch && this.touch.up
			},
			isHeld: function() {
				return this.touch && this.touch.held
			},
			isWithin : function(rect){
				var width = cs.default(rect.width, rect.size || 0)
				var height = cs.default(rect.height, rect.size || 0)

            return (this.x > rect.x) && (this.x < rect.x+width)
        				&& (this.y > rect.y) && (this.y < rect.y+height)
         }
      }
   },
   reset : function(){
		// up and down state only last one step
		for(var touch of cs.touch.list) {
			touch.down = false
			touch.up = false
		}
   },
   convertToGameCords(x, y){
      var rect = cs.canvas.getBoundingClientRect();

      var physicalViewWidth = (rect.right-rect.left)
      var physicalViewHeight = (rect.bottom-rect.top)
      var hortPercent = (x - rect.left)/physicalViewWidth
      var vertPercent = (y - rect.top)/physicalViewHeight
      var gamex = Math.round(hortPercent*cs.camera.width)
      var gamey = Math.round(vertPercent*cs.camera.height)
      gamex = (gamex) + cs.camera.x
      gamey = (gamey) + cs.camera.y
      return { x: gamex, y: gamey }
   }
}
