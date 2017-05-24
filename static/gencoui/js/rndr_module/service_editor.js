/**
 * Created by Sandeep on 01/06/14.
 */



angular.module('editor.services',[]).factory('componente',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/componentes/:id\\/',{id:'@id_componente'},{
    update: {
        method: 'PUT'
    },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/componentes\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/componentes\\/',   
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:true    
    // }, 
  });

}).factory('plantillas',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/plantillas/:id\\/',{id:'@id_plantilla'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/plantillas\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/plantillas\\/',   
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });

}).factory('plantillas_comp',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/plantillas/:id_comp\\/',{id:'@id_componente'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/plantillas\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/plantillas/?id_comp=:id',  
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });

}).factory('componente_env',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/componentes/?id_env=:id_entorno',{id_entorno:'@id_entorno'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/componentes\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/componentes/?id_env=:id_entorno',   
        isArray:true    
    }, 
    get: {
        // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
        isArray:true    
    }, 
  });


}).factory('template',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/tmpl/:id_plantilla',{id_plantilla:'@id_plantilla'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/tmpl/:id_plantilla',        
        method: 'POST'
        // headers: [{'x-csrftoken':getCookie('csrftoken')}]
    },    
    update: {
        url: 'http://127.0.0.1:8000/gencoui/tmpl_preview/:id_plantilla',        
        method: 'PUT'
        // headers: [{'x-csrftoken':getCookie('csrftoken')}]
    },  
    query: {
        url: 'http://127.0.0.1:8000/gencoui/plantillas/?id_comp=:id',  
        isArray:true    
    }, 
    // get: {
    //     // url: 'http://127.0.0.1:8000/gencoui/envlangs\\/',   
    //     isArray:false    
    // }, 
  });

}).factory('tree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/cmp_tmpl_tree/:id',{id:'@id'},{
    update: {
            method: 'PUT'
        },
    query: {
        isArray:true    
    }, 
  });

}).factory('processors',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/processors\\/',{
    get: {
        isArray:true    
    }, 
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