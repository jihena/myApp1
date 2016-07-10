appContext.factory("LoadingService", function($ionicLoading) {



  var dismiss = function() {
    $ionicLoading.hide();
  };

  var confirm = function(msg,params, controller) {

    $ionicLoading.show({
      template: '<div class="window" ng-controller="'+controller+'"><p class="activated_KDO_text">'+msg+'</p><button class="yes_text" ng-click="ok('+params+')">OK</button></div>',
      animation: 'fade-in',
      showBackdrop: true,
    });

  };

  return {
    confirm : confirm,
    dismiss : dismiss
  };
});
