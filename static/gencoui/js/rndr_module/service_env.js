/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('env.services',[]).factory('env_lang',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/envlangs/?id_env=:id',{id:'@_id'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
        isArray:true    
    }, 
    get: {
        // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
        isArray:true    
    }, 
  });

}).factory('env',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/entornos/:id\\/',{id:'@id_entorno'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/entornos\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/entornos\\/',   
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });

}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});