        var geoXml = null;
        var geoXmlDoc = null;
        var map = null;
        var pointarray;
        var heatmapRadius=0.001;
        var heatmapGradient=null;
        var heatmapOpacity=null;
        var heatmap=null;
        var oldheatmap=null;
        var myLatLng = null;
        var myGeoXml3Zoom = true;
        var sidebarHtml = "";
        var infowindow = null;
        var kmlLayer = null;
        var filename = "http://www.sfroid.net/gmaps/sf_neighs3.kml";
        var playpauseval = 'pause';
        var autoIncrementDate = false;
        var maxSliderVal = 134;
        var tooltip;
        var crimeNameMap = {};
        var hgradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ];
        var numToMonthMap = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };


       
        function initialize() {
            myLatLng = new google.maps.LatLng(
                37.422104808, -122.0838851
            );
            // these set the initial center, zoom and maptype for the map
            // if it is not specified in the query string
            var lat = 37.422104808;
            var lng = -122.0838851;
            var zoom = 18;
            var maptype = google.maps.MapTypeId
                .ROADMAP;

            // If there are any parameters at eh end of the URL, they will be in  location.search
            // looking something like  "?marker=3"

            // skip the first character, we are not interested in the "?"
            var query = location.search
                .substring(1);

            // split the rest at each "&" character to give a list of  "argname=value"  pairs
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                // break each pair at the first "=" to obtain the argname and value
                var pos = pairs[i].indexOf(
                    "=");
                var argname = pairs[i].substring(
                    0, pos)
                    .toLowerCase();
                var value = pairs[i].substring(
                    pos + 1)
                    .toLowerCase();

                // process each possible argname  -  use unescape() if theres any chance of spaces
                if (argname == "id") {
                    id = unescape(value);
                }
                if (argname ==
                    "filename") {
                    filename = unescape(
                        value);
                }
                if (argname == "marker") {
                    index = parseFloat(
                        value);
                }
                if (argname == "lat") {
                    lat = parseFloat(
                        value);
                }
                if (argname == "lng") {
                    lng = parseFloat(
                        value);
                }
                if (argname == "zoom") {
                    zoom = parseInt(
                        value);
                    myGeoXml3Zoom =
                        false;
                }
                if (argname == "type") {
                    // from the v3 documentation 8/24/2010
                    // HYBRID This map type displays a transparent layer of major streets on satellite images.
                    // ROADMAP This map type displays a normal street map.
                    // SATELLITE This map type displays satellite images.
                    // TERRAIN This map type displays maps with physical features such as terrain and vegetation.
                    if (value == "m") {
                        maptype =
                            google.maps
                            .MapTypeId.ROADMAP;
                    }
                    if (value == "k") {
                        maptype =
                            google.maps
                            .MapTypeId.SATELLITE;
                    }
                    if (value == "h") {
                        maptype =
                            google.maps
                            .MapTypeId.HYBRID;
                    }
                    if (value == "t") {
                        maptype =
                            google.maps
                            .MapTypeId.TERRAIN;
                    }
                }
            }

            if (!isNaN(lat) && !isNaN(
                lng)) {
                myLatLng = new google.maps
                    .LatLng(lat, lng);
            }

            var myOptions = {
                zoom: zoom,
                center: myLatLng,
                // zoom: 5,
                // center: myLatlng,
                mapTypeId: maptype
            };

            map = new google.maps.Map(
                document.getElementById(
                    "map_canvas"),
                myOptions);

            tooltip = new MapTooltip(map, $('#map-tooltip'), before_show, before_hide);


                function before_show(marker, tooltip) {
                      // Set tooltip contents to the marker's title
                      tooltip.html(marker.title);

                      // NOTE you could also attach JSON objects to a marker and
                      // create more complex tooltips that save the world from evil politicians
        //              tooltip.children('.thumbnail').attr('src', marker.product.thumbnail_url);

                      // NOTE you can also change the marker's icon
        //              marker.setIcon('/images/hover.png');
                };

                function before_hide(marker, tooltip) {
        //            marker.setIcon('/images/normal.png');
                };


            infowindow = new google.maps
                .InfoWindow({});

            geoXml = new geoXML3.parser({
                map: map,
                infoWindow: infowindow,
                singleInfoWindow: false,
                zoom: myGeoXml3Zoom,
                markerOptions: {
                    optimized: false
                },
                afterParse: useTheData
            });

            geoXml.parse(filename);
            google.maps.event.addListener(
                map, "bounds_changed",
                makeSidebar);
            google.maps.event.addListener(
                map, "center_changed",
                makeSidebar);
            google.maps.event.addListener(
                map, "zoom_changed",
                makeSidebar);
            // // Make the link the first time when the page opens
            // makeLink();

            // // Make the link again whenever the map changes
            // google.maps.event.addListener(
            //     map,
            //     'maptypeid_changed',
            //     makeLink);
            // google.maps.event.addListener(
            //     map, 'center_changed',
            //     makeLink);
            // google.maps.event.addListener(
            //     map, 'bounds_changed',
            //     makeLink);
            // google.maps.event.addListener(
            //     map, 'zoom_changed',
            //     makeLink);

            createSlider();
            getCrimeNames();
            $("#sidebar").hide();
        };

        function valueToMonthYear(val){
            var year = 2003 + Math.floor(val/12);
            var month = (val%12) + 1;
            return numToMonthMap[month] + ', ' + year;
        }

        function hide_kmlLayer() {
            kmlLayer.setMap(null);
        }

        function show_kmlLayer() {
            kmlLayer.setMap(map);
        }

        function createHeatMapFromData(data, cb){
            // form crimedata array out of data

            var radius_multiplier = Math.sqrt(data.length);
            heatmapRadius = Math.floor(0.5*radius_multiplier);
            if(heatmapRadius < 10){
                heatmapRadius = 10;
            }
            else if(heatmapRadius > 40){
                heatmapRadius= 40;

            }
            // heatmapRadius = 20;
            console.log(heatmapRadius);
            var crimedata = [];
            var latlon = null;
            for (var dt in data){
                lat = parseFloat(data[dt][1]);
                lon = parseFloat(data[dt][2]);
                latlon = new google.maps.LatLng(lat, lon);
                crimedata.push(latlon);
            };

            // create point array from crimedata
            var pointArray = new google.maps.MVCArray(crimedata);
            // create and add heatmap from it all
            oldheatmap = heatmap;
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: pointArray
            });
            heatmap.setMap(map);
            heatmap.set('radius', heatmapRadius);
            heatmap.set('gradient', heatmapGradient);
            heatmap.set('gradient', heatmapOpacity);


            function fadeout(){
                // if (oldheatmap != null){
                //     oldheatmap.setMap(null);
                // }

                // if (cb != null){
                //     // make the callback that
                //     // heatmap drawing is done
                //     cb();
                // }
                if (autoIncrementDate == true){
                    incrementDate();
                }
            }

            function removeOldHeatMap(){
                 if (oldheatmap != null){
                    oldheatmap.setMap(null);
                }
            }
            setTimeout(removeOldHeatMap, 10);           
            setTimeout(fadeout, 500);
        }

        function loadHeatmapData(crime, year, month, timeofday, cb) {
            // define the default values
            crime = typeof crime !== 'undefined' ? crime : 'assault';
            year = typeof year !== 'undefined' ? year : '2003';
            month = typeof month !== 'undefined' ? month : '11';
            timeofday = typeof timeofday !== 'undefined' ? timeofday : 'night';
            cb = typeof cb !== 'undefined' ? cb : null;

            var checkedboxes = $(".cbxs:checked");
            var crimetexts = [];
            for (var idx=0; idx < checkedboxes.length; idx++){
                crimetexts.push(checkedboxes[idx].value);
            }

            crimes = crimetexts.join(",");

            // load some data from api
            var apiurl = "http://localhost:7777/api/getcrimes?";
            apiurl = (apiurl + "crime=" + crimes + "&year=" + year +
                    "&month=" + month + "&timeofday=" + timeofday);

            jQuery.get(apiurl, "", function (data, status, res){
                        createHeatMapFromData(data, cb);
                        }, "json");
        }

        function toggleHeatmap() {
          heatmap.setMap(heatmap.getMap() ? null : map);
        }

        function changeGradient() {
            heatmapGradient = heatmapGradient ? null : hgradient;
            heatmap.set('gradient', heatmapGradient);
        }

        function changeRadius() {
            heatmapRadius = heatmapRadius ? null : 20;
            heatmap.set('radius', heatmapRadius);
        }

        function changeOpacity() {
            heatmapOpacity = heatmapOpacity ? null : 0.2;
            heatmap.set('opacity', heatmapOpacity);
        }

        function playpause() {
            var oldval = playpauseval;
            playpauseval = playpauseval == 'pause'? 'play': 'pause';
            $("#playpausebtn").html(oldval);

            if (playpauseval == 'play') {
                var sliderval = $("#slider").slider("value");
                if (sliderval >= maxSliderVal) {
                    $( "#slider" ).slider("value", 0);
                }
                // set the autoincrement state
                autoIncrementDate = true;
                // call the increment function
                incrementDate();
            } else {
                // clear the autoincrement state
                autoIncrementDate = false;
            }
        }

        function incrementDate() {
            if (autoIncrementDate == false) {
                return;
            }
            // increment the slider value
            var sliderval = $("#slider").slider("value");
            if (sliderval >= maxSliderVal) {
                playpause();
                return;
            }

            var newval = sliderval + 1;
            if (newval >= maxSliderVal) {
                newval = maxSliderVal;
            }

            $("#slider").slider("value", newval);

            // function callIncrementAgain(){
            //     // call increment data again
            //     setTimeout(incrementDate, 1);
            // }

            // sliderValChanged(newval, callIncrementAgain);
            sliderValChanged(newval);
        }

        function sliderValChanged(value, cb) {
            var year = 2003 + Math.floor(value/12);
            var month = ((value%12) + 1).toString();
            $( "#datetime" ).text( valueToMonthYear(value) );
            var timeofday = $('#timeofday').val();

            loadHeatmapData('assault', year, month, timeofday, cb);
        }

        function createSlider(){
            $(function() {
                $("#slider").slider({
                    value:0,
                    min: 0,
                    max: maxSliderVal,
                    step: 1,
                    slide: function( event, ui ) {
                        sliderValChanged(ui.value);
                    }
                });
                $("#datetime").text( valueToMonthYear($("#slider").slider("value") ));
            });
        }

        function getCrimeNames(){
            jQuery.get("http://localhost:7777/getCrimeLookupMap",
                       "",
                       function(data, status, res){
                           crimesNames = data;
                           addCheckboxes(crimesNames);
                           $(".cbxs[value='ASSAULT']").prop('checked', true);
                       }, 'json');
        }

        function addCheckboxes(crimeNames) {
            var container = $('#checkboxlist');

            for (var nm in crimeNames) {
                var dt = crimeNames[nm];
                var items = '<input type="checkbox" class="cbxs" value="' + dt[1] + '"/>';
                items += '<label>' + dt[0] + '</label><br/>';
                crimeNameMap[dt[1]] = dt[0];
                $(items).appendTo(container);
            }

            var allchbx = $(".cbxs[value='ALL']")[0];
            $(allchbx).change(function() {
                if(this.checked) {
                    $(".cbxs[value!='ALL']").each(function(){
                        if (this.checked){
                            this.checked = false;
                        }
                    });
                };
            });

            var notallchbx = $(".cbxs[value!='ALL']");
            $(notallchbx).change(function() {
                if(this.checked) {
                    $(".cbxs[value='ALL']").each(function(){
                        if (this.checked){
                            this.checked = false;
                        }
                    });
                };
            });
        }


        function onClickOnPolygon() {
                infowindow.close();
                var text = infowindow.getContent();
                var nb = $("h3", text).text();
                getNbCrimeStats(nb, updateInfoWindow);
                // make api call for data
                // when data arrives, update infowindow cotents
                // show infowindow
                console.log(text);
        };

        function getNbCrimeStats(nb, iwin){
            var val = $("#slider").slider("value");
            var year = 2003 + Math.floor(val/12);
            var month = (val%12) + 1;
            var timeofday = $('#timeofday').val();

            var apiurl = "http://localhost:7777/api/getnbstats?";
            apiurl = (apiurl +
                    "year=" + year +
                    "&month=" + month +
                    "&nb=" + nb +
                    "&timeofday=" + timeofday);

            jQuery.get(apiurl, "", function (data, status, res){
                        iwin(data, year, month, nb, timeofday);
                        }, "json");

        }

        function updateInfoWindow(data, year, month, nb, timeofday){
            // create a table from the data
            console.log(data);

            timeofday = timeofday.toUpperCase();
            if (timeofday == 'BOTH'){
                timeofday = "DAY + NIGHT";
            }

            var checkedboxes = $(".cbxs:checked");
            var selectedCrimes = {};
            for (var idx=0; idx < checkedboxes.length; idx++){
                selectedCrimes[crimeNameMap[checkedboxes[idx].value]] = 1;
            }

            var table = '<table style="font-size: 8px; line-height: 12px">';
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    if (key in selectedCrimes) {
                        table += "<tr class='selectedCrime'>";
                    } else {
                        table += "<tr>";
                    }

                    table += "<td>" + key + "</td><td>" + data[key] +  "</td></tr>"
                }
            }
            table += "</table>";

            var content = '<div class="geoxml3_infowindow"><h4>' + nb + '</h4>';
            content += '<div>';
            content += "<p style='font-size: 10px'>" + numToMonthMap[month] + " " + year + " ( " + timeofday + " )" + "</p>";
            content += table;
            content += '</div></div>';

            infowindow.setContent(content);
            infowindow.open(map);
        }

