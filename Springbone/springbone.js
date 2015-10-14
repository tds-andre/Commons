var app = app || {};

(function () {
	'use strict';

app.BaseModel = Backbone.Model.extend({
		nested: {},
		inherited: {},
		

		destroy: function(args){
			for(var key in this.inherited){

			}
			args = args || {};
			$.ajax({
 				url: this.href, 
 				type: "DELETE", 
 				contentType: "application/json", 				
 				success: function(data,status,xhr){ 					
 					if(args.success)
 						args.success(data, status, xhr);
 					console.log("BaseModel, destroy success:", data,status,xhr);
 				},
 				error: function(request,status,error){
 					if(args.error)
 						args.error(request,status,error);
 					console.log("BaseModel, destroy error:", request,status,error);
 				},
 				complete: function(a,b,c){
 					if(args.complete)
 						args.complete(a,b,c); 					
 				}
 			});

		},

		validate: function(){
			
		},
		validationBoilerplate: function(attrs,options){
			var
				defaults = {validate: false};
			options = options || {};
			options = _.extend(options, defaults);
			return options;
		},

		setIdentity: function(url){
			
			var
				ss = url.split("/");
			this.href = url;
			this.idd = ss[ss.length-1];
			this.typePath = ss[ss.length-2];

		},
		parse: function(a){
			if(a._links)
				this.setIdentity(a._links.self.href);
			return a;
		},
		nest: function(_args){		
			var args = _args || {}
			var _this = this;
			var links = args.links || this.attributes._links;
			this.dummy = {};		
	        for(var key in links)
	        {
	            if(key=='self'){
	            	this.href = links[key].href;
	            	continue;
	            }
	            var embeddedClass = this.nested[key] || this.inherited[key];
	            var embeddedLink = links[key].href;
	            if(embeddedClass)            
	            	var mdl = new embeddedClass();
	            else
	            	var mdl = new app.BaseModel();
	            if(mdl instanceof app.BaseModel)          
	           		this.set(key, mdl);
	           	else
	           		this.set(key,mdl);
	           	mdl.href = embeddedLink;         	
	        }
	        this.trigger("nest");
		},
		
		nestedFetch: function(_args, _deep){
			var deep = _deep || false;
			var args = _args || {}
			var _this = this;
			var links = args.links || this.attributes._links;
			this.dummy = {};		
	        for(var key in links)
	        {
	            if(key=='self'){
	            	this.href = links[key].href;
	            	continue;
	            }
	            var embeddedClass = this.nested[key] || this.inherited[key];
	            var embeddedLink = links[key].href;
	            if(embeddedClass)            
	            	var mdl = new embeddedClass();
	            else
	            	var mdl = new app.BaseModel();
	            if(mdl instanceof app.BaseModel)          
	           		this.set(key, mdl);
	           	else
	           		this.set(key,mdl);

	           	if(args.beforeFetch)
	           		args.beforeFetch(this, mdl)
	           	mdl.fetch({url: embeddedLink, reset: true});
	           	if(deep)
	           		mdl.nestedFetch(null, true)
	          	
	        }
	        this.trigger("innersync");
    	}
	});
})();


var app = app || {};

(function () {
	'use strict';

	app.BaseCollection = Backbone.Collection.extend({
		url: function() {
 		   return app.config.serverUrl + '/' + this.path;
 		},
 		deepFetch: false,
 		parse: function(response){
 			
 			var 
 				arrays = response._embedded,
 				result = [],
 				i = 0,
 				key;
 			for(key in arrays){
 				for(i = 0; i < arrays[key].length; i++){
 					arrays[key][i].typePath = key;
 					result.push(arrays[key][i]);
 				}
 			} 
 			
 			return result;
 		},
 		persist: function(model,args){

 			args = args ? args : {};
 			var
 				invalidation = model.validate(model.attributes, args);
 			if(!app.isDefined(invalidation)){
	 			$.ajax({
	 				url: this.url(), 
	 				type: "POST", 
	 				contentType: "application/json", 
	 				data: JSON.stringify(model.toJSON()),  
	 				success: function(data,status,xhr){
	 					model.setIdentity(xhr.getResponseHeader("Location"));
	 					if(args.success)
	 						args.success(model, data, status, xhr);
	 					console.log(data,status,xhr);
	 				},
	 				error: function(request,status,error){
	 					if(args.error)
	 						args.error(model, request,status,error);
	 				},
	 				complete: function(a,b,c){
	 					if(args.complete)
	 						args.complete(model, a,b,c);
	 					console.log(a,b,c);
	 				}
	 			});
 			}
 		},
 		update: function(model, args){
 			args = args ? args : {};
 			if(!app.isDefined(model.validate(model.attributes, args))){
	 			$.ajax({
	 				url: this.url() + "/" + model.idd, 
	 				type: "PATCH", 
	 				contentType: "application/json", 
	 				data: JSON.stringify(model.toJSON()),  
	 				success: function(data,status,xhr){ 					
	 					if(args.success)
	 						args.success(data, status, xhr);
	 					console.log(data,status,xhr);
	 				},
	 				error: function(request,status,error){
	 					if(args.error)
	 						args.error(request,status,error);
	 				},
	 				complete: function(a,b,c){
	 					if(args.complete)
	 						args.complete(a,b,c);
	 					console.log(a,b,c);
	 				}
	 			});
	 		}
 		},
 		patch: function(model, attrs, args){
 			args = args ? args : {};
 			if(!app.isDefined(model.validate(model.attributes, args))){
	 			$.ajax({
	 				url: this.url() + "/" + model.idd, 
	 				type: "PATCH", 
	 				contentType: "application/json", 
	 				data: JSON.stringify(attrs),  
	 				success: function(data,status,xhr){ 					
	 					if(args.success)
	 						args.success(data, status, xhr);
	 					console.log(data,status,xhr);
	 				},
	 				error: function(request,status,error){
	 					if(args.error)
	 						args.error(request,status,error);
	 				},
	 				complete: function(a,b,c){
	 					if(args.complete)
	 						args.complete(a,b,c);
	 					console.log(a,b,c);
	 				}
	 			});
	 		}
 		}


 		
 			
 		
	});
 		
})();		

	