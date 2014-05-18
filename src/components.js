//Custom controls
Q.component("customControls", {

  added: function() {
    var p = this.entity.p;

    if(!p.stepDistance) { p.stepDistance = 32; }
    if(!p.stepDelay) { p.stepDelay = 0.2; }
    if(!p.inTurn) {p.inTurn = true; }

    p.stepWait = 0;
    this.entity.on("step",this,"step");
    this.entity.on("hit", this,"collision");
  },

  collision: function(col) {
    var p = this.entity.p;

    if(p.stepping) { 
      p.stepping = false;
      p.x = p.origX;
      p.y = p.origY;
    }
  },

  step: function(dt) {
    var p = this.entity.p;
    p.stepWait -= dt;

    if(p.stepping) {
      p.x += p.diffX * dt / p.stepDelay;
      p.y += p.diffY * dt / p.stepDelay;
    }

    if(p.stepWait > 0) { return; }
    if(p.stepping) {
      p.x = p.destX;
      p.y = p.destY;
    }
    p.stepping = false;

    p.diffX = 0;
    p.diffY = 0;

    this.matrixX = toMatrix(p.x);
    this.matrixY = toMatrix(p.y);

    var arriba = new Array();
    var centro = new Array();
    var abajo = new Array();

    var i=0;
    for(j=this.matrixX-1; j<=this.matrixX+1; j++){
      if(i>=0 && j>=0){
        arriba[i]=Dungeon.map[this.matrixY-1][j];
        centro[i]=Dungeon.map[this.matrixY][j];
        abajo[i]=Dungeon.map[this.matrixY+1][j];
      }
      i++;
    }

    if(p.inTurn) { //Move only when in turn
      p.pressed='none';
      if(Q.inputs['left'] && centro[0]==2) {
        p.pressed='left';
        p.diffX = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['right'] && centro[2]==2) {
        p.pressed='right';
        p.diffX = p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['up'] && arriba[1]==2) {
        p.pressed='up';
        p.diffY = -p.stepDistance;
        p.moving = true;
      } else if(Q.inputs['down'] && abajo[1]==2) {
        p.pressed='down';
        p.diffY = p.stepDistance;
        p.moving = true;
      } 

      if(p.diffY || p.diffX ) { 
        p.stepping = true;
        p.origX = p.x;
        p.origY = p.y;
        p.destX = p.x + p.diffX;
        p.destY = p.y + p.diffY;
        p.stepWait = p.stepDelay; 
        this.entity.trigger("end_move");
      }
    }
  }
});

Q.component("character", {

  live: function(HP, ATK, DEF) {
    this.entity.p.hitPoints = HP;
    this.entity.p.attack = ATK;
    this.entity.p.defense = DEF
  },

  extend: {
    dead: function(){
      if (this.p.hitPoints <= 0){
        return true;
      } else {
        return false;
      }
    },

    hit: function(aggressor) {
      this.p.hitPoints -= aggressor.p.attack-this.p.defense;
      //console.log("COORDENADAS: ",aggressor.p.x, aggressor.p.y);
      console.log("vida defensor "+this.p.hitPoints);
    }
  } 
});

Q.component("turn_component", {

  init_turn: function(pos) {
    enemiesArray.push(this.entity);
    if(pos==null || pos==undefined)
      this.entity.p.position = Q.state.get("enemies");
    else
      this.entity.p.position = pos;
  },

  extend: {
    act_turn: function(dead) {
      this.p.position -= dead;
    },

    pass_turn: function(){
      Q.state.inc("nextMove",1);
    }
  }
});
