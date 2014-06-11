var NamesGenerator = {

	DBtier4: ["Kukulkán", "Huracán", "Tepeu", "Alom", "Bitol", "Qaholom", "Tzacol", "Xlitan", "Ajtzak", "Akaime", "Bitol", "Chirakata-Ixminasune", "Hunahpu-Gutch", "Ixmucane", "Ixpiyacoc", "Mulzencab", "Tepeu", "Tzacol", "Patán", "Quicxic", "Quicré", "Quicrixcac", "Itzamná"],
	DBtier3: ["Mueve-montañas", "Rompe muros", "Mata-dragones", "Descomunal", "Perfora corazones", "Inquebrantable"],
	DBtier2: ["de espinas", "tenaz", "punzante", "de las tinieblas", "de las llanuras", "irreal", "elemental"],
	DBtier1: ["de hierro", "de madera", "inútil", "de hojalata", "de cobre", "carcomido", "de mentira", "antinatural"],
	DBpotions: ["misteriosa", "de ranas y sapos", "asquerosa", "inconfundible", "deliciosa", "maya", "de cola de rata"],
	DBfood: ["pan", "pastel", "carne hecha", "carne cruda", "queso"],

	randomName: function(tier, item){
		var name = "";
		if(item=='equip'){
			name += " ";
			if(tier == 4){
				var r = Aux.newRandom(0, this.DBtier4.length-1);
				name += ("de " + this.DBtier4[r]);
			} else if(tier == 3) {
				var r = Aux.newRandom(0, this.DBtier3.length-1); 
				name += this.DBtier3[r];
			} else if(tier == 2) {
				var r = Aux.newRandom(0, this.DBtier2.length-1); 
				name += this.DBtier2[r];
			} else {
				var r = Aux.newRandom(0, this.DBtier1.length-1); 
				name += this.DBtier1[r];
			}
		} else if (item=='potion'){
			var r = Aux.newRandom(0, this.DBpotions.length-1);
			name = "Poción " + this.DBpotions[r] + '\n' + "No sabes cuál será" + '\n' + "su efecto";
		} else if (item=='food') {
			console.log("tahaha")
			var r = Aux.newRandom(0, this.DBfood.length-1);
			name = this.DBfood[r];
		}
		return name;
	} 
};

var objectGenerator = {

	spawner : function(stage, min, max){
		var max = Aux.newRandom(min, max);
		var item = null;
		console.log(max);
		for(var i=0; i<max; i++){
			item = this.spawn();
			if(item!=null){
				stage.insert(Dungeon.insertEntityInRoom(item, i));
			}
		}
	},

	spawn : function(){
		var r = Math.random();
		var tier = 0;

		if(r<0.1){
			tier = 4;
		} else if(r<0.2){
			tier = 3;
		} else if(r<0.5){
			tier = 2;
		} else {
			tier = 1;
		}

		r = Math.random();
		var item = null;

		//EQUIPO 35%
		if(r<0.35){
			r = Math.random();
			//TODO tener en cuenta el piso
			var atk = Math.ceil(Math.random()*2);
			if(Math.random()<0.3)
				atk=-atk;
			var def = Math.ceil(Math.random()*1);
			if(Math.random()<0.3)
				def=-def;
			var hp = Math.ceil(Math.random()*10);
			if(Math.random()<0.3)
				hp=-hp;
			var sprite;

			if(r<0.25){
				item = new Q.Weapon({tier: tier, sheet: ("arma"+(((tier-1)*10)+Aux.newRandom(1,10))), name:("Arma "+NamesGenerator.randomName(tier, 'equip'))});
			} else if(r<0.50){
				item = new Q.Shield({tier: tier, sheet: ("escudo"+(((tier-1)*6)+Aux.newRandom(1,6))), name:("Escudo"+NamesGenerator.randomName(tier, 'equip'))});
			} else if(r<0.75){
				item = new Q.Armor({tier: tier, sheet: ("armadura"+(((tier-1)*3)+Aux.newRandom(1,3))), name:("Armadura"+NamesGenerator.randomName(tier, 'equip'))});
			} else {
				item = new Q.Helmet({tier: tier, sheet: ("casco"+(((tier-1)*3)+Aux.newRandom(1,3))), name:("Casco"+NamesGenerator.randomName(tier, 'equip'))});
			}
			item.statear(atk,def,hp);

		//COMIDA 30%
		} else if(r<0.66){
			var hp = Math.ceil(Math.random()*CharSheet.maxHp/2);
			var name = NamesGenerator.randomName(tier, 'food');

			item = new Q.Food({tier: tier, sheet: name, name: (name + '\n' + "Si te lo comes" + '\n' + "te curarás una" + '\n' + "porción de tu vida")});

			item.statear(hp);

		//POCIONES 10%
		} else if(r<0.76){
			var atk = 0;
			var def = 0;
			var hp = 0;
			var heal = 0;
			var maxHeal = 0;

			var giveStat = Math.random();
			var loops = Aux.newRandom(1,2);

			for(var i=0; i<loops; i++){
				if(giveStat<0.2){
					atk += 1;
				} else if (giveStat<0.4) {
					def += 1;
				} else if (giveStat<0.6) {
					hp += 1 ;
				} else if (giveStat<0.8) {
					heal += 0.1;
				} else {
					maxHeal += 5;
				}
			}

		//NO SPAWNEAR "20%"
			item = new Q.Potion({tier: tier, sheet: ("pocion"+(Aux.newRandom(1,7))), name: NamesGenerator.randomName(tier, 'potion')});

			item.statear(atk, def, hp, heal, maxHeal);
		}

		return item;
	}
}