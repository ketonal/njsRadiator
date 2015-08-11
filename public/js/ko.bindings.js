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