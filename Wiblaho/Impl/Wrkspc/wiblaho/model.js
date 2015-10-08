Wiblaho.Instance = function(model){
	var Self = this;
	var ID = null;
	var Values = {};
	this.model = model;

	this.set = function(key,value){
		var att = Self.model.attributes.first(function(el){if(el.key==key) return true; else return false;});
		var typos = Wiblaho.Model.AttributeType;
		switch(att.type){
			case typos.Integer:
				if(!isNumber(value)){
					var parsed = parseInt(value);
					if(!isNumber(parsed))
						throw Wiblaho.Model.Exceptions.Constraint;
					else
						value = parsed;
				}
				Values[key] = value;
				break;
			default:
		}
		Values[key] = value;
	}

	this.get = function(key){
		return Values[key];
	}

	this.save = function(){
		Self.model.defaultRepository.save(Self);
	}

	this.id = function(){
		return ID;
	}
}

Wiblaho.Model = function(name, args){
	var Self = this;
	this.name = name;
	this.attributes = args.attributes;
	this.repository = new Repository(Self);
	this.create = function(){
		return new Wiblaho.Instance(Self);
	}

}

Wiblaho.Model.Exceptions = {
	Constraint: { message: "Constraint exception" }
}

Wiblaho.Model.AttributeType = {
	Integer: 0,
	Text: 1
}

Wiblaho.Model.RelationshipType = {
	HasOne: 0;
	HasMany: 1
}
