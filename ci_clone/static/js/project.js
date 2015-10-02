app = {};
$(function() {

	/* inserta el contenido html del modal al final del cuerpo del documento, solo a los modals que no contengan la clase default-modal */
    $(".modal:not('.default-modal')").appendTo("body");
    
	/* Popover */
    $('[data-toggle="popover"]').popover();
    
    /* select 2 a elementos select que no tengan la clase default-select */
    $( "select:not(.default-select)" ).select2();
    
    $( document ).ajaxComplete(function(){
        $("select:not(.default-select)").select2();
    });

    /* Agrega tooltip de bootstrap a los elementos con clase ttip */
    $("body").on('mouseenter', '.ttip', function(){
        $(this).tooltip({
            show    : true,
            container : 'body'
        });
    });
		
	/*Suma 10 px al modal backdrop para modals que abren otros modals */	
    $(document).on('show.bs.modal', '.modal', function () {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
	/* pone el foco a los campos de texto incluidos en un modal que tengan la clase autofocus */
    $(document).on('shown.bs.modal', '.modal', function () {
        $(this).find('.autofocus').focus().select();
    });
    
	/*Plugin para hacer scroll hacia un elemento de la pagina */
    $.fn.scrollTo = function( target, options, callback ){
        if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
        var settings = $.extend({
              scrollTarget  : target,
              offsetTop     : 120,
              duration      : 1000,
              easing        : 'swing'
        }, options);
        return this.each(function(){
              var scrollPane = $(this);
              var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
              var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - settings.offsetTop;
              scrollPane.animate({scrollTop : scrollY }, settings.duration, settings.easing, function(){
                if (typeof callback == 'function') { callback.call(this); }
              });
        });
      };
     
	/* Utilidad para eliminar una clase de un elemento jquery segun un patron o expresion regular
	ej: $element.removeClassRegex(/^col-/);
	*/	
    $.fn.removeClassRegex = function(regex) {
            return $(this).removeClass(function(index, classes) {
                return classes.split(/\s+/).filter(function(c) {
                    return regex.test(c);
                }).join(' ');
            });
        };
   
});

//
// $('#element').donetyping(callback[, timeout=1000])
// Fires callback when a user has finished typing. This is determined by the time elapsed
// since the last keystroke and timeout parameter or the blur event--whichever comes first.
//   @callback: function to be called when even triggers
//   @timeout:  (default=1000) timeout, in ms, to to wait before triggering event if not
//              caused by blur.
// Requires jQuery 1.7+
//
(function($){
    $.fn.extend({
        donetyping: function(callback,timeout){
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function(el){
                    if (!timeoutReference) return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function(i,el){
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.is(':input') && $el.on('keyup keypress',function(e){
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too premptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.type=='keyup' && e.keyCode!=8) return;
                    
                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference) clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function(){
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur',function(){
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);

(function(g){
    var delayRuns = {};
    var allFuncs = {};

    g.delayRun = function(id, func, delay){
        if(delay == undefined) delay = 200;
        if(delayRuns[id] != null){
            clearTimeout(delayRuns[id]);
            delete delayRuns[id];
            delete allFuncs[id];
        }
        allFuncs[id] = func;
        delayRuns[id] = setTimeout(function(){
            func();
            delete allFuncs[id];
            delete delayRuns[id];
        }, delay);
    };

    g.delayRun.flush = function(){
        for(var i in delayRuns){
            if(delayRuns.hasOwnProperty(i)){
                clearTimeout(delayRuns[i]);
                allFuncs[i]();
                delete delayRuns[i];
                delete allFuncs[i];
            }
        }
    };
})(window);

// Place any jQuery/helper plugins in here.

/*
Inicializacion del plugin noty para notificaciones y mensajes en pantalla.
Permite desde cualquier javascript de nuestra app hacer lo siguiente:
ej: msg.ok('Este es un mensaje de ok');
    msg.info('Este es un mensaje de informacion');
	msg.error('Este es un mensaje de error');
*/
msg = {
	ok : function( msg ){
            return noty({
//                "theme": "bootstrapTheme",
                "text": msg,
                "timeout" : 5000,
                "layout":"topRight",
                "type":"success"
            });
	},
	error : function( msg ){
            return noty({
//                "theme": "bootstrapTheme",
                "text": msg,
                "timeout" : 5000,
                "layout":"topRight",
                "type":"error"
            });
	},
	info : function( msg ){
            return noty({
//                "theme": "bootstrapTheme",
                "text": msg,
                "timeout" : 5000,
                "layout":"topRight",
                "type":"information"
            });
	}
}

/*Utilidad para generar un número unico */
function uniqId() {
  return Math.round(new Date().getTime() + (Math.random() * 100));
}

/*
Utilidad para realizar validaciones a campos de formularios 
Los tipos definidos se encuentran bajo la variable validationAllRules
*/
function validate(tipo, text){
    var pattern = new RegExp(validationAllRules[tipo].regex);
    if (!pattern.test(text)){
        return false;
    }
    return true;
}

validationAllRules = {
    "phone": {
        // credit: jquery.h5validate.js / orefalo
        "regex": /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
        "alertText": "* Número de teléfono inválido"
    },
    "email": {
        // Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
        "regex": /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
        "alertText": "* Correo inválido"
    },
    "integer": {
        "regex": /^[\-\+]?\d+$/,
        "alertText": "* No es un valor entero válido"
    },
    "number": {
        "regex": /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
        "alertText": "* No es un valor decimal válido"
    },
    "date": {
        "regex": /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
        "alertText": "* Fecha inválida, por favor utilize el formato DD/MM/AAAA"
    },
    "ipv4": {
            "regex": /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
        "alertText": "* Direccion IP inválida"
    },
    "url": {
        "regex": /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
        "alertText": "* URL Inválida"
    },
    "onlyNumberSp": {
        "regex": /^[0-9\ ]+$/,
        "alertText": "* Sólo números"
    },
    "onlyLetterSp": {
        "regex": /^[a-zA-Z\ \']+$/,
        "alertText": "* Sólo letras"
    },
    "onlyLetterNumber": {
        "regex": /^[0-9a-zA-Z]+$/,
        "alertText": "* No se permiten caracteres especiales"
    }
};

/* Slugiffy a string */
function sluggify(val){
    return val.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9-]/g, '');
}

/* Utlidad para testear si una variable js está definida */
function isset() {
  var a = arguments,
    l = a.length,
    i = 0,
    undef;

  if (l === 0) {
    throw new Error('Empty isset');
  }

  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false;
    }
    i++;
  }
  return true;
}

/* Encode a string into a json */
function encodeJSON(json) {
        var local = window.JSON || {};
        return (local.stringify || stringify)(json);

        function stringify (h) {
                var D=[], i=0, k, v, t // k = key, v = value
                ,	a = $.isArray(h)
                ;
                for (k in h) {
                        v = h[k];
                        t = typeof v;
                        if (t == 'string')		// STRING - add quotes
                                v = '"'+ v +'"';
                        else if (t == 'object')	// SUB-KEY - recurse into it
                                v = parse(v);
                        D[i++] = (!a ? '"'+ k +'":' : '') + v;
                }
                return (a ? '[' : '{') + D.join(',') + (a ? ']' : '}');
        };
}