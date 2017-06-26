angular.module('app_env', ['ngResource','env.services','lang.services'])

.controller('ctrl_env', function($scope, env_lang, env, lang, icons, env_projects, $window) {

    $scope.langIconos =  icons.get({id:'env'});
    $scope.iconSelected;
    $scope.langs = [];
    $scope.envs=env.query(
                    function(success){
                        //if($scope.envs.length>0){
                        //    $scope.selectedTab = 0;
                        //    $scope.load_env($scope.envs[0].id_entorno);
                        //}    
                    },function(error){
                        $scope.showMessage($scope.getDataError(error));  
    });
    $scope.GencoEntorno = new env();
    $scope.tmpGencoEntorno;
    $scope.descripcion = '';
    $scope.nombre = '';
    $scope.id_grupo = '';
    $scope.icono = '';
    $scope.wdnMode=0; /* 1=save, 2=update*/
    $scope.ConfirmDeleteCallback = null;
    $scope.envProjects = null;

    $scope.all_langs=lang.query();
   
    $scope.load_env = function(id_env){
        
        var data = env.get({id:id_env});       
        
        data.$promise.then(function(data){
            $scope.GencoEntorno = data;
            $scope.descripcion = data.descripcion;
            $scope.nombre = data.nombre;
            // $scope.id_grupo = data.id_grupo;
            $scope.icono = data.icon.upload;            
            $scope.tmpGencoEntorno =  $scope.GencoEntorno;
            $scope.langs=env_lang.get({id:id_env});
            $('#dropEnvOptions').attr('disabled', false);

            //$('#lnkToEditorFull').attr('href', 'module/editor/' + id_env);
                //$('#lnkToBuildsFull').attr('href', 'module/builds/' + id_env);

        });
    } 

    $scope.chooseBuild = function(){

        env_projects.get({id_env:$scope.GencoEntorno.id_entorno}, 
        function(success){
            $scope.envProjects = success;
            $('#choose-build-modal').modal('show');
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });

    }


    $scope.goEditor = function(){
        console.log('goEditor')
        if ($scope.langs.length > 0 ) {           
            $window.location.href = 'module/editor/' + $scope.GencoEntorno.id_entorno;
        }else{
            $scope.showMessage('There isn\'t a language for this environment');
        }
    }


    $scope.saveOrUpdate = function(){
        var mode = $scope.wdnMode;
        if(mode==1){
            $scope.save();
        }else if(mode==2){
            $scope.update();
        }
        
    } 


    $scope.save = function(){
        $scope.GencoEntorno.$save(function(success){   
            $scope.envs=env.query();
            $('#env-modal').modal('hide')
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });
        
    } 

    $scope.update = function(){
        

        $scope.GencoEntorno.$update(function(success){
            $scope.envs=env.query();         
            $scope.load_env($scope.GencoEntorno.id_entorno);       
            $('#env-modal').modal('hide')
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });
        //$scope.envs=env.query();
        
        //$scope.load_env($scope.GencoEntorno.id_entorno);
    }

    $scope.delete = function(){
        $scope.GencoEntorno.$delete(function(success){   
            $scope.envs=env.query();
            $scope.descripcion = '';
            $scope.nombre = '';
            $scope.id_grupo = '';
            $scope.icono = '';
        },function(error){
            $scope.showMessage($scope.getDataError(error));
        });
        
    }

    $scope.cancel = function(){
        $scope.GencoEntorno = $scope.tmpGencoEntorno;
        $('#env-modal').modal('hide');
        $('#lang-add-modal').modal('hide');
    } 
 

    $scope.new = function(){
        $scope.wdnMode = 1;
        $scope.tmpGencoEntorno =  $scope.GencoEntorno;        
        $scope.GencoEntorno = new env();
        //$scope.GencoEntorno.id_grupo = $scope.tmpGencoEntorno.id_grupo.toString();
        

        $('#env-modal').modal('show').on('shown.bs.modal', function() {
                    $('#id_nombre').focus();
        });
        
        // $('#env-add-modal').on('shown.bs.modal', function () {
        //   $('#id_nombre').focus();
        // });

        // new Promise(
        //     function(resolve, reject) {
        //         $('#env-add-modal').modal('show').on('shown', function() {
        //             $('#id_nombre').focus();
        //         });
        //         console.log('resolve');
        //         resolve('ok');
        //         //setInterval(function(){ resolve('ok'); }, 1000);
                
        //     }
        // ).then (function (resolve) {
        //     console.log('focus ' + resolve );
        //     $('#id_nombre').focus();
        // });
    }

    $scope.edit = function(){
        $scope.wdnMode = 2;
        $scope.tmpGencoEntorno =  $scope.GencoEntorno;
        //$scope.GencoEntorno.id_grupo = $scope.GencoEntorno.id_grupo.toString();
        $scope.setEnvIcon($scope.GencoEntorno.icon);
        $('#env-modal').modal('show').on('shown.bs.modal', function() {
                    $('#id_nombre').focus();
        });
    }

    $scope.remove = function(){
        $scope.showConfirmDelete('Do you really want to delete ' + $scope.GencoEntorno.nombre + ' environment');
        $scope.ConfirmDeleteCallback = function(){$scope.delete()};
    }





    $scope.all_lang_init = function(){
        //console.log($scope.all_langs.map(function(x){return false;}));
        $scope.lang_added=$scope.all_langs.map(
            function(x){
                var resp = false;
                angular.forEach($scope.langs, function(value, key){    
                    console.log(value.id_lenguaje);
                    console.log(x.id_lenguaje);
                    if(value.id_lenguaje==x.id_lenguaje){
                       resp = true; 
                       return;
                    }
                       
                });
                return resp;
            });
        console.log($scope.lang_added);
        //console.log($scope.langs.find(findLang));
        //angular.forEach($scope.langs, function(value, key){    
        //        console.log(key + ' - ' + value);
        //});
    }


    $scope.save_add_lang = function(){
        
        console.log($scope.lang_added);

        index = 0;
        //total = $scope.lang_added.length;
        proccess = [];
        var findFlag=0;

        /**@Generics
        * lang_added es el arrglo que se pinta y que corresponde al mismo array all_langs. Se usa lang_added para determinar cual esta seleccionado y con el index de los
        * seleccionados vamos al array base(all_langs[])
        **/
        angular.forEach($scope.lang_added, function(value, key){
            findFlag=0;

            angular.forEach($scope.langs, function(v, k){    
                    if(v.id_lenguaje==$scope.all_langs[key].id_lenguaje){
                       console.log('encontrado'); 
                       console.log($scope.langs[k]);
                       findFlag = parseInt($scope.langs[k].id_entornolenguaje);

                       return;
                    }    
            });

            if(value){

                if(findFlag==0){
                    console.log($scope.all_langs[key]);
                    //send_add_lang($scope.all_langs[key].id_lenguaje,'POST', index, total, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    proccess.push(1);
                    conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
                    console.log(conv);
                    conv.$save(
                        function(success){
                        //$scope.showMessage($scope.getDataError(error));
                        proccess.pop();
                        add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                        },function(error){
                        $scope.showMessage($scope.getDataError(error)); 
                        proccess.pop();
                        add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);  
                    });
                }
                     
            }else if(findFlag>0){
                //console.log('DEL');
                //send_add_lang(null,'NA', index, total, null, $scope.load_env);
                proccess.push(1);
                conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
                conv.$delete({id: findFlag},
                    function(success){
                        //$scope.showMessage($scope.getDataError(error));
                        proccess.pop();
                        add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    },function(error){
                        $scope.showMessage($scope.getDataError(error));
                        proccess.pop();  
                        add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                });
            }    
               

            index++;

        })

        
    }


    function add_lang_validator(proccess, id_env, callback){
        
        console.log("longitud " +proccess.length);
        //setTimeout(function() { }, 5000);

        if(proccess.length<=0){
            console.log('reload');
            callback(id_env);
            $('#lang-add-modal').modal('hide');

        }

    }

    $scope.setEnvIcon = function (icon) {
        $scope.GencoEntorno.id_icono = icon.id_icono;
        console.log(icon);
        $('#imgEnvIconAdd').attr('src',icon.upload);
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

  });

angular.module('app_env').config(function($httpProvider){

    // $stateProvider.state('env-add',{
    //     url:'/movies',
    //     templateUrl:'http://localhost:8000/gencoui/form/1',
    //     controller:'MovieListController'
    // }).state('viewMovie',{
    //    url:'/movies/:id/view',
    //    templateUrl:'partials/movie-view.html',
    //    controller:'MovieViewController'
    // }).state('newMovie',{
    //     url:'/movies/new',
    //     // templateUrl:'partials/movie-add.html',
    //     templateUrl:'http://localhost:8000/gencoui/form/1',
    //     controller:'MovieCreateController'
    // }).state('editMovie',{
    //     url:'/movies/:id/edit',
    //     templateUrl:'partials/movie-edit.html',
    //     controller:'MovieEditController'
    // });
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.post['X-CSRFToken'] = getCookie('csrftoken');

    // $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    // $httpProvider.defaults.withCredentials = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

})

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