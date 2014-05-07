//
//
//
function MapTooltip(map, tip, onBeforeShow, onBeforeHide) {
  // Don't forget the tip
  var $tooltip = tip;
  // One timer
  var timer = 0;
  // Don't loose our scope
  var self = this;
  // xy position
  var overlay = get_overlay(map);

  if(!$tooltip.hasClass('tooltip-enabled')) {
    // Mouse enter
    $tooltip.bind('mouseenter.tooltip', function(e) {
      stopTimer();
    });

    // Mouse leave
    $tooltip.bind('mouseleave.tooltip', function(e) {
      startTimer(function() { self.hide(200) }, 100);
    });

    $tooltip.addClass('tooltip-enabled');
  }

  // 
  // We need this overlay for getting the markers position
  //
  function get_overlay(map) {
    function ProjectionHelperOverlay(map) {
      this.setMap(map);
    }

    ProjectionHelperOverlay.prototype = new google.maps.OverlayView();
    ProjectionHelperOverlay.prototype.draw = function () {
      if (!this.ready) {
        this.ready = true;
        google.maps.event.trigger(this, 'ready');
      }
    }; 
    return new ProjectionHelperOverlay(map);
  }

  function startTimer(callback, time) {
    stopTimer();
    timer = setTimeout(callback, time);
  }

  function stopTimer() {
    clearTimeout(timer);
  }

  this.show = function(marker, event) {
    // Hide 
    self.hide(0);

    $tooltip.data('MapTooltips.marker', marker);

    // Callback 
    onBeforeShow(marker, $tooltip);

    // Map world relative to map container
    // TODO This needs to be configurable and more exact
//    var p = overlay.getProjection().fromLatLngToContainerPixel(event.latLng);
    var dragObject = overlay.getPanes().mapPane.parentNode;
    var divpos = $("#map_canvas").position();
    var x = divpos.left + 100; // + $tooltip.width(); // + parseInt(dragObject.style.left);
    var y = divpos.top + 20; // + $tooltip.height() / 2; // + parseInt(dragObject.style.top);

    $tooltip.css({ 
      position: "absolute",
      'z-index': 20000,
      top: y, left: x,
      display: 'block'
    });

//    $tooltip.animate({"top": "+=20px", "opacity": "toggle"}, 300);
  }

  this.hide = function(time) {
    var marker = $tooltip.data('MapTooltips.marker');

    if(marker && typeof onBeforeHide == 'function') {
      onBeforeHide(marker, $tooltip);
    }
    $tooltip.css({display: 'none'});
  }

  this.addMarker = function(marker) {
    google.maps.event.addListener(marker, 'mouseover', function(event) {
      startTimer(function(){ self.show(marker, event) }, 10);
    });

    google.maps.event.addListener(marker, 'mouseout', function(event) {
      startTimer(function() { self.hide(200) }, 10);
    });
  }
};
