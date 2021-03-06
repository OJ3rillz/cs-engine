cs.objects['obj_interface'] = {
    create: function(){
        cs.obj.create({ type: 'obj_joystick', x:0, y:0 })
        cs.obj.create({ type:'obj_buttons', x:0, y:0 })
    },
    step: function(){

    }
}

cs.objects['obj_buttons'] = {
	create: function(){
		this.touch = cs.touch.observer()
		this.width = 30;
	   this.height = 30;
	   this.core.surface = 'gui';
		this.cx = 0;
		this.cy = 0;
	},
	step: function(){
      var btnRect = {
		   x: cs.draw.canvas.width - 50,
		   y: cs.draw.canvas.height - 50,
         width: this.width,
         height: this.height
      }

		this.touch.check(btnRect);
		if(this.touch.isDown()){
			//console.log('open');
			cs.key.virtualPress(32);
		}

		if(this.touch.isHeld()) cs.draw.setAlpha(0.5)
		cs.draw.fillRect(btnRect);
		cs.draw.setColor("white");
		//cs.draw.strokeRect(btnRect);
	}
}

cs.objects['obj_joystick'] = {
   create: function(){
		this.touch = cs.touch.observer()
      this.width = 64;
      this.height = 64;
      this.core.surface = 'gui';
      this.tx = 0;
      this.ty = 0;
      this.jw = this.width/2;
      this.jh = this.height/2;
    },
    step: function(){
      this.x = 10; this.y = cs.draw.canvas.height - this.height - 10;
      this.touch.check({ x:this.x, y:this.y, width:this.width, height:this.height });

      this.tx = this.x + (this.width/2) - (this.jw/2);
      this.ty = this.y + (this.width/2) - (this.jh/2);

      if(this.touch.isHeld()){
          this.tx = this.touch.x-(this.jw/2);
          if(this.tx < this.x){
             this.tx = this.x;
             //left key
             cs.key.virtualDown(37);
          } else {cs.key.virtualUp(37)}
          if(this.tx + this.jw > this.x + this.width){
             this.tx = this.x+this.width-this.jw;
             //right key
             cs.key.virtualDown(39);
          } else {cs.key.virtualUp(39)}
          this.ty = this.touch.y-(this.jh/2);
          if(this.ty < this.y){
             this.ty = this.y;
             //up key
             cs.key.virtualDown(38);
          } else {cs.key.virtualUp(38);}
          if(this.ty + this.jw > this.y + this.height){
             this.ty = this.y+this.height-this.jh;
          }
      } else {
       if(this.touch.isUp()){
          if(cs.key.held(37)){
             cs.key.virtualUp(37);
          }
          if(cs.key.held(38)){
             cs.key.virtualUp(38);
          }
          if(cs.key.held(39)){
             cs.key.virtualUp(39);
          }
       }
      }

      cs.draw.setAlpha(0.25);
      cs.draw.setColor('#000000')
      cs.draw.fillRect({ x:this.x, y:this.y, width:this.width, height:this.height });
      cs.draw.setColor('#fff');
      cs.draw.strokeRect({ x:this.tx, y:this.ty, width:this.jw, height:this.jh });

      cs.draw.text({ x:1, y:0, text:'FPS Step: ' + cs.fps.rate });
      cs.draw.text({ x:1, y:30, text:'Scale: ' + cs.camera.scale });


      //cs.draw.fillRect({ x: 0, y: cs.draw.canvas.height-this.height, width: 50, height: 50})
   }
}
