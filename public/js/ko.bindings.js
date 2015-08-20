ko.bindingHandlers.jobStatusColor = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var cfg = {
                    disabled: 'black',
                    blue: 'green',
                    red: 'red',
                    notbuilt: 'yellow'
                };
        _.each(cfg, function(val, key){
          $(element).removeClass(val);
        });
        $(element).addClass(cfg[ko.unwrap(valueAccessor())]);
    }
}

ko.bindingHandlers.afterJobRefresh = {
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var data = ko.unwrap(valueAccessor());
    //job details only finished loading:
//    var loaded = data.detailsLoaded();
//    var lastLoadedState = $(element).data('last-loaded-state');
//    if(loaded !== lastLoadedState) {
//      if(loaded) {
//        $(element).transition('swing down');
//      } else {
//        $(element).transition('fade');
//      }
//    }
//    $(element).data('last-loaded-state', loaded);

    //job details + cause'n'stuff
    $(element).transition('stop all');
    var loading = data.lastBuildInfo().loading ? data.lastBuildInfo().loading() : false;
    var visible = $(element).transition('is visible');
    if(loading && visible) {
      $(element).transition('fade');
    } else if(loading && !visible){
    } else if(!loading && visible){
    } else if(!loading && !visible){
      $(element).transition('swing down');
    }
  }
}

ko.bindingHandlers.buildingNow = {
  update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var buildingNow = viewModel.lastBuildInfo().building ? viewModel.lastBuildInfo().building() : false;
    if(buildingNow) {
      $(element).find('i.building-now').transition('jiggle looping');
    } else {
      $(element).find('i.building-now').transition('stop all');
    }
  }
}
