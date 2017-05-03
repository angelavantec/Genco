angular.module('app_editor', ['ngResource','editor.services','lang.services', 'env.services'])

.controller('ctrl_editor', function($scope, $http, componente_env, componente, plantillas, plantillas_comp, template, lang, tree, env_lang, processors) {

//editors = [];
$scope.environment_selected = $("#key_module").val();
console.log($scope.environment_selected);
$scope.components = [];


$scope.itr_plantillas=0;
$scope.treeModel = [];
// $("#jstree").jstree();
$scope.nodeComponente=[];
//$scope.component_selected;
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
$scope.langs=env_lang.get({id:$("#key_module").val()}, 
    function(success){

    },function(error){
    $scope.showMessage($scope.getDataError(error));
});//lang.query();
$scope.processors;
    processors.get( 
        function(success){
            console.log('ererererer');
            console.log(success);
            $scope.processors = success.processor;
        },
        function(error){
            $scope.showMessage($scope.getDataError(error));
        });
// $scope.langs = [];
// $scope.langs=lang.query();


$scope.dataLang = {
    repeatSelectLang: null,
    availableOptions: $scope.langs,
};

$scope.tabs = [];
        // $scope.isTabSelected=false;
$scope.current_template;
$scope.current_pos=0;
$scope.current_editor=null;

editors = [];

$scope.wdnMode=0; /* 1=save, 2=update*/
$scope.node_selected;
$scope.ConfirmDeleteCallback;


$(function () {

        $(document)
            .on('dnd_move.vakata', function (e, data) {
                var t = $(data.event.target);
                var isRenderas = data.data.obj[0].getAttribute('data-renderas');                

                if(!t.closest('.jstree').length) {
                    if(t.closest('.ace_content').length) {
                        if(isRenderas == undefined || isRenderas == null || isRenderas == 'component'){
                            data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
                        }else{
                            data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');    
                        }                        
                    }
                    else {
                        data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
                    }
                }
            })
            .on('dnd_stop.vakata', function (e, data) {
                var t = $(data.event.target);
                //console.log(data.data.obj[0].getAttribute('data-renderas'));
                //$(this).attr("data-id");
                //console.log(t);

                var isRenderas = data.data.obj[0].getAttribute('data-renderas');
                if(isRenderas == undefined || isRenderas == null || isRenderas == 'component'){
                    return;
                }

                //console.log(data.data.obj[0].id);
                var node = $('#jstree').jstree(true).get_node(data.data.obj[0].id);
                var nodeParent = $('#jstree').jstree(true).get_node(node.parents[0]);
                //console.log(node);
                //console.log(nodeParent);


                if(t[0].closest('.ace_content')) {
                    //console.log('append');
                    $scope.insertKey(node, nodeParent);
                }   

            });
  });


/* Ya construidos los arboles cargo los items de directorio elemento*/
$scope.getDirTree = function(){
tree.get({id:$scope.environment_selected}, function(success){
                        
                        console.log('success');    
                        //$('#jstreeBuilds').jstree();
                        //$('#jstreeBuilds').jstree(true).settings.core.data = success.dirs;
                        //$('#jstreeBuilds').jstree(true).refresh();

                        $('#jstree').jstree();
                        $('#jstree').jstree(true).settings.core.data = success.dirs;
                        $('#jstree').jstree(true).refresh();
                                                    
                    },function(error){                        
                        $scope.showMessage($scope.getDataError(error)); 
                    });
}

            $("#jstree").jstree({
                //'core':{check_callback : true},
                "core" : {
                "check_callback" : function (operation, node, node_parent, node_position, more) {
                        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
                        // in case of 'rename_node' node_position is filled with the new node name                      
                        return false;                        

                        if(operation == 'move_node'){
                            var validator;
                            //console.log('core check');
                            //console.log(node_parent);
                            if(node_parent==null || typeof node_parent.li_attr == 'undefined'){
                                return false;
                            }
                                

                            //console.log(node_parent.li_attr['data-renderas']); 
                            //console.log(node_parent);
                            var renderas = node_parent.li_attr['data-renderas'];
                            var renderidParent = node_parent.li_attr['data-renderid'];
                            var renderid = node.li_attr['data-renderid'];
                           // console.log(renderas);
                           // console.log(node_parent);

                            if(typeof renderas == 'undefined'){
                                return false;
                            }
                           // console.log(node.data['renderas']);
                           // console.log(node_parent.data['renderas']);                       
                            validator = renderas === 'component' ? true : false;    
                            if(validator){
                                //console.log(node_parent);
                                //console.log(node);
                                validator = node.li_attr['data-renderas'] === 'template' ? true : false;
                                


                            }   
                            return validator;
                        }
                        return true;
                    }
            },
            "crrm" : { move : { check_move : function (m) { return false; } } },
            "plugins" : [  "contextmenu","dnd", "sort","crrm" ],
            "contextmenu": {
                "items": function ($node) {

                    console.log($node.li_attr['data-renderas'] );

                    if($node.li_attr['data-renderas'] === 'component')
                        return {
                            "CreateTempl": {
                                "label": "Create Template",
                                "separator_before": true,                               
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //inst.edit(obj);
                                    $scope.node_selected = obj;
                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;
                                    $scope.new_template($scope.component_selected.id);                                   
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    angular.element($("#ctrl_editor")).scope().$apply();
                                    $('#template-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#template-modal #id_nombre').focus();
                                    });
                                    //this.create(obj);
                                //     //alert('render');
                                //     //getCode();


                                }
                                
                            },

                            "Rename": {
                                "label": "Edit Component",                                
                                "action": function (data) {
                                   // this.rename(obj);
                                    console.log(data);
                                    
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    //inst.edit(obj);
                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;
                                    console.log($scope.component_selected);
                                    $scope.load_component(obj.id);
                                    //Hago que la interfaz refresque el titulo con el valor de component_selected
                                    angular.element($("#ctrl_editor")).scope().$apply();
                                    //$('#component-edit-modal').modal('show');
                                    $('#component-edit-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#component-edit-modal #id_nombre').focus();
                                    });
        
                                }
                            },
                            "Delete": {
                                "label": "Delete Component",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    //inst.edit(obj);                                    
                                    $scope.component_selected.nombre = obj.text;
                                    $scope.component_selected.id = obj.id;                                    
                                    $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> component?");
                                    $scope.ConfirmDeleteCallback = function(){$scope.delete_component()}
                                    
                                }
                            },

                        };
                    else{
                        return {

                  //           "Open": {
                  //               "label": "Open Template",
                  //               "action": function (data) {
                  //                  // this.rename(obj);
                  //                   //$('#template-edit-modal').modal('show')
                  //                   console.log('open');
                  // //                    var inst = $.jstree.reference(data.reference),
                  //                   // obj = inst.get_node(data.reference);
                  //                   // inst.edit(obj);
                  //                   // console.log(data);
                  //               }
                  //           },
                            "Rename": {
                                "label": "Edit Template",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference);
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    // var instP = $.jstree.reference(obj.parent.reference);
                                    // objP = instP.get_node(obj.parent.reference);
                                    console.log('debut');
                                    console.log(obj.parenteNode);    
                                    console.log(obj.parent);    
                                    console.log($("#"+obj.parent).attr("data-rendername"));
                                    $scope.component_selected.nombre = $("#"+obj.parent).attr("data-rendername");;
                                    $scope.component_selected.id = $("#"+obj.parent).attr("data-renderid");;
                                    $scope.template_selected.nombre = obj.li_attr['data-rendername'];
                                    $scope.template_selected.id = obj.li_attr['data-renderid'];
                                    $scope.load_template($scope.template_selected.id);
                                    //$('#template-edit-modal').modal('show');
                                    $('#template-modal').modal('show').on('shown.bs.modal', function() {
                                            $('#template-modal #id_nombre').focus();
                                    });
                                    console.log(data);
                  //                    var inst = $.jstree.reference(data.reference),
                                    // obj = inst.get_node(data.reference);
                                    // inst.edit(obj);
                                    // console.log(data);
                                }
                            },
                            "Delete": {
                                "label": "Delete Template",
                                "action": function (data) {
                                    var inst = $.jstree.reference(data.reference);
                                    obj = inst.get_node(data.reference);
                                    $scope.node_selected = obj;
                                    //inst.edit(obj);
                                    
                                    $scope.template_selected.nombre = obj.li_attr['data-rendername'];
                                    $scope.template_selected.id = obj.li_attr['data-renderid'];
                                    $scope.showConfirmDelete("Do you really want to delete <b>" + obj['text'] + "</b> template?");
                                    $scope.ConfirmDeleteCallback = function(){$scope.delete_template()}
                                    //$scope.new_template(obj.id);
                                    //angular.element($("#ctrl_editor")).scope().$apply();
                                    //$('#template-delete-modal').modal('show');
                                }
                            }
                        };
                    }

                }
            }
            }).bind("dblclick.jstree", function (event) {
                event.preventDefault();
                console.log('ress'); 
               var node = $(event.target).closest("li");
               // var data = node.data;

               var renderas =node.data("renderas");
               var id =node.data("renderid");
               // Do my action
               
                console.log(node.data("data-rendername"));
                $scope.template_selected.nombre = node.data("rendername");
                $scope.template_selected.id = id;

               if(renderas === 'template'){
                console.log(node.text()); 
                $scope.addTab(id.toString(), node.text());
               }
               
            }).bind("move_node.jstree", function(event, data) {

                console.log('move');
                var nodeParent = $(event.target).closest("li");
                var idParent =nodeParent.data("renderid");
                $scope.update_template_fromTree(data.node.li_attr['data-renderid'], idParent);
               // console.log(data.node);
                // var inst = $.jstree.reference(data.reference);
                // obj = inst.get_node(data.reference);
                // obj.text;
                // obj.id;
                // console.log(obj);
                // console.log(obj.id);

                // console.log("Drop node " + data.node.id + " to " + data.parent + " " + data.node.li_attr['data-renderid']);

               // console.log(data.parent);
                //$("#jstreeFolders").jstree(true).select_node(data.node.id);
                //$scope.new_directorioelemento(data.parent,  data.node.li_attr['data-renderid'], null, data.node, null);

                //$('#jstreeFolders').jstree(true).delete_node(data.node);
            });;


            $.jstree.defaults.core.dblclick_toggle = false;

           
   

        $scope.new_component = function(){

            $scope.GencoComponentes = new componente();
            console.log($scope.GencoComponentes);
            $scope.GencoComponentes.id_entorno = ""+$scope.environment_selected;
            //$('#component-create-modal').modal('show');
            $('#component-create-modal').modal('show').on('shown.bs.modal', function() {
                    $('#component-create-modal #id_nombre').focus();
            });

      
        }

        $scope.save_component = function(){
            $scope.GencoComponentes.$save(function(success){   
                var nodeDef = {'id': success.id_componente, 
                                'parent': '#', 
                                'text': success.nombre, 
                                'icon':"glyphicon glyphicon-folder-open", 
                                'li_attr':{'data-renderas':"component",
                                            'data-renderid': success.id_componente, 
                                            'data-rendername':success.nombre
                                        }
                            }
                $scope.addTreeNode($('#jstree').jstree(true).get_node('#'), nodeDef, $('#jstree').jstree(true));
                $('#component-create-modal').modal('hide')
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.delete_component = function(){

            componente.delete({id: $scope.component_selected.id},function(success){                
                $('#jstree').jstree(true).delete_node($scope.node_selected); 
            },function(error){
                $scope.showMessage($scope.getDataError(error));
            });

            
        } 


        $scope.update_component = function(){

            $scope.GencoComponentes.$update(function(success){
                $scope.renameTreeNode($scope.node_selected, success.nombre);
                $('#component-edit-modal').modal('hide');
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.load_component = function(id_component){

            var data = componente.get({id:id_component});
            $scope.GencoComponentes = data;
        }

        $scope.saveOrUpdate = function(){
            var mode = $scope.wdnMode;
            if(mode==1){
                $scope.save_template();
            }else if(mode==2){
                $scope.update_template();
            }
            
        } 

        $scope.new_template = function(id_componente){
            $scope.wdnMode = 1;
            $scope.GencoPlantillas= new plantillas();
            console.log($scope.GencoPlantillas);
            $scope.GencoPlantillas.id_componente = id_componente;
            $scope.setTemplLang(null);
            $scope.setProcLang(null);      
        }

        $scope.save_template = function(){

            $scope.GencoPlantillas.$save(function(success){   
                var nodeDef = {'id': 'template' + success.id_plantilla, 
                                'parent': success.id_componente, 
                                'text': success.nombre, 
                                'icon':"glyphicon glyphicon-file", 
                                'li_attr':{'data-renderas':"template",
                                            'data-renderid': success.id_plantilla, 
                                            'data-rendername':success.nombre
                                        }
                            }
                $scope.addTreeNode($scope.node_selected, nodeDef, $('#jstree').jstree(true));                
                $('#template-modal').modal('hide');
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.load_template = function(id_template){
            $scope.wdnMode = 2;
            var data = plantillas.get({id:id_template});
            $scope.GencoPlantillas = data;
            data.$promise.then(function(data){
                $scope.setTemplLang(data);
                $scope.setProcLang(data);
            });
        } 

        $scope.update_template = function(){
            $scope.GencoPlantillas.$update(function(success){
                $scope.renameTreeNode($scope.node_selected, success.nombre);
                $('#template-modal').modal('hide')
            },function(error){
                $scope.showMessage($scope.getDataError(error));
            });

        }

        $scope.update_template_fromTree = function(id_template, id_componente){

            var data = plantillas.get({id:id_template});
            $scope.GencoPlantillas = data;
            $scope.GencoPlantillas.id_componente = id_componente
            data.$promise.then(function(data){
                $scope.GencoPlantillas.$update(function(success){
                },function(error){
                    $scope.showMessage($scope.getDataError(error));
                });
            });
            
        }

        $scope.delete_template = function(){
            plantillas.delete({id: $scope.template_selected.id},function(success){
                $('#jstree').jstree(true).delete_node($scope.node_selected); 
            },function(error){
                $scope.showMessage($scope.getDataError(error));
            });
            
        } 

        $scope.cancel = function(){
            $scope.GencoEntorno = $scope.tmpGencoEntorno;
            $('#template-preview-modal').modal('hide');
            $('#component-create-modal').modal('hide');
            $('#component-edit-modal').modal('hide');
            $('#template-modal').modal('hide');
            $('#template-delete-modal').modal('hide');
            $('#component-delete-modal').modal('hide');            
        } 

        //$scope.counter = 1;
        /** Function to add a new tab **/
        $scope.addTab = function(id_template, name){
            
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf(id_template);

            if(pos>=0){
                $scope.selectedTab=pos;
                $scope.selectTab(id_template, pos, true);
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
                                    $scope.selectTab(id_template, $scope.selectedTab, false);
                                },function(error){
                                    $scope.showMessage($scope.getDataError(error)); 
            });


        }
        
        /** Function to delete a tab **/
        $scope.deleteTab = function(index){
            // $scope.isTabSelected=true;
            console.log($scope.tabs[index]);
            console.log(editors[index]);
            $scope.tabs.splice(index,1);
            //$('#'+editors[index].container.id).remove();
            //editors.splice(index,1);
            var aceId = editors[index].container.id;
            editors[index].destroy();
            $('#'+aceId).remove();
            editors.splice(index,1);


            var idx = $scope.tabs.length; 
            if(idx==0){
            }else{
                $scope.selectedTab = idx-1;
                $scope.selectTab($scope.tabs[idx-1].id_plantilla, $scope.selectedTab, true);    
            }
        
        }
        
                
        /** Function to set selectedTab **/
        $scope.selectTab = function(id_template, pos, flgUpd){
            idTempl= "tmpl" + id_template;

            //@Generics actualizo el contenido en memoria en caso de que haya sido modificado 
            
            if(flgUpd){     
                if(pos!=$scope.current_pos){
                    if(editors[$scope.current_pos]!=undefined || editors[$scope.current_pos] != null){
                        $('#'+editors[$scope.current_pos].container.id).attr('hidden', true);    
                    }                    
                }
                $('#'+editors[pos].container.id).attr('hidden', false); 
                editors[pos].focus();
            }else{                
                if(pos!=$scope.current_pos && editors[$scope.current_pos] != undefined){
                    $('#'+editors[$scope.current_pos].container.id).attr('hidden', true);
                }
                $('#tabPanel').append('<div id="' + idTempl + '" class="editor"></div>')
                var editor = ace.edit(idTempl);
                editor.setTheme("ace/theme/eclipse");
                editor.getSession().setMode("ace/mode/python");
                editor.$blockScrolling = Infinity;
                editors[pos]=editor;
                editors[pos].setValue($scope.tabs[pos].content);
                editors[pos].focus();
            }
            
            $scope.current_editor= idTempl;
            $scope.current_template = id_template;
            $scope.current_pos = pos;

            if(!$scope.$$phase) {
                $scope.$apply();
            }

        }


        $scope.submit = function() {

            var content = editors[$scope.current_pos].getValue();

            /*Actualizo el contenido en memoria antes de hacer el request por si hay un cambio de tab no se va a perder
            el contenido ni haya necesidad de hacer otra peticion al API Rest*/
            pos = $scope.tabs.map(function(x) {return x.id_plantilla.toString()}).indexOf($scope.current_template);
            $scope.tabs[pos].content=content;
 

            var templ = new template({editor: content});
            templ.$save({id_plantilla:$scope.current_template}, function(success){
                editors[$scope.current_pos].focus();
            }, function(error){
                $scope.showMessage($scope.getDataError(error));
            })

        };




        $scope.preview = function() {

            var content = editors[$scope.current_pos].getValue();
            editor_preview.setValue('');

            var templ = new template({editor: content});

            templ.$update({id_plantilla:$scope.current_template}, function(success){
                                    data = success;// success callback
                                    console.log(data);
                                    editor_preview.setValue(data.fileContent);
                                    $('#template-preview-modal').modal('show');  
                                },function(error){
                                    $scope.showMessage($scope.getDataError(error));
                                })

         };


        $scope.insertKey = function(node, nodeParent) {

            var session = editors[$scope.current_pos].session
            session.insert(
               editors[$scope.current_pos].selection.getCursor()
            , '[@ ' + nodeParent.li_attr['data-rendername'] + '/' + node.li_attr['data-rendername'] + ' ' + node.li_attr['data-renderid'] + '-' + guid() + ' @] ')
        }   

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            
            // return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            // s4() + '-' + s4() + s4() + s4();

            return s4() + s4() + '-' + s4() + '-' + s4()
            
        } 

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


    /*
    * data: datos del nodo seleccionado que activa el menu, de esta se puede obtener el nodo seleccionado, y una instancia para 
            manipular el arbol.
    */
    $scope.addTreeNode = function(node, newNode, jsTree){
        jsTree.create_node(node.id,newNode);
    }

    $scope.renameTreeNode = function(node, newText){
        $('#jstree').jstree('set_text', node, newText); 
    }

    $scope.setTemplLang = function (lang) {

        if(lang==null){
            $('#imgTmplLang').attr('src','');
        }
        else{
            $scope.GencoPlantillas.id_lenguaje = lang.id_lenguaje;        
            $('#imgTmplLang').attr('src',lang.lang.icon.upload);
        }
    }

    $scope.setProcLang = function (lang) {
        if(lang==null){
            $('#imgProcLang').attr('src','');
        }
        else{
            $scope.GencoPlantillas.id_lenguajeprocesador = lang.id_lenguajeprocesador;        
            $('#imgProcLang').attr('src',lang.proc.icon.upload);
        }    
    }    

    $scope.setProc = function (lang) {
        $scope.GencoPlantillas.id_lenguajeprocesador = lang.id_lenguajeprocesador;        
        $('#imgProcLang').attr('src',lang.id_icono);
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
        $('#confirm-delete-modal').modal('hide');
       $scope.ConfirmDeleteCallback();
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

    $scope.selectedTab = 0; //set selected tab to the 1st by default.
    $scope.getDirTree();

  });

angular.module('app_editor').config(function($httpProvider){

    $httpProvider.defaults.headers.common['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

})