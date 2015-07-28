ko.bindingHandlers.jobStatusColor = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var cfg = {
                    disabled: 'black',
                    blue: 'blue',
                    red: 'red',
                    notbuilt: 'yellow'
                };
//        $(element).css('background-color', ko.unwrap(valueAccessor()));
        $(element).addClass(cfg[ko.unwrap(valueAccessor())]);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever any observables/computeds that are accessed change
        // Update the DOM element based on the supplied values here.
    }
}