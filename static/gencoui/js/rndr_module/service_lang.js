/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('lang.services',[]).factory('lang_tipodato',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/tipodatos/?id_tipodato=:id',{id:'@id'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
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
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:true    
    // }, 
  });

}).factory('lang',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/langs/:id\\/',{id:'@id_lang'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
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
    get: {
        url: 'http://127.0.0.1:8000/gencoui/langs\\/',   
        isArray:true    
    }, 
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

}).factory('langs_tree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/langs_tree\\/',{
    query: {
        isArray:true    
    }, 
  });

}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
})
;