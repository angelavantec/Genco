/**
 * 
 */



angular.module('builds.services',[]).factory('directorio',function($resource){
// return $resource('http://127.0.0.1:8000/gencoui/repositorio/:id_repositorio\\/',{id_repositorio:'@id_repositorio'},{
return $resource('http://127.0.0.1:8000/gencoui/directorio/:id_directorio\\/',{id_directorio:'@id_directorio'},{
    update: {
        method: 'PUT'
    },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/directorio\\/',
        method: 'POST'
    },    
    query: {
        isArray:true    
    }, 

  });

}).factory('directorioelemento',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/directorioelemento/:id\\/',{id:'@id_direlemento'},{
    update: {
            //url: 'http://127.0.0.1:9000/demo/movies/:id\\/',
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/directorioelemento\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/directorioelemento\\/',   
        isArray:true    
    },
  });

}).factory('dir_tmpl_tree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/dir_tmpl_tree/:id',{id:'@id'},{
    update: {
            method: 'PUT'
        },
    query: {
        isArray:true    
    }, 
  });

}).factory('dir_item_tree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/dir_item_tree/:id_direlemento/:id_repositorio',{id_direlemento:'@id_direlemento',id_repositorio:'@id_repositorio'},{
    update: {
            method: 'PUT'
        },
    query: {
        isArray:true    
    }, 
  });

}).factory('repotree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/repotree/:id',{id:'@id'},{
    update: {
            method: 'PUT'
        },
    query: {
        isArray:true    
    }, 
  });

}).factory('archivo',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/archivo/:id\\/',{id:'@id'},{
    update: {
        method: 'PUT'
    },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/archivo\\/',
        method: 'POST',
         headers: {
                "Content-Type": "multipart/form-data;"
            }
    },    
    query: {
        isArray:true    
    }, 

  });

}).factory('plantillaentidad',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/plantillaentidad/:id\\/',{id:'@id_elementoentidad'},{
    update: {
            method: 'PUT'
        },
    save: {
        url: 'http://127.0.0.1:8000/gencoui/plantillaentidad\\/',
        method: 'POST'
    },    
    query: {
        url: 'http://127.0.0.1:8000/gencoui/plantillaentidad\\/',   
        isArray:true    
    },

  });

}).factory('fulltree',function($resource){

return $resource('http://127.0.0.1:8000/gencoui/build_tmpl_tree\\/',{
    update: {
            method: 'PUT'
        },
    query: {
        isArray:true    
    }, 
  });

})
// .factory('buildproject',function($resource){

// return $resource('http://127.0.0.1:8000/gencoui/buildproject/:id_project/:id_repository',{id_project:'@id_elementoentidad',id_repository:'@id_repository'},{
// });

// })
.service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
}).service('fileUpload', ['$http', function ($http) {
    this.saveFileToUrl = function(file, gencoArchivos, obj, data, callback){
        console.log('form data');
        var fd = new FormData();
        fd.append('upload', file);
        fd.append('nombre', gencoArchivos.nombre);
        fd.append('descripcion', gencoArchivos.descripcion);
        uploadUrl = "http://127.0.0.1:8000/gencoui/archivo/";


            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(success){

            var newNode = {
                                'id': 'f'+success.id_archivo, 
                                'parent': data.id, 
                                'text': success.nombre + '<sub style="color:#CCCCCC">file</sub>', 'icon':"glyphicon glyphicon-file", 
                                'li_attr':{
                                            'data-renderas':"file", 
                                            'data-renderid': success.id_archivo,
                                            'data-renderiddirtemplate': 'f', 
                                            'data-rendername': success.nombre
                                        }
                            }


                callback(obj.id, null, success.id_archivo, data, newNode);
        
            })
            .error(function(error){
                //callback();
               // return false;
    
            });
  


    }

    this.updateFileToUrl = function(file, gencoArchivos, obj, data, callback){
        console.log('form data');
        var fd = new FormData();
        fd.append('upload', file);
        fd.append('nombre', gencoArchivos.nombre);
        fd.append('descripcion', gencoArchivos.descripcion);
        uploadUrl = "http://127.0.0.1:8000/gencoui/archivo/" + gencoArchivos.id_archivo + "/";


            $http.put(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(success){
                console.log('ok:');
                console.log(success);
                callback(data, success.nombre + '<sub style="color:#CCCCCC">file</sub>');
        
            })
            .error(function(error){
                console.log(error);
            });
  


    }
}]).service('buildproject', ['$http', function ($http) {
    this.getBuild = function(id_project, id_repository, name, callback, callback2){

  
        $http({
            url: 'http://127.0.0.1:8000/gencoui/buildproject/'+id_project+'/'+id_repository,
            method: "GET",
            headers: {
               'Content-type': 'application/json'
            },
          responseType: "arraybuffer"
        }).success(function (data, status, headers, config) {
            //console.log(data);
            var file = new Blob([data], { type: 'application/binary' });
            var fileURL = URL.createObjectURL(file);
            //console.log(fileURL);
            //window.open(fileURL);
            var link=document.createElement('a');
            link.href=fileURL;
            link.download=name+".zip";
            //link.click();
            console.log('link');
            //console.log(link);
            //return link;
            callback('The project was build successfully <a href="'+link+'" download="' + name +'.zip">Download</a>', typeInfo);
            //window.open(objectUrl);
        }).error(function (data, status, headers, config) {
            console.log(error);
            callback(callback2(error), typeError);
        });


    }
}])
;