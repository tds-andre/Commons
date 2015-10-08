/**
 * Created by andre.santos on 28/07/2014.
 
 depends on:
 jquery.js
 tds.web.client.utils.js
 array.extension.js
 js-lambda.js
 
 
 
 
 
 */
 function Spinner(div,imgURL){
	var Self = this;
	this.div = div;
	this.url = imgURL;
	
	//var imgHtml = "<div id='_Spinner' class='Spinner' style='display:none; width:100%;height:100%; position:absolute;z-index:100000;left:0;top:0;background-color:white;opacity:0.5;'><img src=''/></div>";
    var imgHtml = "<div id='_Spinner' class='Spinner' style='display:none; position:absolute;z-index:100000;left:0;top:0;background-color:white;opacity:0.5;'><img src=''/></div>";
	
	
	this.spin = function(){
		var h = $(Self.div).height();
		var w = $(Self.div).width();
		var size = h > w ? w/3:h/3;
		var html = imgHtml.replace("src=''", "src='"+Self.url+"'");
		$(Self.div).append(html);
        var $SpinnerDiv = $("#_Spinner",Self.div);
        $SpinnerDiv.prop("id",Self.div.id+"-spinner");
        $SpinnerDiv.css("width",$(Self.div).width());
        $SpinnerDiv.css("height",$(Self.div).height());
        $SpinnerDiv.css("left",$(Self.div).position().left);
        $SpinnerDiv.css("top",$(Self.div).position().top);
		$img = $("div.Spinner > img",div);
		$img.css("height",size);
		$img.css("width",size);
		$img.css("display","block");		
		$img.css("position", "absolute");
		$img.css("left", w/2 - size/2);
		$img.css("top", h/2 - size/2);
		
		$("div.Spinner",Self.div).css("display","block");
		
	}
	this.stop = function(){
		$("div.Spinner",Self.div).remove();
	}
}
Spinner.prototype.fuck ="";
 
 
function Container(context,id,className,initiateHidden){
    //Variables
    var Self = this;
    this.ID = context ? $(context).prop("id") : null;
    this.Dom = context;    
    this.EventManager = new EventManagerPlugin(Self);
    this.ClassName = className || "ct";
    this.$Templates = {};
    this.$Content = {};
    
    //Methods    this.show = function(){

    this.g$ = function(name, $ctx){
    	if(isDefined($ctx))
    		return $(Self.gS(name),$ctx);
    	else
    		return $(Self.gS(name),Self.$Content);
    }
    this.gS = function(name){
    	return ".ct-" + Self.ClassName + "-" + name;
    }
    this.gData = function(owner,dataName){
    	var name = "ct-" + Self.ClassName + "-" + dataName;
    	if(typeof owner === "string")
    		owner = Self.g$(owner);
    	return owner.data(name);
    }
    this.sData = function(owner,dataName,value){
    	var name = "ct-" + Self.ClassName + "-" + dataName;
    	if(typeof owner === "string")
    		owner = Self.g$(owner);    		
    	owner.data(name,value);
    	return owner;
    }
    
    this.show = function(){
        $(Self.Dom).show("slow");
    }
    this.hide = function(){
        $(Self.Dom).hide("slow");
    }
    this.setID = function(value){
        Self.ID = value;
        $(Self.Dom).prop("id", value);
    }
    this.setCaption = function(newCaption){
        $("#caption",Self.Dom).html(newCaption);
    }
    this.IsWaiting = false;
    this.wait= function(){
        if(Self.IsWaiting) return;
		spinner.url = Container.prototype.SpinnerURL;
		spinner.spin();
        Self.IsWaiting = true;
    }
    this.go = function(){
		spinner.stop();
        Self.IsWaiting = false;
    }
    this.disable = function(){
        $("*", Self.Dom).prop("disabled",true);
    }
    this.enable =function(){
        $("*", Self.Dom).prop("disabled",false);
    }

 
	
	this.getTemplate = function(name){
		return $(Self.gS(name), Self.$Templates).clone();
	}
    
    
    

    //Contructor
    if(id)
        this.setID(id);
    if(initiateHidden==undefined)
        initiateHidden = false;
    if(initiateHidden)
        this.hide();
    else
        this.show();
    this.$Templates = $(this.gS("templates"), this.Dom);
    this.$Content = $(this.gS("content"), this.Dom);
		
	var spinner = new Spinner(this.Dom);

}

Container.prototype.SpinnerURL = $('script[src*="/container.js"]').prop('src');
Container.prototype.SpinnerURL = Container.prototype.SpinnerURL.substring(0,Container.prototype.SpinnerURL.indexOf("container.js")) + 'spinner.gif';

$(document).ready(function(){
	$(".ct-templates").css("display", "none");	
});



function ContainerTemplate(context,id) {
    //Inherit-----------------------------------------------------------//	
    Container.call(this, context,id, "template");
    var Self = this;
    //Internal Fields---------------------------------------------------//
    //Internal Methods--------------------------------------------------//
    //Public Methods----------------------------------------------------//
    //Public Callbacks--------------------------------------------------//
    //Constructor-------------------------------------------------------//
}
ContainerTemplate.prototype = Object.create(Container.prototype);
ContainerTemplate.prototype.constructor = ContainerTemplate;