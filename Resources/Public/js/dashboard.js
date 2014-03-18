$(document).ready(function() {
	appendClosedWidgets();
	getAllWidgets();
});

$( document ).on( "click", ".open-btn", function() {
	openWidget($(this).data('id'), 300);
	$(this).parent().remove();
});

$( document ).on( "click", ".close-btn", function() {
	closeWidget($(this).parents(".widget").attr("id"), 300);
});

$( document ).on( "click", ".refresh-btn", function() {
	refreshWidget($(this).parents(".widget").attr("id"));
});

$( document ).on( "click", "#close-all-widgets", function() {
	closeAllWidgets();
});

$( document ).on( "click", "#open-all-widgets", function() {
	openAllWidgets();
	$(".open-btn").parent().remove();
});


function getAllWidgets(){
	$.ajax({ url: 'Controller/dashboard.php',
		data: {action: 'getAllWidgets'},
		type: 'post',
		dataType: "json",
		success: function(widgets) {
			var localData = JSON.parse(window.localStorage.getItem('hidden'));
			for(var i in widgets){
				if (!isInArray(localData, widgets[i])) {
					executeWidget(widgets[i]);
				}
			}
			sortable();
		}
	});
}

function refreshWidget(widgetId){
	$( "#" + widgetId + " .refresh-btn").attr("disabled", "disabled");
	$.ajax({ url: 'Controller/dashboard.php',
		data: {
			action: 'executeWidget',
			widgetId: widgetId
		},
		type: 'post',
		success: function(widgetHTML) {
			$( "#" + widgetId ).replaceWith(widgetHTML);
		}
	});
}


function closeAllWidgets(){
	$('.widget').each(function() {
		closeWidget($(this).attr("id"), 0);
    });
}

function openAllWidgets(){
	var localData = JSON.parse(window.localStorage.getItem('hidden'));
	for(var i in localData){
		openWidget(localData[i][0], 300);
	}
}

function closeWidget(widgetId, speed){
	var closedWidgetCount = $('#closed-widget-count');
	var closedWidgets = $('#closed-widget-list');
	var widget = $("#"+widgetId);
    var widgetName = widget.find('.widget-title').text();

    // update count
    closedWidgetCount.text( Number(closedWidgetCount.text()) + 1);

    // hide widget from DOM
    widget.remove();

    // add to hidden list
    closedWidgets.append('<li><a href="#" class="open-btn" data-id="'+widgetId+'"><i class="fa fa-plus-square"></i>  '+widgetName+'</a></li>');

    // add widget to localstorage (and create item if needed)
    var localData = JSON.parse(window.localStorage.getItem('hidden'));
    var widgetInfo = new Array(widgetId, widgetName);
    if(localData == null) {
        hidden = new Array();
        hidden.push(widgetInfo);
        localStorage.setItem('hidden', JSON.stringify(hidden));
    }
    else{
        if (!isInArray(localData, widgetId)) {
            localData.push(widgetInfo);
            localStorage.setItem('hidden', JSON.stringify(localData));
        }
    }
}


function appendClosedWidgets(){
	var localData = JSON.parse(window.localStorage.getItem('hidden'));
	if(localData != null) {
		for(var i = localData.length; i--;){
	        appendClosedWidget(localData[i][0], localData[i][1]);
	    }
	}
}

function appendClosedWidget(widgetId, widgetName){
	var closedWidgetCount = $('#closed-widget-count');
	var closedWidgets = $('#closed-widget-list');
	closedWidgetCount.text( Number(closedWidgetCount.text()) + 1);
	closedWidgets.append('<li><a class="open-btn" data-id="'+widgetId+'"><i class="icon-plus-sign"></i>'+widgetName+'</a></li>');

}

function openWidget(widgetId, speed){
	var closedWidgetCount = $('#closed-widget-count');
	var closedWidgets = $('#closed-widget-list');

    // decrement closed-widget-count 
    closedWidgetCount.text( Number(closedWidgetCount.text()) - 1);
    
    executeWidget(widgetId);

    // remove widget from localstorage
    var localData = JSON.parse(window.localStorage.getItem('hidden'));
    for(var i = localData.length; i--;){
        if (localData[i][0] == widgetId) {
            localData.splice(i, 1);
        }
    }
    localStorage.setItem('hidden', JSON.stringify(localData));
	
}

function executeWidget(widgetId){
	$.ajax({ url: 'Controller/dashboard.php',
		data: {
			action: 'executeWidget',
			widgetId: widgetId
		},
		type: 'post',
		success: function(widgetHTML) {
			$("#widgets").append(widgetHTML);
			keepWidgetOrdered();
			sortable();
		}
	});
}

function sortable() {
	$( "#widgets" ).sortable({
	  handle: ".panel-heading",
	  cancel: "#filter-ps",
	  cursor: "move",
	  opacity: 0.7,
	  scrollSensitivity:10,
	  tolerance: 'pointer',
	  stop: function(event, ui) {
	        // save widget order in localstorage
	        var newOrder = new Array();
	        $('.widget').each(function() {
	            newOrder.push($(this).attr("id"));
	        });
	        localStorage.setItem('positions', JSON.stringify(newOrder));
	    }
	});
}

function keepWidgetOrdered(){
    var localData = JSON.parse(window.localStorage.getItem('positions'));
    if(localData!=null) {
        $.each(localData, function(i,value){
            var widgetId ="#" + value;
            $("#widgets").append($(widgetId));
        });
    }
}

function isInArray(array, search)
{
	// test if "search" is present as a first index (0) of an element of "array"
	if (array != null) {
		for(var i = array.length; i--;){
	        if (array[i][0] == search) {
	            return true;
	        }
	    }
	    return false;
	} else {
		return false;
	}
}