var Wiblaho = {}

//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
// SPINNER
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

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

//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
// HELPERS
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//


function isFunction( fn ) {
    return typeof fn === 'function';
}

function isNumber( obj ) {
    return typeof obj === "number" || obj instanceof Number;
}

function isAssigned( pt ){
    return !( (typeof obj === "undefined") || (obj===null) ) ;
}

function isDefined(obj){
    return !( (typeof obj === "undefined") || (obj===null) ) ;
}


//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
// EVENT PLUGIN
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//


function EventManagerPlugin(owner){
    var Self = this;
    var Owner = owner;
    var EventHandlers = {};
    Owner.on=function(eventName, eventHandler){
        if(typeof EventHandlers[eventName] === "undefined")
            EventHandlers[eventName] = [];
        EventHandlers[eventName].push(eventHandler);        
    };
    
    Owner.trigger = function(eventName, eventObject){
        if(isDefined(eventObject)) eventObject.owner = Owner;
        if(!(typeof EventHandlers[eventName] === "undefined")){
            for(var i = 0; i<EventHandlers[eventName].length; i++)
                setTimeout(EventHandlers[eventName][i](eventObject),null, 0);
        }
    };
    
    Owner.raise = function(eventName, eventObject){Owner.trigger(eventName,eventObject);};
    
}


//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
// ARRAY EXTENSION
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//


Array.prototype.skip = function( number ) {

    if( arguments.length === 0 ) throw "skip method needs an argument of number";

    if( number && isNumber(number)) {
        number = number > this.length ? this.length : number;

        var arr = [];
        for(var i=number; i<this.length; i++) {
            arr.push( this[i] );
        }

        return arr;
    }

}




Array.prototype.where = function( selector ) {
    var arr = [], i;
    if( selector && isFunction(selector)) {
        for(i=0; i<this.length; i++) {
            if( selector(this[i])) {
                arr.push(this[i]);
            }
        }

        return arr;
    } else {
        for(i=0; i<this.length; i++ ) {
            if( this[i] == selector ) {
                arr.push(this[i]);
            }
        }

        return arr;
    }
};

Array.prototype.take = function( number ) {

    if( arguments.length === 0 ) throw "take method needs an argument of number";

    if( number && isNumber(number)) {
        number = number > this.length ? this.length : number;

        var arr = [];
        for(var i=0; i<number; i++) {
            arr.push( this[i] );
        }

        return arr;
    }
};


Array.prototype.first = function( predicate )
{
    if ( predicate && isFunction(predicate)) {

        for(var i=0;i<this.length;i++) {
            if(predicate(this[i])) return this[i];
        }

        throw _MESSAGE_OF_NULL_REFERENCES("no predicate")
    }
    else {
        var ret = this.length > 0 ? this[0] : null;
        if( ret === null ) throw _MESSAGE_OF_NULL_REFERENCES("ret");

        return ret;
    }
};

Array.prototype.select = function( selector ) {
    if( selector && isFunction(selector)) {
        var arr = [];
        for(var i=0; i<this.length; i++) {
            arr.push( selector(this[i]) );
        }

        return arr;
    }
    else {
    }
};



//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
// LAMBDA
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//



;(function() {
    ;"use strict";

    function INHERITANCE(CLASS, PARENT) {
        for(var p in PARENT) if(PARENT.hasOwnProperty(p)) CLASS[p] = PARENT[p];

        var PROXY                   = function() { };
        PROXY.prototype             = PARENT.prototype;
        CLASS.prototype             = new PROXY();
        CLASS.prototype.constructor = CLASS;
    }

    function FUNC( args ) {

        var index = arguments.length - 1;

        return new Function([].slice.call(arguments, 0, index), arguments[index]);

    }



    function IQueryContext() {
        return (function() {
            IQueryContext.prototype.result = function() { throw "not implementation exception" };
        })();
    }

    INHERITANCE(IQueryContext, QueryContext);
    function QueryContext( expression ) {

        IQueryContext.apply(this, arguments);

        QueryContext.prototype.result = function() {

            var value = new LambdaExpression(expression);
            return value.execute(expression);

        }
    }

    function Expression( expression ) {
        this.expression = expression;
        this.body       = "";
        this.params     = [];
    }

    Expression.Lambda = function( expressionBody, expressionParams ) {
    };


    var LambdaExpression = (function(_base) { INHERITANCE(LambdaExpression, _base);
        function LambdaExpression( expression ) {
            _base.apply(this, arguments);

            var self    = this,
                arr     = getLambdaExpressionObject(self.expression),
                arrvar  = arr[0].split(","),
                body    = arr[1],
                params  = [];

            self.body   = body;
            for(var i=0; i<arrvar.length; i++) this.params.push( new ParameterExpression(arrvar[i]) );

            DEBUG(self);
        }

        function getLambdaExpressionObject( expressionString ) {
            expressionString = expressionString || "";

            var regex = /[\(^\)]?([\w,\s]*)[\)^\(]?\s=>\s([\{^\}]?.*[^;^\}][;\s\}^\{]?)/gi;
            var match = regex.exec(expressionString);
            if( match == null ) throw "It's correct expression string that " + expressionString;

            DEBUG("getLambdaExpressionObject.match: " + match);

            return match.slice(1, 3);
        }

        LambdaExpression.prototype.exec = function() {
        };

        return LambdaExpression;

    })(Expression);

    var ParameterExpression = (function(_base) { INHERITANCE(ParameterExpression, _base);
        function ParameterExpression(parameterName) {
            _base.apply(this, arguments);

            this.name = parameterName;
            DEBUG("ParameterExpression.act Set: " + this.name);
        }

        ParameterExpression.prototype.name = "";

        return ParameterExpression;
    })(Expression);


    F = function( expressionString ) {
        expressionString = expressionString || "";
        
        var expression  = new LambdaExpression(expressionString),
            param       = [],
            body        = expression.body;

        for(var i=0; i<expression.params.length; i++) param.push(expression.params[i].name);

        if( body[0] == '{') {
            body = "return (function() {" + body + "})();";
        } else {
            body = "return (function() { return (" + body + "); })();";
        }

        DEBUG("LambdaExpression.prototype.exec.param: " + param);
        DEBUG("LambdaExpression.prototype.exec.body : " + body);

        return new Function(param, body);
    }

})();




//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
// SOFT STRING SEARCH + LEV
//---------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//

function searchString(str, searchIn, ids, threshold ){
    
    
    var results = [];
    var exp1 = str.split(" ");

    for(var i = 0; i < searchIn.length; i++){
        var exp2 = searchIn[i].split(" ");
        var lsum = 0;
        for(var x = 0; x < exp1.length; x++){
            var lmin = 99999;
            for(var y = 0; y < exp2.length; y++){
                l = new Levenshtein(exp1[x], exp2[y]);
                if(l.distance < lmin)
                    lmin = l.distance;
            }
            lsum += lmin;
        }
        var lavg = lsum/exp1.length;
        if(lavg<=threshold){            
            for(var j = 0; j < results.length; j++)
                if(lavg < results[j].l)
                    break;
            results.splice(j,0,{l:lavg,id:ids[i],s:searchIn[i]});
        }
    }
    
    var result = [];
    for(var i = 0; i < results.length ; i++){
        result.push(results[i].id);
    }
    return result;

}




(function(root, factory){
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(function(){
      return factory(root);
    });
  } else if (typeof module == 'object' && module && module.exports) {
    module.exports = factory(root);
  } else {
    root.Levenshtein = factory(root);
  }
}(this, function(root){

  function forEach( array, fn ) { var i, length
    i = -1
    length = array.length
    while ( ++i < length )
      fn( array[ i ], i, array )
  }

  function map( array, fn ) { var result
    result = Array( array.length )
    forEach( array, function ( val, i, array ) {
      result[i] = fn( val, i, array )
    })
    return result
  }

  function reduce( array, fn, accumulator ) {
    forEach( array, function( val, i, array ) {
      accumulator = fn( val, i, array )
    })
    return accumulator
  }

  // Levenshtein distance
  function Levenshtein( str_m, str_n ) { var previous, current, matrix
    // Constructor
    matrix = this._matrix = []

    // Sanity checks
    if ( str_m == str_n )
      return this.distance = 0
    else if ( str_m == '' )
      return this.distance = str_n.length
    else if ( str_n == '' )
      return this.distance = str_m.length
    else {
      // Danger Will Robinson
      previous = [ 0 ]
      forEach( str_m, function( v, i ) { i++, previous[ i ] = i } )

      matrix[0] = previous
      forEach( str_n, function( n_val, n_idx ) {
        current = [ ++n_idx ]
        forEach( str_m, function( m_val, m_idx ) {
          m_idx++
          if ( str_m.charAt( m_idx - 1 ) == str_n.charAt( n_idx - 1 ) )
            current[ m_idx ] = previous[ m_idx - 1 ]
          else
            current[ m_idx ] = Math.min
              ( previous[ m_idx ]     + 1   // Deletion
              , current[  m_idx - 1 ] + 1   // Insertion
              , previous[ m_idx - 1 ] + 1   // Subtraction
              )
        })
        previous = current
        matrix[ matrix.length ] = previous
      })

      return this.distance = current[ current.length - 1 ]
    }
  }

  Levenshtein.prototype.toString = Levenshtein.prototype.inspect = function inspect ( no_print ) { var matrix, max, buff, sep, rows
    matrix = this.getMatrix()
    max = reduce( matrix,function( m, o ) {
      return Math.max( m, reduce( o, Math.max, 0 ) )
    }, 0 )
    buff = Array( ( max + '' ).length ).join( ' ' )

    sep = []
    while ( sep.length < (matrix[0] && matrix[0].length || 0) )
      sep[ sep.length ] = Array( buff.length + 1 ).join( '-' )
    sep = sep.join( '-+' ) + '-'

    rows = map( matrix, function( row ) { var cells
      cells = map( row, function( cell ) {
        return ( buff + cell ).slice( - buff.length )
      })
      return cells.join( ' |' ) + ' '
    })

    return rows.join( "\n" + sep + "\n" )
  }

  Levenshtein.prototype.getMatrix = function () {
    return this._matrix.slice()
  }

  Levenshtein.prototype.valueOf = function() {
    return this.distance
  }

  return Levenshtein

}));
