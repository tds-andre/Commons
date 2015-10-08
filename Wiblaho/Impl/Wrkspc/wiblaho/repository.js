Wiblaho.Repository = function(model,serverUrl){
	var Self = this;
	this.model = model;
	this.serverUrl = serverUrl || Wiblaho.Repository.DefaultServerUrl;
	this.save = function(instance, args){
		var async = args.async || true;
		$.ajax({
			url: serverUrl + "/" + model.name,
			type: "POST",
			contentType: "application/json",
			data

		})
	}
}

Wiblaho.Repository.DefaultServerUrl = window.location.origin + ":" + window.location.port;