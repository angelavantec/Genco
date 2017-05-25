/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('lang.services',[]).factory('lang_tipodato',function($resource){

//return $resource('http://127.0.0.1:8000/gencoui/tipodatos/?id_tipodato=:id_tipodato',{id_tipodato:'@id_tipodato'},{
return $resource('http://127.0.0.1:8000/gencoui/tipodatos/:id_tipodato\\/',{id_tipodato:'@id_tipodato'},{
    update: {
        //url: 'http://127.0.0.1:8000/gencoui/tipodatos/:id_tipodato\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/tipodatos\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/tipodatos/?id_lang=:id',   
        isArray:true    
    }, 
    // get: {
    //     'http://127.0.0.1:8000/gencoui/tipodatos/:id_tipodato\\/',
    //     isArray:false
    // }, 
  });

}).factory('genco_tipodato',function($resource){
return $resource('http://127.0.0.1:8000/gencoui/gencodatatype\\/',{
    query: { 
        isArray:true    
    }, 
    get: {
        isArray:true    
    }, 
  });

}).factory('lang',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/langs/:id_lenguaje\\/',{id_lenguaje:'@id_lenguaje'},{
    update: {
           //url: 'http://127.0.0.1:8000/gencoui/langs\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/langs\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/langs\\/',   
        isArray:true    
    }, 
    // get: {
    //     url: 'http://127.0.0.1:8000/gencoui/langs\\/',   
    //     //isArray:true    
    // }, 
  });

}).factory('conversion',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/conversiontipodatos/:id\\/',{id:'@id_conversion'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/conversiontipodatos\\/',
        method: 'POST'
    },    
    query: {
        // url: 'http://127.0.0.1:8000/gencoui/conversiontipodatos/?id_tipodato__id_lenguaje=:id_conversion',   
        url: 'http://127.0.0.1:8000/gencoui/conversiontipodatos/?',
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });


}).factory('searchLangs',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/searchlangs/:keysearch/:page',{keysearch:'@keysearch', page:'@page'},{ 
    query: {   
        isArray:true    
    }, 
    get: {
        isArray:false    
    }, 
  });

}).factory('cloneLang',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/clonelang\\/',{
    save: {        
        method: 'POST'
    }, 
  });

}).factory('langs_tree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/langs_tree\\/',{
    query: {
        isArray:true    
    }, 
  });

}).factory('langs_tree_view',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/langs_tree_view/:id_lenguaje\\/',{id_lenguaje: '@id_lenguaje'},{
    query: {
        isArray:true    
    }, 
  });

}).factory('lang_tipodato_view',function($resource){

//return $resource('http://127.0.0.1:8000/gencoui/tipodatos/?id_tipodato=:id_tipodato',{id_tipodato:'@id_tipodato'},{
return $resource('http://127.0.0.1:8000/gencoui/tipodatos_view/:id_tipodato\\/',{id_tipodato:'@id_tipodato'},{
    query: {
        url: 'http://127.0.0.1:8000/gencoui/tipodatos/?id_lang=:id',   
        isArray:true    
    }, 
    // get: {
    //     'http://127.0.0.1:8000/gencoui/tipodatos/:id_tipodato\\/',
    //     isArray:false
    // }, 
  });

}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
})
;


