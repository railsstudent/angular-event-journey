'use strict';

angular.module('angularEventJourney')
  .controller('AboutCtrl', function ($scope, $firebaseObject, $firebaseArray, $q, mainFactory, aboutMeFactory) {

      var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

      $scope.count = 0;
      $scope.me = {};
      // add show hide flags
          $scope.visible = {
            servers : [],
            databases : [],
            skills : [],
            mobile : [],
            frameworks : []
          };
      $scope.promise = [ $firebaseObject(mainFactory.refSkill()).$loaded(), 
                        $firebaseArray(mainFactory.refCategories()).$loaded()];


      $q.all($scope.promise).then(function(allData) {
        
          var meObject = allData[0];

          $scope.me.description = meObject.description;
        
          var refSkill = mainFactory.refSkill();
          $scope.me.servers = $firebaseArray(refSkill.child('/servers/list'));
          $scope.me.databases = $firebaseArray(refSkill.child('/databases/list'));

          $scope.me.frameworks = meObject.frameworks;
          $scope.me.frameworks.icons = _.remove($scope.me.frameworks.icons, isObject);
          $scope.me.frameworks.list = $firebaseArray(refSkill.child('/frameworks/list'));

          $scope.me.skills = meObject.skills;
          $scope.me.skills.icons = _.remove($scope.me.skills.icons, isObject); 
          $scope.me.skills.list = $firebaseArray(refSkill.child('/skills/list'));

          $scope.me.machines = meObject.machines;
          $scope.me.machines.icons = _.remove($scope.me.machines.icons, isObject); 
          $scope.me.socialMedia =_.remove(meObject.socialMedia, isObject);

          $scope.me.mobile = meObject.mobile;
          $scope.me.mobile.icons =_.remove($scope.me.mobile.icons, isObject);
          $scope.me.mobile.list = $firebaseArray(refSkill.child('/mobile/list'));
          
          var arrayPromises = [
            $scope.me.databases.$loaded(),
            $scope.me.servers.$loaded(),
            $scope.me.frameworks.list.$loaded(),
            $scope.me.skills.list.$loaded(),
            $scope.me.mobile.list.$loaded()          
          ];

          $q.all(arrayPromises).then(function (allData) {

            _.each(allData[0], function(o) {
                $scope.visible.databases.push({ id: o.$id, flag: true,  editValue : o.value});
            });

            _.each(allData[1], function(o) {
                $scope.visible.servers.push({ id: o.$id, flag: true,  editValue : o.value});
            });

            _.each(allData[2], function(o) {
                $scope.visible.frameworks.push({ id: o.$id, flag: true,  editValue : o.value});
            });

            _.each(allData[3], function(o) {
                $scope.visible.skills.push({ id: o.$id, flag: true,  editValue : o.value});
            });

            _.each(allData[4], function(o) {
                $scope.visible.mobile.push({ id: o.$id, flag: true,  editValue : o.value});
            });
          });
 
           $scope.categories = allData[1];

      });

      $scope.chosenCategory = "servers";
      $scope.newSkill = '';

      $scope.addSkill = function _addSkill(newSkill) {
        $scope.promise = aboutMeFactory.addItem($scope.chosenCategory, newSkill);
        $scope.promise.then(function(ref) {
            console.log('add new record with key = ' + ref.key());
            ref.setPriority(newSkill);
            $scope.confirm = { type: 'success', msg: newSkill + ' added successfully.' };
            // add visible flag for new object
            $scope.visible[$scope.chosenCategory].push({ id: ref.key(), flag: true, editValue: newSkill });
            $scope.newSkill = '';
            $scope.addSkillForm.$setPristine($scope.addSkillForm.skill);
            $scope.addSkillForm.$setUntouched($scope.addSkillForm.skill);
        }, function(reason) {
            $scope.confirm = { type: 'danger', msg: newSkill + 'cannot not create. Reason: ' + reason };
            $scope.newSkill = '';
            $scope.addSkillForm.$setPristine($scope.addSkillForm.skill);
            $scope.addSkillForm.$setUntouched($scope.addSkillForm.skill);
        });
      }

      $scope.removeSkill = function _removeSkill(category, objSkill, index) {
 
        console.log('removeSkill ' + objSkill + ', index = ' + index);
        $scope.promise = aboutMeFactory.removeItem(category, objSkill.$id);
        $scope.promise.then(function(ref) {
            console.log('delete record with key = ' + ref.key());
            // remove corresponding visible object by flag
            _.remove($scope.visible[category], function(o) {
                return o.id == ref.key(); 
            });

            $scope.confirm = { type: 'success', msg: objSkill.value + ' deleted successfully.' };
        }, function(reason) {
            $scope.confirm = { type: 'danger', msg: objSkill.value + ' cannot not delete. Reason: ' + reason };
        });
      }

      $scope.getVisibleObject = function _getVisibility1(category, id) {
        var arr = $scope.visible[category];
        if (arr) {
          var element = _.find(arr, function(o) {
                            return o.id === id;
                        });
          return element;
        }
        return null;
      }

      $scope.getVisibility = function _getVisibility(category, id) {
        var element = $scope.getVisibleObject(category, id);
        if (element) {
          return element.flag;
        }
        return false;
      }

      $scope.setVisibility = function _setVisibility(category, id, flagValue) {
        var element = $scope.getVisibleObject(category, id);
        if (element) {
          element.flag = flagValue;
        }    
      }

      $scope.saveSkill = function _saveSkill(category, id) {
        var editValue = $scope.getVisibleObject(category, id).editValue;
        $scope.promise = aboutMeFactory.updateItem(category ,id, editValue);
        $scope.promise.then(function(ref) {
            console.log('update record with key = ' + ref.key());
            ref.setPriority(editValue);
            $scope.setVisibility(category, id, true);
            $scope.confirm = { type: 'success', msg: editValue + ' updated successfully.' };
        }, function(reason) {
            $scope.confirm = { type: 'danger', msg: editValue + ' cannot not update. Reason: ' + reason };
        });
      }
  })