var prjApp = angular.module('app_project', ['ngResource','env.services']);

prjApp.controller('ctrl_project', [
    '$scope', 'env_projects', 'projects', '$window',
    function($scope, env_projects, projects, $window) {

    $scope.GencoProyectos = new projects();
    $scope.wdnMode=0; /* 1=save, 2=update*/
    $scope.ConfirmDeleteCallback = null;
    $scope.envProjects = null;


    $scope.saveOrUpdate = function(){
        var mode = $scope.wdnMode;
        if(mode==1){
            $scope.save();
        }else if(mode==2){
            $scope.update();
        }
        
    } 


    $scope.create_project = function(){
        $scope.GencoProyectos = new projects();
        $('#create-project-modal').modal('show');

    }


    $scope.save_project = function(){
        project = new projects({id_entorno: $scope.GencoEntorno.id_entorno, nombre: $scope.GencoProyectos.nombre, descripcion: $scope.GencoProyectos.descripcion})

        project.$save(function(success){
            $scope.envProjects.push(success);
            $('#create-project-modal').modal('hide');

        },function(error){
            $scope.showMessage($scope.getDataError(error));
        });

    }


    $scope.showMessage = function(message){
        $('#imConfirm').html(message);
        $('#info-modal').modal('show');

    }

    $scope.showConfirmDelete = function(message){
        $('#tedmConfirm').html(message);
        $('#confirm-delete-modal').modal('show');
    }

    $scope.confirm_delete = function(){
        $scope.ConfirmDeleteCallback();
        $('#confirm-delete-modal').modal('hide');
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
                var data = JSON.stringify(error.data);
                console.log(error.data);
                console.log(data.substring(1, 10));
                console.log(data.substring(1, 6));
                
                if(data.substring(1, 10) == '<!DOCTYPE' || data.substring(1, 6) == 'html'){
                    return error.data;
                }
            }
                        
            return resp;
       }
    }

  }]);

angular.module('app_project').config(['$httpProvider', function($httpProvider){

    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie('csrftoken');

}])

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }