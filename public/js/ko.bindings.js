ko.bindingHandlers.jobStatusColor = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var cfg = {
                    disabled: 'black',
                    blue: 'green',
                    red: 'red',
                    notbuilt: 'yellow'
                };
//        $(element).css('background-color', ko.unwrap(valueAccessor()));
        $(element).addClass(cfg[ko.unwrap(valueAccessor())]);
    }
}