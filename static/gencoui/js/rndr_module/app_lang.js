angular.module('app_lang', ['ngResource','lang.services'])

.controller('ctrl_lang', function($scope, lang, lang_tipodato, conversion, langs_tree, searchLangs, cloneLang, genco_tipodato) {
    $scope.idGencolang = 1;
    $scope.langs = [];

    $scope.pageFoundLangs = {}
    $scope.langsToClone = []

    $scope.types = [];
    $scope.types_types = [];

    $scope.data = {
    repeatSelect: null,
    availableOptions: null,
    };

    $scope.datad = [];
    $scope.selectedCnv = [];
    $scope.Conversions = [];

    convArr = [];
    conversionArr = [];

    $scope.GencoTipodato;

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
        "plugins" : [ "sort", "dnd" ],
        // "contextmenu": {
        //         "items": function ($node) {

        //             console.log($node.li_attr['data-renderas'] );

        //             if($node.li_attr['data-renderas'] === 'template')
        //                 return {

        //                     "Rename": {
        //                         "label": "Change Entity",
        //                         "action": function (data) {

        //                             var inst = $.jstree.reference(data.reference),
        //                             obj = inst.get_node(data.reference);
        //                             var renderId = obj.li_attr['data-renderid'];                                    
        //                             $scope.elementoentidad_selected = {id:renderId, nombre:obj.li_attr['data-rendername']};    
        //                             $scope.node_item_selected = obj;                            
                                    
        //                             //cargar combobox entidades
        //                             //$scope.template_entities_load(renderId);
        //                             angular.element($("#ctrl_editor")).scope().$apply();
        //                             $('#template-entities-modal').modal('show');
                                    
        
        //                         }
        //                     },
        //                     "Delete": {
        //                         "label": "Detach Entity",
        //                         "action": function (data) {
                                    
        //                             var inst = $.jstree.reference(data.reference),
        //                             obj = inst.get_node(data.reference);
        //                             $scope.node_item_selected = obj;
        //                             $scope.showConfirmDelete("Do you really want to detach " + obj['text'] + " Link?");
        //                             $scope.ConfirmDeleteCallback = function(){$scope.delete_elementoentidad(obj.li_attr['data-renderid'], obj)};
        //                             //borrar direlementoentidad   
        //                             //$scope.delete_directorioelemento(obj.li_attr['data-renderiddirtemplate'], obj);
        //                             //$scope.delete_elementoentidad(obj.li_attr['data-renderid'], obj);
        
        //                         }
        //                     },

        //                 };
        //             else{

        //                 return {
        //                     "Rename": {
        //                         "label": "Change Entity",
        //                         "action": function (data) {

        //                             var inst = $.jstree.reference(data.reference),
        //                             obj = inst.get_node(data.reference);

        //                             var nodeParent = $('#jstreeBuilds').jstree(true).get_node(''+obj.parent)
        //                             var renderId = nodeParent.li_attr['data-renderid'];
        //                             $scope.elementoentidad_selected = {id:renderId, nombre_padre:nodeParent.li_attr['data-rendername'], tag: obj.li_attr['data-renderid']};    
        //                             $scope.node_item_selected = obj;                            
        //                             angular.element($("#ctrl_editor")).scope().$apply();
        //                             $('#template-entities-tag-modal').modal('show');
        
        //                         }
        //                     },
                        
   
        //                 }
        //             }    

        //         }
        // }
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
        // $scope.node_item_selected = obj;                            
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
    langs_tree.get({}, function(success){
                            
                            console.log('success');    
                            $('#jstree').jstree();
                            $('#jstree').jstree(true).settings.core.data = success.dirs;
                            $('#jstree').jstree(true).refresh();
                                                        
                        },function(error){                        
                            console.log('ERR');
                            console.log(error);  
                        });

        //$scope.langs=lang.get({});
        lang.get({}, function(success){
            console.log(success);
        }, function(error){
            console.log(error);
        });
    }


    $scope.load_lang = function(id_lang){
        $scope.data.repeatSelect = id_lang;
        $scope.data.availableOptions =  $scope.lang_selected; //lang.query();
        $scope.types_types = [];
        $scope.Conversions = [];
 
        // lang_tipodato.query({id:$scope.idGencolang}, function(success){
        //     $scope.types = success;
        //     $scope.getTypesCombos(id_lang);
        // }, function(error){
        //     $scope.showMessage($scope.getDataError(error));
        // });

        genco_tipodato.query(function(success){
            $scope.types = success;
            $scope.getTypesCombos(id_lang);
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });
        
        //$scope.lang_selected = $scope.langs[$scope.langs.map(function(x) {return x.id_lenguaje}).indexOf(id_lang)].nombre;

  //       var data = lang.get({id:id_lang});
  //       $scope.GencoEntorno = data;
  //       data.$promise.then(function(data){
  //           $scope.descripcion = data.descripcion;
  //       });

  //       $scope.tmpGencoEntorno =  $scope.GencoEntorno;
		// $scope.langs=env_lang.get({id:id_lang});

    } 


    $scope.new_type = function(id_lang){

        $scope.GencoTipodato= new lang_tipodato();
        $scope.GencoTipodato.id_lenguaje = $scope.language_selected.id;
        console.log('new');

  
    } 

    $scope.edit_type = function(index){

        console.log($scope.types[index].id_tipodato);
        $scope.GencoTipodato= $scope.types[index];
        $scope.GencoTipodato.id_lenguaje = $scope.GencoTipodato.id_lenguaje.toString();
        // console.log($scope.GencoTipodato);
        // $scope.GencoTipodato.id_lenguaje = ""+id_lang;
        // console.log('new');

  
    } 


    $scope.save_type = function(){


        console.log($scope.GencoTipodato);
        $scope.GencoTipodato.$save(function(success){   
            $scope.load_lang($scope.GencoTipodato.id_lenguaje);       
            //$scope.new_type($scope.GencoTipodato.id_lenguaje);
            $('#type-add-modal').modal('hide')
        },function(error){
                $scope.showMessage($scope.getDataError(error));

        });
        
    } 

    $scope.update_type = function(){
        console.log($scope.GencoTipodato);
        $scope.GencoTipodato.$update(function(){
            $scope.load_lang($scope.GencoTipodato.id_lenguaje);       
            $('#type-edit-modal').modal('hide')
        });

    }


    $scope.print = function(message){
       // $scope.lang-selected = lang_selected
        console.log('data ' + message);
        //$scope.types_types=lang_tipodato.query({id:$scope.data.repeatSelect});

    }

    $scope.cancel = function(){
        $('#type-add-modal').modal('hide');
        $('#type-edit-modal').modal('hide');
        $('#lang-add-modal').modal('hide');
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
                    // $scope.Conversions.push(conversionArr[pos]); 
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


    $scope.new_lang = function(id_lang){

        $scope.GencoLenguajes= new lang();
        console.log($scope.GencoLenguajes);
        $('#lang-modal').modal('show').on('shown.bs.modal', function() {
                $('#lang-modal #id_nombre').focus();
        });
  
    } 

    $scope.save_lang = function(){


        console.log($scope.GencoLenguajes);
        $scope.GencoLenguajes.$save(function(success){   
            var nodeDef = {'id': success.id_lenguaje, 
              'parent': '#', 
              'text': success.nombre, 
              'icon':"glyphicon glyphicon-folder-open", 
              'li_attr':{'data-renderas':"language",
                          'data-renderid': success.id_lenguaje, 
                          'data-rendername':success.nombre
                      }
            }
            $scope.addTreeNode($('#jstree').jstree(true).get_node('#'), nodeDef, $('#jstree').jstree(true));
            $('#lang-modal').modal('hide')
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });
        
    } 


 


    $scope.save_conversion = function(id_lang){

        console.log($scope.Conversions);
        console.log($scope.conversionsObj);
        save_conversion_validator(id_lang, $scope.getTypesCombos );
                             
    }


    function save_conversion_validator(id_lang, callback){

        index = 0;
        proccess = [];

        angular.forEach($scope.types, function(value, key){

            if($scope.Conversions[index]!=null){

                if($scope.conversionsObj[index].id_conversion!=null){

                    if($scope.conversionsObj[index].id_tipodato_cnv!=$scope.Conversions[index]){
                      //  console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> PUT " + $scope.conversionsObj[index].id_conversion);                        
                      //  send_conversion(value,'PUT', index, total, id_lang, callback);  
                        proccess.push(1);
                        conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index], id_conversion: $scope.conversionsObj[index].id_conversion});
                        conv.$update(
                            function(success){
                                console.log('OK');
                                console.log(success); //wait_conversion();
                                proccess.pop();
                                conversion_validator(proccess, id_lang, callback);
                            },function(error){
                                console.log('ERR');
                                console.log(error);
                                proccess.pop();
                                conversion_validator(proccess, id_lang, callback);   
                        });
                        
                    }    
                }else{
                    //console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> POST ");
                    //send_conversion(value,'POST', index, total, id_lang, callback);
                    proccess.push(1);
                    conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index]});
                    conv.$save(
                        function(success){
                        console.log('OK');
                        console.log(success); //wait_conversion();
                        proccess.pop();
                        conversion_validator(proccess, id_lang, callback);
                        },function(error){
                        console.log('ERR');
                        console.log(error);  
                        proccess.pop();  
                        conversion_validator(proccess, id_lang, callback);
                    });  

                }

                
            
            }else{

                 if ($scope.conversionsObj[index].id_conversion != null) {
                    //console.log( value.id_tipodato + " conv to  " + $scope.Conversions[index] + " -> DEL " + $scope.conversionsObj[index].id_conversion);    
                    //send_conversion(value,'DEL', index, total, id_lang, callback);
                    proccess.push(1);
                    conv = new conversion({id_tipodato: value.id_tipodato, id_tipodato_cnv: $scope.Conversions[index], id_conversion: $scope.conversionsObj[index].id_conversion});
                    conv.$delete(
                        function(success){
                            console.log('OK');
                            console.log(success); //wait_conversion();
                            proccess.pop();
                            conversion_validator(proccess, id_lang, callback);
                        },function(error){
                            console.log('ERR');
                            console.log(error); 
                            proccess.pop();
                            conversion_validator(proccess, id_lang, callback);   
                    });

                }
                

            }


            index++;

    })

    console.log('termina save ');

    //callback(3);

    };


    $scope.renameTreeNode = function(node, newText){
        $('#jstree').jstree('set_text', node, newText); 
    }

    $scope.addTreeNode = function(node, newNode, jsTree){
        jsTree.create_node(node.id,newNode);                    
    }

    $scope.showMessage = function(message){
        $('#imConfirm').html(message);
        $('#info-modal').modal('show');

    }

    function conversion_validator(proccess, id_lang, callback){

        //Render -> Wait
        if(proccess.length<=0){
            console.log('reload');
            callback(id_lang);
        }
    }


    $scope.searchLang =  function(pagenum){
        var searchKey = $('#findLangKey').val();
        console.log(searchKey);

        if(searchKey.trim().length==0 || searchKey.trim()=='' || searchKey==undefined || searchKey==null){
            $scope.showMessage('Invalid text for search');
            return;
        }

        // var sl = new searchLangs({keysearch: searchKey, page:1})
        // console.log(sl);
        searchLangs.get({keysearch: searchKey, page:pagenum}, function(success){
            console.log(success.langs);
            $scope.setChecktoSearchLangs(success.langs);          
            $scope.pageFoundLangs = success;
            //console.log('expand');
            
        }, function(error){
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


    $scope.save_clone_lang = function(){

        if($scope.langsToClone.length<=0){
            $scope.showMessage('Please select a Lanaguage for clone');
            return;
        }

        var cloneLangs = '[' + $scope.langsToClone.map(function(x) {return x.id_lenguaje}).toString() + ']'
        console.log(cloneLangs);

        clone = new cloneLang({langs: cloneLangs});
        clone.$save(function(success){
            console.log(success);
            $scope.langsToClone = [];
            $scope.pageFoundLangs = {};
            $scope.getLangTree();
            $('#lang-clone-modal').modal('hide')
        }, function(error){
            $scope.showMessage($scope.getDataError(error));
        });
         
    }

    $scope.addToCloneLangs = function(index){
        var pos=0;
        //console.log('index ' + index);
        //console.log($scope.langsToClone.map(function(x) {return x.id_lenguaje}));

        pos = $scope.langsToClone.map(function(x) {return x.id_lenguaje}).indexOf($scope.pageFoundLangs.langs[index].id_lenguaje);

        //console.log('pos ' + pos);

        if(pos>=0) {
            $scope.langsToClone.splice(pos,1);
        }else{
            $scope.langsToClone.push($scope.pageFoundLangs.langs[index]);
        } 

        // angular.forEach($scope.langsToClone, function(value, key){
        //     console.log(value.nombre);
        // });

        console.log($scope.langsToClone);
         
    }


    $scope.setChecktoSearchLangs = function(langs){
        var pos=0;

        angular.forEach($scope.langsToClone, function(value, key){

            pos = langs.map(function(x) {return x.id_lenguaje}).indexOf(value.id_lenguaje);

            if(pos>=0) {
                (langs[pos])['checked']=true;
            }    
            // }else{
            //     ($scope.pageFoundLangs.langs[pos])['checked']=false;
            // }  
        
        });

        return langs;
  
         
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