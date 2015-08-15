/**
 *  ------------------------------------------------------
 *  controller : edaEditPanelController
 *  ------------------------------------------------------
 *
 *  controller dedicated side panel (edit control panel)
 * 
 * ——————————————————————————————————————————————
 * MIT (2015) - Erwan Datin (MacKentoch)
 * https://github.com/MacKentoch/easyFormGenerator
 * ——————————————————————————————————————————————
**/
angular
	.module('edaApp.controllers.edaEditPanelController', [])
	.controller('edaEditPanelController', ['$scope', 
                                          'toaster' ,
                                          '$timeout',
                                          'selectOptionManage',
                                          'controllerModalProxy',
		function(	$scope,  
              toaster,
              $timeout,
              selectOptionManage,
              controllerModalProxy
						){



			/**
			 * ==============================================================
			 * init model from service
			 * ==============================================================
			 * proxy model contains :
			 * - all controls definitions and 
			 * - selected control
			 * - properties to customize control (then bound to configuration model)
			 */
			var self = this;
		
			self.proxyModel = controllerModalProxy.proxyModel;
					
		  //selected control from  main controller applied to current selected control
		  self.proxyModel.selectedControl = self.proxyModel.temporyConfig.selectedControl;
		
		
			
			var initOptionModel = { rows:[] };			
			/**
			 * basic Select tempory models
			 */			
		  self.basicSelectRowCollection = initOptionModel;
		  self.newOptionBasicSelect 		= { saisie: '' };

			/**
			 * grouped Select tempory models
			 */
		  self.groupedSelectRowCollection = initOptionModel;
		  self.newOptionGroupedSelect 		= { saisie: '' };
		  self.GroupedSelectGroups 				= { list:[] };
		  self.newGroupGroupedSelect 			= { saisie: '' };  
		  self.groupSelectGroupClick 			= { showList : false };  

			/**
			 * radio control tempory models
			 */
		  self.radioRowCollection 		= initOptionModel;
		  self.newOptionRadio 				= { saisie: '' };		   		  


		  //place proxyModel to selection if not none :
		   if (self.proxyModel.temporyConfig.selectedControl !== 'none') {
		    for (var i = self.proxyModel.controls.length - 1; i >= 0; i--) {
		       if (self.proxyModel.controls[i].id === self.proxyModel.temporyConfig.selectedControl) {
		          self.modelproxyModel = self.proxyModel.controls[i];
		       }
		    }
		
		    if (self.proxyModel.temporyConfig.selectedControl === 'BasicSelect') {
		      controllerModalProxy.bindBasicSelectFromProxyModel(self.basicSelectRowCollection);
		    }
		
		    if (self.proxyModel.temporyConfig.selectedControl === 'GroupedSelect') {
		      bindGroupedSelectFromNYA();
		    } 
		
		    if (self.proxyModel.temporyConfig.selectedControl === 'Radio') {
		      bindRadioFromNYA();
		    }    
		
		  }
		
		
		
		  function resetTemporyConfig(){
		    self.proxyModel.temporyConfig = {
		                                        formlyLabel: '', 
		                                        formlyRequired: false, 
		                                        formlyPlaceholder: '',
		                                        formlyDesciption: '',
		                                        formlyOptions: []
		                                      };   
		  }
		
		
		
		  self.selectThisControl = function(controlName){
		    self.proxyModel.selectedControl = 'none';
		    resetTemporyConfig();
		
		    for (var i = self.proxyModel.controls.length - 1; i >= 0; i--) {
		       if (self.proxyModel.controls[i].id === controlName) {
		          self.proxyModel.selectedControl = self.proxyModel.controls[i].id;         
		       }
		    }
		
		    if (self.proxyModel.selectedControl === 'Date') {
		      initDatePicker();
		    }
		  };
		
		
			/**
			 * modal buttons click
			 */
		  self.ok = function () {
		
		    if (self.proxyModel.selectedControl === 'BasicSelect') {
		      controllerModalProxy.bindBasicSelectToProxyModel(self.basicSelectRowCollection);
		    }
		
		    if (self.proxyModel.selectedControl === 'GroupedSelect') {
		      bindGroupedSelectToNya();
		    }  
		
		    if (self.proxyModel.selectedControl === 'Radio') {
		      bindRadioToNya();
		    }  
		
		    //save config to control
		    controllerModalProxy.applyConfigToSelectedControl(self.proxyModel);
		    //return current model to parent controller :



		    // //update configuration model and formly model
		    // controllerModalProxy.bindConfigurationModelFromProxyModel(indexLine, numcolumn, modalAddCtrlModel, $scope.configuration);
    		// formFieldManage.applyConfigurationToformlyModel($scope.configuration, $scope.vm.wfFormFields, $scope.vm.model);    
    		// $scope.vm.wfFormFieldsOnlyNeededProperties = angular.copy($scope.vm.wfFormFields);     
    
    		// controllerModalProxy.setEditPanelModelToggle(false);
    		// $scope.editPanelModel.toggle = controllerModalProxy.getEditPanelModelToggle();  
		
		  };
		
		  self.cancel = function () {
				/**
				 * TODO : to adpat drag and drop way
				 */				
		    //$modalInstance.dismiss('cancel');
		  };

		/**
		 * ==============================================================
		 * specific controls management 
		 * (display, properties.... : ex : grouped Select)
		 * ==============================================================
		 */

		
		
		  function bindRadioFromNYA(){
		    if (self.proxyModel.temporyConfig.formlyOptions.length > 0) {
		      for (var i = 0; i <= self.proxyModel.temporyConfig.formlyOptions.length-1; i++){
		
		            var newOption = { 
		                              'option': self.proxyModel.temporyConfig.formlyOptions[i].name,
		                              'order': i,
		                              'group': ''
		                            };
		            self.radioRowCollection.rows.push(newOption);
		      }    
		    }
		  }
		
		  function bindRadioToNya(){
		    var resetproxyModelOptions = [];
		    self.proxyModel.temporyConfig.formlyOptions = resetproxyModelOptions;
		
		    if (self.radioRowCollection.rows.length > 0) {
		
		      for (var i = 0; i <= self.radioRowCollection.rows.length - 1; i++){
		            var newOption = {
		                              'name': self.radioRowCollection.rows[i].option,
		                              'value': i,
		                              'group': ''
		                    };
		            self.proxyModel.temporyConfig.formlyOptions.push(newOption);   
		        }       
		   }
		  }
		
		  self.addNewOptionRadio = function(){
		    var result = selectOptionManage.addNewOptionRadio(self.radioRowCollection, self.newOptionRadio.saisie);
		    if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: '\''+ self.newOptionRadio.saisie + '\'' + ' cannot be added.',                
		                  showCloseButton: true
		            });
		    }
		    //reset input
		    self.newOptionRadio = {saisie: ''};
		  };
		
		  self.removeRadioRow = function(index) {
		      var result = selectOptionManage.removeOption(self.radioRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Delete was cancelled.',                
		                  showCloseButton: true
		            });
		      }      
		    }; 
		
		  self.upThisRadioRow = function(index){
		      var result = selectOptionManage.upthisOption(self.radioRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Operation cancelled.',                
		                  showCloseButton: true
		            });
		      }       
		  };                                    
		
		  self.downThisRadioRow = function(index){
		      var result = selectOptionManage.downthisOption(self.radioRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Operation cancelled.',                
		                  showCloseButton: true
		            });
		      }
		  };
			

		
		
			/**
			 * deprecated in drag and drop verion
			 * 
			 * drag and drop uses service controllerModalProxy.bindBasicSelectFromProxyModel()
			 */
		  function bindBasicSelectFromNYA(){		
		    if (self.nyaSelect.temporyConfig.formlyOptions.length > 0) {
		      for (var i = 0; i <= self.nyaSelect.temporyConfig.formlyOptions.length-1; i++){
		
		            var newOption = {'option': self.nyaSelect.temporyConfig.formlyOptions[i].name,
		                      'order': i,
		                      'group': ''
		                    };
		            self.basicSelectRowCollection.rows.push(newOption);
		      }    
		    }
		  }
			/**
			 * deprecated in drag and drop version
			 */
		  function bindBasicSelectToNya(){
		    var resetNyASelectOptions = [];
		    self.nyaSelect.temporyConfig.formlyOptions = resetNyASelectOptions;
		    if (self.basicSelectRowCollection.rows.length > 0) {
		      for (var i = 0; i <= self.basicSelectRowCollection.rows.length - 1; i++){
		            var newOption = {'name': self.basicSelectRowCollection.rows[i].option,
		                      'value': i,
		                      'group': ''
		                    };
		            self.nyaSelect.temporyConfig.formlyOptions.push(newOption);
		        }      
		   }
		  }
		
		  self.addNewOptionBasicSelect = function(){
		    var result = selectOptionManage.addNewOptionBasicSelect(self.basicSelectRowCollection, self.newOptionBasicSelect.saisie);
		    if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: '\''+ self.newOptionBasicSelect.saisie + '\'' + ' cannot be added.',                
		                  showCloseButton: true
		            });
		    }
		    //reset input
		    self.newOptionBasicSelect = {saisie: ''};
		  };
		
		  self.removeRow = function(index) {
		      var result = selectOptionManage.removeOption(self.basicSelectRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Delete was cancelled.',                
		                  showCloseButton: true
		            });
		      }      
		    }; 
		
		  self.upThisRow = function(index){
		      var result = selectOptionManage.upthisOption(self.basicSelectRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Operation cancelled.',                
		                  showCloseButton: true
		            });
		      }       
		  };                                    
		
		  self.downThisRow = function(index){
		      var result = selectOptionManage.downthisOption(self.basicSelectRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Operation cancelled.',                
		                  showCloseButton: true
		            });
		      }
		  };
		
                             
		
		
		  function bindGroupedSelectFromNYA(){
		    if (self.nyaSelect.temporyConfig.formlyOptions.length > 0) {
		      for (var i = 0; i <= self.nyaSelect.temporyConfig.formlyOptions.length-1; i++){		
		            var newOption = {'option': self.nyaSelect.temporyConfig.formlyOptions[i].name,
		                      'order': i,
		                      'group': self.nyaSelect.temporyConfig.formlyOptions[i].group
		                    };
		            self.groupedSelectRowCollection.rows.push(newOption);            
		        }
		        //grouplist : thx to lodash it is easy
		       var filteredgroup = _.uniq(_.pluck(self.groupedSelectRowCollection.rows, 'group'));
		       angular.copy(filteredgroup, self.GroupedSelectGroups.list); 		
		    }
		  }
		
		  function bindGroupedSelectToNya(){
		    self.nyaSelect.temporyConfig.formlyOptions = [];
		    for (var i = 0; i <= self.groupedSelectRowCollection.rows.length - 1; i++){
		          var newOption = {'name': self.groupedSelectRowCollection.rows[i].option,
		                    'value': i,
		                    'group': self.groupedSelectRowCollection.rows[i].group
		                  };
		          self.nyaSelect.temporyConfig.formlyOptions.push(newOption);   
		      }
		  }  
		
		  self.showGroupListToChoose = function(){
		    self.groupSelectGroupClick.showList = !self.groupSelectGroupClick.showList;
		  };
		
		  self.addNewGroupToGroupedSelect = function(){
		    if (self.newGroupGroupedSelect.saisie !== '') {
		      for (var i = self.GroupedSelectGroups.list.length - 1; i >= 0; i--) {
		        if (self.GroupedSelectGroups.list[i] === self.newGroupGroupedSelect.saisie) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: 'Group already exists',
		                  body: 'No group added.',                
		                  showCloseButton: true
		            });          
		        }
		      }
		      self.GroupedSelectGroups.list.push(self.newGroupGroupedSelect.saisie);
		    }else{
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: 'Not a valid group to add',
		                  body: 'No group added.',                
		                  showCloseButton: true
		            });
		    }
		    self.newGroupGroupedSelect.saisie = '';
		  };
		
		
		  self.addNewOptionGroupedSelect = function(){
		    var result = selectOptionManage.addNewOptionGroupedSelect(self.groupedSelectRowCollection, self.newOptionGroupedSelect.saisie, '');
		    if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: '\''+ self.newOptionGroupedSelect.saisie + '\'' + ' cannot be added.',                
		                  showCloseButton: true
		            });
		    }
		    //bind nya : dont bind here $apply is not done fast enough
		    //bindGroupedSelectToNya();
		    //reset input
		    self.newOptionGroupedSelect = {saisie: ''};
		  };
		
		  self.removeGroupedSelectRow = function(index) {
		      var result = selectOptionManage.removeOption(self.groupedSelectRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Delete was cancelled.',                
		                  showCloseButton: true
		            });
		      }   
		    }; 
		
		  self.upThisGroupedSelectRow = function(index){
		      var result = selectOptionManage.upthisOption(self.groupedSelectRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Operation cancelled.',                
		                  showCloseButton: true
		            });
		      } 
		  };                                    
		
		  self.downThisGroupedSelectRow = function(index){
		      var result = selectOptionManage.downthisOption(self.groupedSelectRowCollection, index);
		      if (result.resultFlag === false) {
		          toaster.pop({
		                  type: 'warning',
		                  timeout:2000,
		                  title: result.details,
		                  body: 'Operation cancelled.',                
		                  showCloseButton: true
		            });
		      } 
		
		  };
		
			/**
			 * init datetimepicker model
			 */
		  self.demodt ={};
		
		  self.today = function() {
		    self.demodt.dt = new Date();
		  };
		  self.today();
		
		  self.clear = function () {
		    self.demodt.dt = null;
		  };
		
		
		  self.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();
		
		    self.demodt.opened = true;
		  };
		
		  self.dateOptions = {
		           formatYear: 'yy',
		           startingDay: 1,
		           showWeeks: true,
		           initDate: null
		  };
		
		  self.demodt.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  
		  function initDatePicker(){
		    self.proxyModel.temporyConfig.datepickerPopup = self.demodt.formats[0];  
		  }
		  
		

			 		
	}]);