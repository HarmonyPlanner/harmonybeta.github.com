"use strict"; (function ($) {
    "use strict";
    $('#minMaxExample').datepicker({ language: 'fr', minDate: new Date() })
    var disabledDays = [0, 6]; 
    $('#disabled-days').datepicker({ language: 'fr', 
    onRenderCell: function (date, cellType) { 
        if (cellType == 'day') { 
            var day = date.getDay(), 
            isDisabled = disabledDays.indexOf(day) != -1; 
            return { disabled: isDisabled } } } })
})(jQuery);