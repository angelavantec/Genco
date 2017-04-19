angular.module('app_env', ['ngResource','env.services','lang.services'])

.controller('ctrl_env', function($scope, env_lang, env, lang, icons) {

    $scope.langIconos =  icons.get({id:'env'});
    $scope.iconSelected;
    $scope.langs = [];
    $scope.envs=env.query(
                    function(success){
                        if($scope.envs.length>0){
                            $scope.selectedTab = 0;
                            $scope.load_env($scope.envs[0].id_entorno);
                        }    
                    },function(error){
                        console.log('ERR');
                        console.log(error);  
    });
    $scope.GencoEntorno = new env();
    $scope.tmpGencoEntorno;
    $scope.descripcion = '';
    $scope.nombre = '';
    $scope.icono = '';

    $scope.all_langs=lang.query();


   
    $scope.load_env = function(id_env){
        console.log(id_env);
        var data = env.get({id:id_env});
        $scope.GencoEntorno = data;
        data.$promise.then(function(data){
            $scope.descripcion = data.descripcion;
            $scope.nombre = data.nombre;
            $scope.icono = data.icon.upload;
        });

        $scope.tmpGencoEntorno =  $scope.GencoEntorno;
		$scope.langs=env_lang.get({id:id_env});

    } 

    $scope.save = function(){
        $scope.GencoEntorno.$save(function(){   
            $scope.envs=env.query();
            $('#env-add-modal').modal('hide')
        });
        
    } 

    $scope.update = function(){
        
        $scope.GencoEntorno.$update(function(){
            $scope.envs=env.query();         
            $scope.load_env($scope.GencoEntorno.id_entorno);       
            $('#env-edit-modal').modal('hide')
        });
        //$scope.envs=env.query();
        
        //$scope.load_env($scope.GencoEntorno.id_entorno);
    }

    $scope.cancel = function(){
        $scope.GencoEntorno = $scope.tmpGencoEntorno;
        $('#env-edit-modal').modal('hide');
        $('#env-add-modal').modal('hide');
        $('#lang-add-modal').modal('hide');
    } 
 

    $scope.new = function(){
        console.log('nevo');
        $scope.tmpGencoEntorno =  $scope.GencoEntorno;
        $scope.GencoEntorno = new env();
        
        
        new Promise(
            function(resolve, reject) {
                $('#env-add-modal').modal('show');
                console.log('resolve');
                resolve('ok');
                //setInterval(function(){ resolve('ok'); }, 1000);
                
            }
        ).then (function (resolve) {
            console.log('focus ' + resolve );
            $('#id_nombre').focus();
        });
    }

    $scope.edit = function(){
        $scope.tmpGencoEntorno =  $scope.GencoEntorno;
        $scope.GencoEntorno.id_grupo = $scope.GencoEntorno.id_grupo.toString(); 
    }



    $scope.all_lang_init = function(){
        console.log($scope.all_langs.map(function(x){return false;}));
        $scope.lang_added=$scope.all_langs.map(function(x){return false;});
    }


    $scope.save_add_lang = function(){
        
        console.log($scope.lang_added);

        index = 0;
        //total = $scope.lang_added.length;
        proccess = [];

        /**@Generics
        * lang_added es el arrglo que se pinta y que corresponde al mismo array all_langs. Se usa lang_added para determinar cual esta seleccionado y con el index de los
        * seleccionados vamos al array base(all_langs[])
        **/
        angular.forEach($scope.lang_added, function(value, key){

            if(value){
                console.log($scope.all_langs[key]);
                //send_add_lang($scope.all_langs[key].id_lenguaje,'POST', index, total, $scope.GencoEntorno.id_entorno, $scope.load_env);
                proccess.push(1);
                conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
                console.log(conv);
                conv.$save(
                    function(success){
                    console.log('OK');
                    console.log(success.data); //wait_conversion();
                    proccess.pop();
                    add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    },function(error){
                    console.log('ERR');
                    console.log(error.data); 
                    proccess.pop();
                    add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);  
                }); 
            }else{
                //console.log('DEL');
                //send_add_lang(null,'NA', index, total, null, $scope.load_env);
                proccess.push(1);
                conv = new env_lang({id_entorno: $scope.GencoEntorno.id_entorno, id_lenguaje: $scope.all_langs[key].id_lenguaje});
                conv.$delete(
                    function(success){
                        console.log('OK');
                        console.log(success); //wait_conversion();
                        proccess.pop();
                        add_lang_validator(proccess, $scope.GencoEntorno.id_entorno, $scope.load_env);
                    },function(error){
                        console.log('ERR');
                        console.log(error);  
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
        $('#imgEnvIcon').attr('src',icon.upload);
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
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

})
