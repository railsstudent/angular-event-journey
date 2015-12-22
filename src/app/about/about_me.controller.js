'use strict';

angular.module('angularEventJourney')
  .controller('AboutCtrl', function ($scope, $firebaseObject, $firebaseArray, $q, mainFactory, aboutMeFactory) {

      var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

      $scope.me = {};
      // add show hide flags
      $scope.visible = {};

      $scope.chosenCategory = '';
      $scope.newSkill = '';
      $scope.promise = [ $firebaseObject(mainFactory.refSkill()).$loaded(),
                        $firebaseArray(mainFactory.refCategories()).$loaded()];

      $q.all($scope.promise).then(function(allData) {

          var meObject = allData[0];

          $scope.categories = allData[1];
          $scope.chosenCategory = allData[1][0].path;

          $scope.me.description = meObject.description;
          $scope.me.machines = meObject.machines;
          $scope.me.machines.icons = _.remove($scope.me.machines.icons, isObject);
          $scope.me.socialMedia =_.remove(meObject.socialMedia, isObject);

          var refSkill = mainFactory.refSkill();
          var arrayPromises = [];
          var skillIdxMap = {};
          var i = 0;
          _.each($scope.categories, function(o) {
              var category = o.path;
              console.log(category);

              var fbCatUrl = '/' + category + '/list';
              $scope.me[category] = {};
              if (meObject[category]) {
                if (meObject[category].icons) {
                    $scope.me[category].icons = _.remove(meObject[category].icons, isObject);
                } else {
                    $scope.me[category].icons = {};
                }
                $scope.me[category].list = $firebaseArray(refSkill.child(fbCatUrl));
                arrayPromises.push($scope.me[category].list.$loaded());
                skillIdxMap[category] = i;
                i = i + 1;
              }
          });

          $q.all(arrayPromises).then(function (allSkills) {
              for (var i = 0; i < $scope.categories.length; i++) {
                var category = $scope.categories[i].path;
                var allSkill = allSkills[skillIdxMap[category]];
                $scope.visible[category] = [];
                _.each(allSkill, function(o) {
                  $scope.visible[category].push({ id: o.$id, flag: true,  editValue : o.value});
                });
              }
            });
      });

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
      };

      $scope.removeSkill = function _removeSkill(category, objSkill, index) {

        console.log('removeSkill ' + objSkill + ', index = ' + index);
        $scope.promise = aboutMeFactory.removeItem(category, objSkill.$id);
        $scope.promise.then(function(ref) {
            console.log('delete record with key = ' + ref.key());
            // remove corresponding visible object by flag
            _.remove($scope.visible[category], function(o) {
                return o.id === ref.key();
            });

            $scope.confirm = { type: 'success', msg: objSkill.value + ' deleted successfully.' };
        }, function(reason) {
            $scope.confirm = { type: 'danger', msg: objSkill.value + ' cannot not delete. Reason: ' + reason };
        });
      };

      $scope.getVisibleObject = function _getVisibility1(category, id) {
        var arr = $scope.visible[category];
        if (arr) {
          var element = _.find(arr, function(o) { return o.id === id; });
          return element;
        }
        return null;
      };

      $scope.getVisibility = function _getVisibility(category, id) {
        var element = $scope.getVisibleObject(category, id);
        if (element) {
          return element.flag;
        }
        return false;
      };

      $scope.setVisibility = function _setVisibility(category, id, flagValue) {
        var element = $scope.getVisibleObject(category, id);
        if (element) {
          element.flag = flagValue;
        }
      };

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
      };
  });
