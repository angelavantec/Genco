angular.module('app_lang', ['ngResource','lang.services'])

.controller('ctrl_lang', function($scope, lang, lang_tipodato, conversion, langs_tree, langs_tree_view, searchLangs, cloneLang, genco_tipodato) {
    $scope.key_lang = $("#key_lang").val();
    $scope.idGencolang = 1;
    $scope.langs = [];

    $scope.types = [];
    $scope.types_types = [];

    $scope.data = {
    repeatSelect: null,
    };

    $scope.selectedCnv = [];
    $scope.Conversions = [];


    $scope.conversionsObj = [];

    $scope.language_selected = {
        id: null,
        nombre: null,
    }


    /*Instancia del arbol de la seccion de ENTITIES*/
    /*IMPORTANTE*/
    /* Para que el arbol permita manipular(create, rename, delete) los nodos check_callback debe ser true*/
    $('#jstree').jstree({        
        'core':{check_callback : true, dblclick_toggle : false},
        "plugins" : [ "sort"],
    }).bind("dblclick.jstree", function(e) {

        var tree = $(this).jstree(); 
        var obj = tree.get_node(e.target); 

        console.log(obj.li_attr['data-renderas']);
        
        if(obj.li_attr['data-renderas']!='language'){
            return;
        }
        $scope.language_selected.id = obj.li_attr['data-renderid']; 
        $scope.language_selected.nombre = obj.li_attr['data-rendername']; 
        $scope.load_lang($scope.language_selected.id);
            
        // var nodeParent = tree.get_node(''+obj.parent)
        // var renderId = nodeParent.li_attr['data-renderid'];
        // $scope.elementoentidad_selected = {id:renderId, nombre_padre:nodeParent.li_attr['data-rendername'], tag: obj.li_attr['data-renderid']};                               
        // angular.element($("#ctrl_editor")).scope().$apply();
        // $('#template-entities-tag-modal').modal('show');

    });


    conversionObj = function(id_tipodato, id_tipodato_cnv, id_conversion){
        this.id_tipodato = id_tipodato;
        this.id_tipodato_cnv = id_tipodato_cnv;
        this.id_conversion = id_conversion;
    };


    /* Ya construidos los arboles cargo los items de directorio elemento*/
    $scope.getLangTree = function(){
    langs_tree_view.get({id_lenguaje: $scope.key_lang}, function(success){
                            
                            console.log('success');    
                            $('#jstree').jstree();
                            $('#jstree').jstree(true).settings.core.data = success.dirs;
                            $('#jstree').jstree(true).refresh();
                                                        
                        },function(error){                        
                            console.log('ERR');
                            console.log(error);  
                        });
    }


    $scope.load_lang = function(id_lang){
        $scope.data.repeatSelect = id_lang;
        //$scope.data.availableOptions =  $scope.lang_selected; //lang.query();
        $scope.types_types = [];
        $scope.Conversions = [];
 
    
        genco_tipodato.query(function(success){
            $scope.types = success;
            $scope.getTypesCombos(id_lang);
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });
        

    } 










    $scope.getTypesCombos = function(id_lang){
        var id_lang_cnv = $scope.data.repeatSelect;
        console.log('lenguje conversion '+id_lang_cnv+" lenguaje origen " + $scope.idGencolang);
        //$scope.Conversions = [];
        lang_tipodato.query({id:id_lang}, function(success){
            $scope.types_types = success;
            
            conversion.query({id_tipodato__id_lenguaje:$scope.idGencolang, id_tipodato_cnv__id_lenguaje:id_lang},
                function(success){
                    $scope.selectedCnv = success;
                    load_types();
                }, function(error){
                    $scope.showMessage($scope.getDataError(error));
            });

        }, function(error){
                $scope.showMessage($scope.getDataError(error));
        });

    }



    function load_types(){
        var tmpConversions = [];
        var tmpConversionsObj = [];
        var tmpConvObj = null;

        angular.forEach($scope.types, function(value, key){

            $scope.selectedCnv.$promise.then(function (data) {

                //console.log(data.map(function(x) {return x.id_tipodato}).indexOf(value.id_tipodato));

                pos = data.map(function(x) {return x.id_tipodato}).indexOf(value.id_tipodato);


                if(pos>=0) {
                    tmpConversions.push(data[pos].id_tipodato_cnv); 
                    tmpConvObj = new conversionObj(data[pos].id_tipodato, data[pos].id_tipodato_cnv, data[pos].id_conversion);            
                    tmpConversionsObj.push(tmpConvObj);
                    
                }else{
                    // $scope.Conversions.push("");                     
                    tmpConversions.push(null);
                    tmpConversionsObj.push(new conversionObj(value.id_tipodato,null,null));                     
                }

            })
        

        });
        
        console.log('1 trmina carga conversiones ');
        $scope.Conversions = tmpConversions;
        $scope.conversionsObj = tmpConversionsObj;

    }



    function conversion_validator(proccess, id_lang, callback){

        //Render -> Wait
        if(proccess.length<=0){
            console.log('reload');
            callback(id_lang);
        }
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

    //$httpProvider.defaults.headers.common['Cookie'] = 'sessionid=oczdutsobiqkrrtccvn8p5rlcwxoe7n9; csrftoken=h7v1ZIKZcshdiNUcdd5e3LBPIEUXjCfO'//'csrftoken='+getCookie('csrftoken');

    // $httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

})
