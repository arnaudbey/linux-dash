$(document).ready(function() {
	getAllWidgets();

	$( document ).on( "click", ".widget", function() {
		refreshWidget($(this).attr("id"));
	});

});

function getAllWidgets(){
	$.ajax({ url: 'Controller/dashboard.php',
		data: {action: 'getAllWidgets'},
		type: 'post',
		dataType: "json",
		success: function(widgets) {
			for(var i in widgets){
				executeWidget(widgets[i]);
			}
			sortable();
		}
	});
}

function refreshWidget(widgetId){
	$( "#" + widgetId + " .refresh-btn").attr("disabled", "disabled");
	$.ajax({ url: 'Controller/dashboard.php',
		data: {
			action: 'refreshWidget',
			widgetId: widgetId
		},
		type: 'post',
		success: function(widgetHTML) {
			$( "#" + widgetId ).replaceWith(widgetHTML);
		}
	});
}

function executeWidget(widget){
	// prévoir un tableau de widget exclu
	$.ajax({ url: 'Controller/dashboard.php',
		data: {
			action: 'executeWidget',
			widgetFile: widget
		},
		type: 'post',
		success: function(widgetHTML) {
			$("#widgets").append(widgetHTML);
			keepWidgetOrdered();
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