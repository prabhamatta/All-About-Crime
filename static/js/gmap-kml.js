 function MapTypeId2UrlValue(
            maptype) {
            var urlValue = 'm';
            switch (maptype) {
            case google.maps.MapTypeId.HYBRID:
                urlValue = 'h';
                break;
            case google.maps.MapTypeId.SATELLITE:
                urlValue = 'k';
                break;
            case google.maps.MapTypeId.TERRAIN:
                urlValue = 't';
                break;
            default:
            case google.maps.MapTypeId.ROADMAP:
                urlValue = 'm';
                break;
            }
            return urlValue;
        }

         // ========== This function will create the "link to this page"
        function makeLink() {
            //        var a="http://www.geocodezip.com/v3_MW_example_linktothis.html"
            var url = window.location.pathname;
            var a = url.substring(url.lastIndexOf(
                '/') + 1) + "?lat=" +
                map.getCenter()
                .lat()
                .toFixed(6) + "&lng=" +
                map.getCenter()
                .lng()
                .toFixed(6) +
                "&zoom=" + map.getZoom() +
                "&type=" +
                MapTypeId2UrlValue(map.getMapTypeId());
            if (filename !=
                "TrashDays40.xml") a +=
                "&filename=" + filename;
            document.getElementById(
                "link")
                .innerHTML =
                '<a href="' + a +
                '">Link to this page<\/a>';
        }


        function kmlPgClick(pm) {
            if (geoXml.docs[0].placemarks[
                pm].polygon.getMap()) {
                google.maps.event.trigger(
                    geoXmlDoc.placemarks[
                        pm].polygon,
                    "click");
            } else {
                geoXmlDoc.placemarks[pm]
                    .polygon.setMap(map);
                google.maps.event.trigger(
                    geoXmlDoc.placemarks[
                        pm].polygon,
                    "click");
            }
        }

        function kmlPlClick(pm) {
            if (geoXml.docs[0].placemarks[
                pm].polyline.getMap()) {
                google.maps.event.trigger(
                    geoXmlDoc.placemarks[
                        pm].polyline,
                    "click");
            } else {
                geoXmlDoc.placemarks[pm]
                    .polyline.setMap(
                        map);
                google.maps.event.trigger(
                    geoXmlDoc.placemarks[
                        pm].polyline,
                    "click");
            }
        }

        function kmlClick(pm) {
            if (geoXml.docs[0].placemarks[
                pm].marker.getMap()) {
                google.maps.event.trigger(
                    geoXml.docs[0].placemarks[
                        pm].marker,
                    "click");
            } else {
                geoXmlDoc.placemarks[pm]
                    .marker.setMap(map);
                google.maps.event.trigger(
                    geoXmlDoc.placemarks[
                        pm].marker,
                    "click");
            }
        }

        function kmlShowPlacemark(pm) {
            if (geoXmlDoc.placemarks[pm]
                .polygon) {
                map.fitBounds(geoXmlDoc
                    .placemarks[pm].polygon
                    .bounds);
            } else if (geoXmlDoc.placemarks[
                pm].polyline) {
                map.fitBounds(geoXmlDoc
                    .placemarks[pm].polyline
                    .bounds);
            } else if (geoXmlDoc.placemarks[
                pm].marker) {
                map.setCenter(geoXmlDoc
                    .placemarks[pm].marker
                    .getPosition());
            }

            for (var i = 0; i <
                geoXmlDoc.placemarks.length; i++
            ) {
                var placemark =
                    geoXmlDoc.placemarks[
                        i];
                if (i == pm) {
                    if (placemark.polygon)
                        placemark.polygon
                            .setMap(map);
                    if (placemark.polyline)
                        placemark.polyline
                            .setMap(map);
                    if (placemark.marker)
                        placemark.marker
                            .setMap(map);
                } else {
                    if (placemark.polygon)
                        placemark.polygon
                            .setMap(
                                null);
                    if (placemark.polyline)
                        placemark.polyline
                            .setMap(
                                null);
                    if (placemark.marker)
                        placemark.marker
                            .setMap(
                                null);
                }
            }
        }

        var highlightOptions = {
            fillColor: "#5555FF",
            strokeColor: "#000000",
            fillOpacity: 0.3,
            strokeWidth: 10
        };
        var highlightLineOptions = {
            strokeColor: "#0000FF",
            strokeWidth: 10
        };

        function kmlHighlightPoly(pm) {
            for (var i = 0; i < geoXmlDoc.placemarks.length; i++) {
                var placemark = geoXmlDoc.placemarks[i];
                if (i == pm) {
                    if (placemark.polygon)
                        placemark.polygon.setOptions( highlightOptions );

                    if (placemark.polyline)
                        placemark.polyline.setOptions( highlightLineOptions );

                } else {
                    if (placemark.polygon)
                        placemark.polygon
                            .setOptions(
                                placemark
                                .polygon
                                .normalStyle
                        );
                    if (placemark.polyline)
                        placemark.polyline
                            .setOptions(
                                placemark
                                .polyline
                                .normalStyle
                        );
                }
            }
        }

        function kmlUnHighlightPoly(pm) {
            for (var i = 0; i <
                geoXmlDoc.placemarks.length; i++
            ) {
                if (i == pm) {
                    var placemark =
                        geoXmlDoc.placemarks[
                            i];
                    if (placemark.polygon)
                        placemark.polygon
                            .setOptions(
                                placemark
                                .polygon
                                .normalStyle
                        );
                    if (placemark.polyline)
                        placemark.polyline
                            .setOptions(
                                placemark
                                .polyline
                                .normalStyle
                        );
                }
            }
        }


        function showAll() {
            map.fitBounds(geoXmlDoc.bounds);
            for (var i = 0; i <
                geoXmlDoc.placemarks.length; i++
            ) {
                var placemark =
                    geoXmlDoc.placemarks[
                        i];
                if (placemark.polygon)
                    placemark.polygon.setMap(
                        map);
                if (placemark.polyline)
                    placemark.polyline.setMap(
                        map);
                if (placemark.marker)
                    placemark.marker.setMap(
                        map);
            }
        }

        function highlightPoly(poly,
            polynum) {
            //    poly.setOptions({fillColor: "#0000FF", strokeColor: "#0000FF", fillOpacity: 0.3}) ;
            google.maps.event.addListener(
                poly, "mouseover",
                function () {
                    var rowElem =
                        document.getElementById(
                            'row' +
                            polynum);
                    if (rowElem) rowElem
                        .style.backgroundColor =
                        "#FFFA5E";
                    if (geoXmlDoc.placemarks[
                        polynum].polygon) {
                        poly.setOptions(
                            highlightOptions
                        );
                    } else if (
                        geoXmlDoc.placemarks[
                            polynum].polyline
                    ) {
                        poly.setOptions(
                            highlightLineOptions
                        );
                    }
                });
            google.maps.event.addListener(
                poly, "mouseout",
                function () {
                    var rowElem =
                        document.getElementById(
                            'row' +
                            polynum);
                    if (rowElem) rowElem
                        .style.backgroundColor =
                        "#FFFFFF";
                    poly.setOptions(
                        poly.normalStyle
                    );
                });
        }

         // == rebuilds the sidebar to match the markers currently displayed ==
        function makeSidebarPolygonEntry(
            i) {
            var name = geoXmlDoc.placemarks[
                i].name;
            if (!name || (name.length ==
                0)) name = "polygon #" +
                i;
            // alert(name);
            sidebarHtml +=
                '<tr id="row' + i +
                '"><td onmouseover="kmlHighlightPoly(' +
                i +
                ');" onmouseout="kmlUnHighlightPoly(' +
                i +
                ');"><a href="javascript:kmlPgClick(' +
                i + ');">' + name +
                '</a> - <a href="javascript:kmlShowPlacemark(' +
                i +
                ');">show</a></td></tr>';

        }

        function makeSidebarPolylineEntry(
            i) {
            var name = geoXmlDoc.placemarks[
                i].name;
            if (!name || (name.length ==
                0)) name = "polyline #" +
                i;
            // alert(name);
            sidebarHtml +=
                '<tr id="row' + i +
                '"><td onmouseover="kmlHighlightPoly(' +
                i +
                ');" onmouseout="kmlUnHighlightPoly(' +
                i +
                ');"><a href="javascript:kmlPlClick(' +
                i + ');">' + name +
                '</a> - <a href="javascript:kmlShowPlacemark(' +
                i +
                ');">show</a></td></tr>';

        }

        function makeSidebarEntry(i) {
            var name = geoXmlDoc.placemarks[
                i].name;
            if (!name || (name.length ==
                0)) name = "marker #" +
                i;
            // alert(name);
            sidebarHtml +=
                '<tr id="row' + i +
                '"><td><a href="javascript:kmlClick(' +
                i + ');">' + name +
                '</a></td></tr>';
        }

        function makeSidebar() {
            sidebarHtml =
                '<table><tr><td><a href="javascript:showAll();">Show All</a></td></tr>';
            var currentBounds = map.getBounds();
            // if bounds not yet available, just use the empty bounds object;
            if (!currentBounds)
                currentBounds = new google
                    .maps.LatLngBounds();
            if (geoXmlDoc) {
                for (var i = 0; i <
                    geoXmlDoc.placemarks
                    .length; i++) {
                    if (geoXmlDoc.placemarks[
                        i].polygon) {
                        if (
                            currentBounds
                            .intersects(
                                geoXmlDoc
                                .placemarks[
                                    i].polygon
                                .bounds
                            )) {
                            makeSidebarPolygonEntry(
                                i);
                        }
                    }
                    if (geoXmlDoc.placemarks[
                        i].polyline) {
                        if (
                            currentBounds
                            .intersects(
                                geoXmlDoc
                                .placemarks[
                                    i].polyline
                                .bounds
                            )) {
                            makeSidebarPolylineEntry(
                                i);
                        }
                    }
                    if (geoXmlDoc.placemarks[
                        i].marker) {
                        if (
                            currentBounds
                            .contains(
                                geoXmlDoc
                                .placemarks[
                                    i].marker
                                .getPosition()
                            )) {
                            makeSidebarEntry(
                                i);
                        }
                    }
                }
            }
            sidebarHtml += "</table>";
            document.getElementById(
                "sidebar")
                .innerHTML =
                sidebarHtml;
        }

        function useTheData(doc) {
            var currentBounds = map.getBounds();
            if (!currentBounds)
                currentBounds = new google
                    .maps.LatLngBounds();
            // Geodata handling goes here, using JSON properties of the doc object
            sidebarHtml =
                '<table><tr><td><a href="javascript:showAll();">Show All</a></td></tr>';
            //  var sidebarHtml = '<table>';
            geoXmlDoc = doc[0];
            for (var i = 0; i <
                geoXmlDoc.placemarks.length; i++
            ) {
                // console.log(doc[0].markers[i].title);
                var placemark = geoXmlDoc.placemarks[i];

                if (placemark.polygon) {
                    placemark.polygon.title = placemark.name;
                    tooltip.addMarker(placemark.polygon);

                    google.maps.event.addListener(placemark.polygon, "click",
                            onClickOnPolygon);

                    if (currentBounds.intersects(
                        placemark.polygon
                        .bounds)) {
                        makeSidebarPolygonEntry(
                            i);
                    }
                    var normalStyle = {
                        strokeColor: placemark
                            .polygon.get(
                                'strokeColor'
                        ),
                        strokeWeight: placemark
                            .polygon.get(
                                'strokeWeight'
                        ),
                        strokeOpacity: placemark
                            .polygon.get(
                                'strokeOpacity'
                        ),
                        fillColor: placemark
                            .polygon.get(
                                'fillColor'
                        ),
                        fillOpacity: placemark
                            .polygon.get(
                                'fillOpacity'
                        )
                    };
                    placemark.polygon.normalStyle =
                        normalStyle;

                    highlightPoly(
                        placemark.polygon,
                        i);
                }
                if (placemark.polyline) {
                    if (currentBounds.intersects(
                        placemark.polyline
                        .bounds)) {
                        makeSidebarPolylineEntry(
                            i);
                    }
                    var normalStyle = {
                        strokeColor: placemark
                            .polyline.get(
                                'strokeColor'
                        ),
                        strokeWeight: placemark
                            .polyline.get(
                                'strokeWeight'
                        ),
                        strokeOpacity: placemark
                            .polyline.get(
                                'strokeOpacity'
                        )
                    };
                    placemark.polyline.normalStyle =
                        normalStyle;

                    highlightPoly(
                        placemark.polyline,
                        i);
                }
                if (placemark.marker) {
                    if (currentBounds.contains(
                        placemark.marker
                        .getPosition()
                    )) {
                        makeSidebarEntry(
                            i);
                    }
                }

                /*    doc[0].markers[i].setVisible(false); */
            }
            sidebarHtml += "</table>";
            document.getElementById(
                "sidebar")
                .innerHTML =
                sidebarHtml;
        };

        function hide_kml() {

            geoXml.hideDocument();

        }

        function unhide_kml() {

            geoXml.showDocument();

        }

        function reload_kml() {
            geoXml.hideDocument();
            delete geoXml;
            geoXml = new geoXML3.parser({
                map: map,
                singleInfoWindow: true,
                afterParse: useTheData
            });
            geoXml.parse(filename);

        }

        function hide_markers_kml() {
            for (var i = 0; i < geoXmlDoc.markers.length; i++) {
                geoXmlDoc.markers[i].setVisible(
                    false);
            }
        }

        function unhide_markers_kml() {
            for (var i = 0; i < geoXmlDoc.markers.length; i++) {
                geoXmlDoc.markers[i].setVisible(
                    true);
            }
        }

        function hide_polys_kml() {
            for (var i = 0; i < geoXmlDoc.gpolylines.length; i++) {
                geoXmlDoc.gpolylines[i]
                    .setMap(null);
            }
        }

        function unhide_polys_kml() {
            for (var i = 0; i < geoXmlDoc.gpolylines.length; i++) {
                geoXmlDoc.gpolylines[i]
                    .setMap(map);
            }
        }

        function load_kmlLayer() {
            kmlLayer = new google.maps.KmlLayer(
                filename, {
                    preserveViewport: !
                        myGeoXml3Zoom
                });
            google.maps.event.addListener(
                kmlLayer,
                "status_changed",
                function () {
                    document.getElementById(
                        'kmlstatus')
                        .innerHTML =
                        "Kml Status:" +
                        kmlLayer.getStatus();
                });
            kmlLayer.setMap(map);
        }