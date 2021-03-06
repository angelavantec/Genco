angular.module('app_editor', ['ngResource','editor.services','lang.services'])

.controller('ctrl_editor', function($scope, $http, componente_env, componente, plantillas, plantillas_comp, template, lang) {

//editors = [];
$scope.environment_selected = $("#key_module").val();
console.log($scope.environment_selected);
$scope.components = [];


$scope.itr_plantillas=0;
$scope.treeModel = [];
$scope.nodeComponente=[];
$scope.component_selected = {
    id: null,
    nombre: null,
};

$scope.template_selected = {
    id: null,
    nombre: null,
};

$scope.GencoPlantillas;
$scope.GencoComponentes;

$scope.langs = [];
$scope.langs=lang.query();

$scope.dataLang = {
    repeatSelectLang: null,
    availableOptions: $scope.langs,
};




$("#jstreeFolders").jstree({
    "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      
                      if (more) {
                            if (more.is_multi) {
                                more.origin.settings.dnd.always_copy = true;
                            } else {
                                more.origin.settings.dnd.always_copy = false;
                            }
                        }

                        var validator;

                        if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
                            return false;
                        }
                            
                        //console.log(node_parent);
                        var renderas = node_parent.li_attr['data-renderas'];

                        if(typeof renderas == 'undefined'){
                            return false;
                        }
                      
                        validator = renderas === 'component' ? true : false;    
                        if(validator && operation == 'move_node'){

                            validator = node.li_attr['data-renderas'] === 'archive' ? true : false; 

                        }   
                        return validator;
                        
                    }
            },
    "types": {
            "file" : {
                "icon" : "glyphicon glyphicon-file"
            },
            "default" : {
                "icon" : "glyphicon glyphicon-folder-open"
            }

    },        
    "crrm": {
        "move": {
            "always_copy": true
        }
    },
    "plugins" : [ "contextmenu", "dnd", "types", "crrm" ],
                "contextmenu": {
                "items": function ($node) {

                    console.log($node.li_attr['data-renderas'] );

                    if($node.li_attr['data-renderas'] === 'archive')
                        return {

                            "Rename": {
                                "label": "Select Entity",
                                "action": function (data) {
                                   // this.rename(obj);
                                    console.log(data);
                                    
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //inst.edit(obj);
                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;
                                    console.log($scope.component_selected);
                                    $scope.load_component(obj.id);
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    angular.element($("#ctrl_editor")).scope().$apply();
                                    $('#component-edit-modal').modal('show');
        
                                }
                            },

                        };
                    else{


                        var tmp = $.jstree.defaults.contextmenu.items();
                            delete tmp.create.action;
                            tmp.create.label = "New";
                            tmp.create.submenu = {
                                "create_folder" : {
                                    "separator_after"   : true,
                                    "label"             : "Folder",
                                    "action"            : function (data) {
                                        var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                        inst.create_node(obj, { type : "default" }, "last", function (new_node) {
                                            setTimeout(function () { inst.edit(new_node); },0);
                                        });
                                    }
                                },
                                "create_file" : {
                                    "label"             : "File",
                                    "action"            : function (data) {
                                        var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                        inst.create_node(obj, { type : "file" }, "last", function (new_node) {
                                            setTimeout(function () { inst.edit(new_node); },0);
                                        });
                                    }
                                }
                            };
                            if(this.get_type($node) === "file") {
                                delete tmp.create;
                            }
                            return tmp;
                            // var tree = $("#jstreeFolders").jstree(true);

                            //     return {
                            //         "Create": {
                            //             "separator_before": false,
                            //             "separator_after": false,
                            //             "label": "Create",
                            //             "action": function (obj) {          
                            //                 console.log('node');
                            //                 console.log($node);                                        
                            //                 $node = tree.create_node($node);                                            
                            //                 tree.edit($node);
                            //             }
                            //         },
                            //         "Rename": {
                            //             "separator_before": false,
                            //             "separator_after": false,
                            //             "label": "Rename",
                            //             "action": function (obj) { 
                            //                 tree.edit($node);
                            //             }
                            //         },                         
                            //         "Remove": {
                            //             "separator_before": false,
                            //             "separator_after": false,
                            //             "label": "Remove",
                            //             "action": function (obj) { 
                            //                 tree.delete_node($node);
                            //             }
                            //         }
                            //     };
                    }    

                }
            }

  });
 $('#jstreeFolders').jstree(true).settings.core.data = [
            {'id' : 'root',
                'text' : '/',
                'icon' : 'glyphicon glyphicon-folder-open',
                'li_attr':{'data-renderas':'component'}
            },
            // {
            //     'id' : 'node_2',
            //     'text' : 'Root node with options',
            //     'icon' : 'glyphicon glyphicon-folder-open',
            //     'state' : { 'opened' : false, 'selected' : true },
            //     'li_attr':{'data-renderas':'archive'},
            //     'children' : [ { 'text' : 'Child 1' }, 'Child 2']
            // },
            // {
            //     'id' : 'node_3',
            //     'text' : 'Root node with options',
            //     'icon' : 'glyphicon glyphicon-folder-open',
            //     'state' : { 'opened' : false, 'selected' : true },
            //     'children' : [ { 'text' : 'Child 1' }, 'Child 2']
            // }

         ];

        
$('#jstreeFolders').jstree(true).refresh();


$('#jstreeBuilds').jstree();
 $('#jstreeBuilds').jstree(true).settings.core.data = [
            {'id' : 'root',
                'text' : '/',
                'icon' : 'glyphicon glyphicon-folder-open',
                'li_attr':{'data-renderas':'component'}
            },

         ];
$('#jstreeBuilds').jstree(true).refresh();


console.log($scope.dataLang);

$scope.printTree = function(){
    console.log('arbol');
    //console.log($('#jstreeBuilds'));
    var v = $('#jstreeFolders').jstree(true).get_json('#', {flat:true})
    var mytext = JSON.stringify(v);
    console.log(mytext);
}


$scope.load_components = function(){
    $scope.components = [];
    $scope.components = componente_env.query({id_entorno:$scope.environment_selected}, function(success){
                            console.log('success');
                            console.log(success);
                            $scope.createTreeModel(); 
                            
                        },function(error){
                            console.log('ERR');
                            console.log(error);  
        });
}

$scope.createTreeModel = function(){
    
   console.log('init');
    $scope.nodeComponente=[];
    proccess = [];
    angular.forEach($scope.components, function(value, key){

        console.log(value);

        proccess.push(1);
        plantillas_comp.query({id:value.id_componente}, function(success){
            proccess.pop();
            add_templates(proccess, value, success);
        },function(error){
            proccess.pop();
            add_templates(proccess, value, null);  
        });

    })

}


function add_templates(proccess, componente, plantillas){
    
    var nodePlantillas=[];
    
    if(plantillas != null){

        angular.forEach(plantillas, function(value, key){    
            nodePlantillas.push({'parent': componente.id_componente, 'text':value.nombre + '<sub style="color:#CCCCCC">'  + value.lang.nombre + '</sub>', 'icon':"glyphicon glyphicon-file", 'li_attr':{'data-renderas':'archive', 'data-renderid': value.id_plantilla, 'data-rendername': value.nombre}});
        });
        $scope.nodeComponente.push({'id': componente.id_componente,'text':componente.nombre, 'icon':"glyphicon glyphicon-folder-open", 'children':nodePlantillas, 'li_attr':{'data-renderas':'component','data-renderid': componente.id_componente, 'data-rendername': componente.nombre}});

    }

    //Render -> Wait
    if(proccess.length<=0){
        $("#jstree").jstree('destroy');
        $scope.load();
        $('#jstree').jstree(true).settings.core.data = $scope.nodeComponente;
        $('#jstree').jstree(true).refresh();
    }

    

}



$scope.reload_tree = function(){
    console.log('push');

    $scope.createTreeModel();
    $scope.load();
 

}


console.log($scope.components);


        
        $scope.tabs = [];
        // $scope.isTabSelected=false;
        $scope.current_template;




        $scope.load = function(){

            $("#jstree").jstree({
                "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      
                        
                        var validator;

                        if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
                            return false;
                        }
                            

                      
                        console.log(operation);
                        if(operation == 'move_node' || operation == 'copy_node'){

                            validator = false; 

                        }   
                        return validator;
                        
                    }
            },
            "crrm": { "move": { "always_copy": "multitree" } },
            "plugins" : [ "dnd","sort", "crrm" ],
            }).bind("copy_node.jstree", function(e, data) {
                console.log("Drop node " + data.node.id + " to " + data.parent);
            });


            //$.jstree.defaults.core.dblclick_toggle = false;
            //$("#jstree").jstree.defaults.dnd.always_copy = true;




        }

        $scope.new_component = function(){

            $scope.GencoComponentes = new componente();
            console.log($scope.GencoComponentes);
            $scope.GencoComponentes.id_entorno = ""+$scope.environment_selected;
            console.log('new comp');
            $('#component-create-modal').modal('show');

      
        }

        $scope.save_component = function(){

            console.log($scope.GencoComponentes);
            $scope.GencoComponentes.$save(function(){   
                $scope.load_components();      
                $('#component-create-modal').modal('hide')
            });
            
        } 

        $scope.delete_component = function(){

            componente.delete({id: $scope.component_selected.id},function(success){
                console.log(success);           
                $scope.load_components();
                $('#component-delete-modal').modal('hide');
            },function(error){
                
                console.log(error);
            });
            
        } 


        $scope.update_component = function(){

            $scope.GencoComponentes.$update(function(){
            $scope.load_components(); 
            $('#component-edit-modal').modal('hide');
        });
            
        } 

        $scope.load_component = function(id_component){

            console.log(id_component);
            var data = componente.get({id:id_component});
            $scope.GencoComponentes = data;
        }

        $scope.new_template = function(id_componente){

            $scope.GencoPlantillas= new plantillas();
            console.log($scope.GencoPlantillas);
            $scope.GencoPlantillas.id_componente = id_componente;
            console.log('new');

      
        }

        $scope.save_template = function(){

            console.log($scope.GencoPlantillas);
            $scope.GencoPlantillas.id_lenguaje = $scope.dataLang.repeatSelectLang;
            $scope.GencoPlantillas.$save(function(){   
                $scope.reload_tree();      
                $('#template-create-modal').modal('hide')
            });
            
        } 

        $scope.load_template = function(id_template){

            var data = plantillas.get({id:id_template});
            $scope.GencoPlantillas = data;
            data.$promise.then(function(data){
                console.log(data.id_lenguaje);
                $scope.dataLang.repeatSelectLang = data.id_lenguaje.toString();        
                $scope.GencoPlantillas.id_lenguajeprocesador = data.id_lenguajeprocesador.toString();
        });
        } 

        $scope.update_template = function(){
            $scope.GencoPlantillas.$update(function(){
                $scope.reload_tree();      
                $('#template-edit-modal').modal('hide')
            });

        }

        $scope.delete_template = function(){

            plantillas.delete({id: $scope.template_selected.id},function(success){
                console.log(success);
                $scope.reload_tree();
                $('#template-delete-modal').modal('hide');
            },function(error){
                console.log(error);
            });
            
        } 

        $scope.cancel = function(){
            $scope.GencoEntorno = $scope.tmpGencoEntorno;
            $('#template-create-modal').modal('hide');
            $('#template-preview-modal').modal('hide');
            $('#component-create-modal').modal('hide');
            $('#component-edit-modal').modal('hide');
            $('#template-edit-modal').modal('hide');
            $('#template-delete-modal').modal('hide');
            $('#component-delete-modal').modal('hide');            
        } 

        //$scope.counter = 1;
        /** Function to add a new tab **/
        $scope.addTab = function(id_template, name){
            console.log('desde arbol ' + id_template);
            
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf(id_template);

            if(pos>=0){
                $scope.selectedTab=pos;
                $scope.selectTab(id_template, pos);
                return;
            }
            

            var data;


            template.get({id_plantilla:id_template}, function(success){
                                    console.log('success');
                                    console.log(success);
                                    data = success;// success callback
                                    console.log(data);
                                    // templateObj = data.templateObj[0];
                                    // $scope.tabs.push({id_plantilla:id_template, nombre: $scope.plantillas[pos].nombre ,content: data});
                                    $scope.tabs.push({id_plantilla:id_template, nombre: data.templateName ,content: data.fileContent});
                                    console.log('select');
                                    $scope.selectedTab = $scope.tabs.length - 1; //set the newly added tab active. 
                                    $scope.selectTab(id_template, $scope.selectedTab);
                                },function(error){
                                    console.log('ERR');
                                    console.log(error);  
            });


        }
        
        /** Function to delete a tab **/
        $scope.deleteTab = function(index){
            // $scope.isTabSelected=true;
            $scope.tabs.splice(index,1);
            var index = $scope.tabs.length; 
            if(index==0){
                 //remove the object from the array based on index
                editor.setValue('');    
            }else{
                $scope.selectedTab = index - 1;
                $scope.selectTab($scope.tabs[index-1].id_plantilla, $scope.selectedTab);    
            }
            
            
        }
        
        $scope.selectedTab = 0; //set selected tab to the 1st by default.
        
        /** Function to set selectedTab **/
        $scope.selectTab = function(id_template, pos){
            
            editor.setValue($scope.tabs[pos].content);
            editor.setTheme("ace/theme/eclipse");
            editor.getSession().setMode("ace/mode/python");
            $scope.current_template = id_template;

            if(!$scope.$$phase) {
                $scope.$apply();
            }

        }


        $scope.submit = function() {

            var content = editor.getValue();

            /*Actualizo el contenido en memoria antes de hacer el request por si hay un cambio de tab no se va a perder
            el contenido ni haya necesidad de hacer otra peticion al API Rest*/
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf($scope.current_template);
            $scope.tabs[pos].content=content;
 
            var templ = new template({editor: content});
            templ.$save({id_plantilla:$scope.current_template})

            console.log('post editor');
            console.log(editor.getValue());
        };




        $scope.preview = function() {

            var content = editor.getValue();
            editor_preview.setValue('');

            var templ = new template({editor: content});
            templ.$update({id_plantilla:$scope.current_template}, function(success){
                                    data = success;// success callback
                                    console.log(data);
                                    editor_preview.setValue(data.fileContent);
                                    $('#template-preview-modal').modal('show');  
                                },function(error){
                                    console.log('ERR');
                                    console.log(error);  
            })


        };


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


        $scope.load_components();

  });

angular.module('app_editor').config(function($httpProvider){

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

})

angular.module('app_editor').directive('emitLastRepeaterElement', function($timeout) {
 var itr_plantillas = 0;   

    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) { 

                if(attr['renderas'] == 'archive'){
 
                    $timeout(function () {
                        scope.load();
                    });

                }

                if(attr['renderas'] == 'component'){
                   console.log('termino component'); 
                }
              
            }
        }

  };   


});