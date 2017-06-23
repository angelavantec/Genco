angular.module('app_lang', ['ngResource','lang.services'])

.controller('ctrl_lang', function($scope, lang, lang_tipodato, conversion, langs_tree, langs_tree_view, searchLangs, cloneLang, genco_tipodato) {
    $scope.key_lang = $("#key_lang").val();
        $scope.language_selected = {
        id: null,
        nombre: null,
    }
    $scope.Conversions = [];



    /* Ya construidos los arboles cargo los items de directorio elemento*/
    $scope.getLangTree = function(){
    langs_tree_view.get({id_lenguaje: $scope.key_lang}, function(success){
                            
                            console.log('success');
                            $scope.language_selected.nombre = success.dirs[0].text; 
                            $('#jstree').jstree();
                            $('#jstree').jstree(true).settings.core.data = success.dirs;
                            $('#jstree').jstree(true).refresh();
                                                        
                        },function(error){                        
                            $scope.showMessage($scope.getDataError(error));
                        });
    }






    $scope.getDataError = function(error){
       if(error.data['detail']!=null){
        return error.data['detail'];
       } if(error.data!=null){

            var resp='';

            if (error.data instanceof Array || error.data instanceof Object) {
                angular.forEach(error.data, function(value, key){        
                    resp += key + ' - ' + value + '<br/>';
                });
            }else{

                resp = error.data;
            }
                        
            return resp;
       }
    }





    $scope.showMessage = function(message){
        $('#imConfirm').html(message);
        $('#info-modal').modal('show');

    }


    /*
    Inicializamos el UI
    */
    
    $scope.getLangTree();
    

});

angular.module('app_lang').config(function($httpProvider){
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

})
