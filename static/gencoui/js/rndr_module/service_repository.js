/**
 * Created by Sandeep on 01/06/14.
 */

angular.module('repository.services',[]).factory('repository',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/repositorio/:id_repositorio\\/',{id_repositorio:'@id_repositorio'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/repositorio\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/repositorio\\/',   
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:true    
    // }, 
  });

}).factory('entity_repo',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/entidad/:id_repositorio\\/',{id_repositorio:'@id_repositorio'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/entidad\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/entidad\\/',   
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });

}).factory('entity',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/entidad/:id_entidad\\/',{id_entidad:'@id_entidad'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/entidad\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/entidad\\/',   
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });

}).factory('entitydef',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/entidaddef/?id_entidad=:id\\/',{id:'@id'},{
    update: {
        url: 'http://127.0.0.1:8000/gencoui/entidaddef/:id\\/',
        method: 'PUT'
    },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/entidaddef\\/',
        method: 'POST'
    },    
    delete: {
        url: 'http://127.0.0.1:8000/gencoui/entidaddef/:id\\/',
        method: 'DELETE'
    },  
    query: {
        url: 'http://127.0.0.1:8000/gencoui/entidaddef\\/',   
        isArray:true    
    }, 
  });

}).factory('repo_tree',function($resource){

return $resource('http://localhost:8000/gencoui/repo_tree\\/',{
    query: {
        isArray:true    
    }, 
  });

}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});