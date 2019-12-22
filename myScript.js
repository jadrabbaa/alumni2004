
mapboxgl.accessToken =
  "pk.eyJ1IjoiamFkcmFiYmFhIiwiYSI6ImNrNGd1MHIxeTBydXYzcnBvdWhueGdvMzAifQ._gYV2v-LPlG6-t0Doj7O_w";
var map = new mapboxgl.Map({
  container: "map",
 style:"mapbox://styles/jadrabbaa/ck4gpw6dd1j7o1cplgfsrme1x",
 center: [30, 18],
 zoom: 1.8,
});

var years = [
  "1989",
  "1990",
  "1991",
  "1992",
  "1993",
  "1994",
  "1995",
  "1996",
  "1997",
  "1998",
  "1999",
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
];


function filterBy(year) {
  var filters = ["==", "year", year];
  map.setFilter("earthquake-circles", filters);
  map.setFilter("earthquake-labels", filters);

  // Set the label to the year
  document.getElementById("year").textContent = years[year];
}



map.on("load", function() {
  // Data courtesy of http://earthquake.usgs.gov/
  // Query for significant earthquakes in 2015 URL request looked like this:
  // http://earthquake.usgs.gov/fdsnws/event/1/query
  //    ?format=geojson
  //    &starttime=2015-01-01
  //    &endtime=2015-12-31
  //    &minmagnitude=6'
  //
  // Here we're using d3 to help us make the ajax request but you can use
  // Any request method (library or otherwise) you wish.
  d3.json(
    "https://docs.mapbox.com/mapbox-gl-js/assets/significant-earthquakes-2015.geojson",
    function(err, data) {
      if (err) throw err;

      // Create a year property value based on time
      // used to filter against.
      data.features = data.features.map(function(d) {
        d.properties.year = new Date(d.properties.time).getYear();
        return d;
      });

      map.addSource("earthquakes", {
        type: "geojson",
        data: data
      });

      map.addLayer({
        id: "earthquake-circles",
        type: "circle",
        source: "earthquakes",
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            6,
            "#FCA107",
            8,
            "#7F3121"
          ],
          "circle-opacity": 0.75,
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            6,
            20,
            8,
            40
          ]
        }
      });

      map.addLayer({
        id: "earthquake-labels",
        type: "symbol",
        source: "earthquakes",
        layout: {
          "text-field": ["concat", ["to-string", ["get", "mag"]], "m"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12
        },
        paint: {
          "text-color": "rgba(0,0,0,0.5)"
        }
      });

      // Set filter to first year of the year
      // 0 = January
      filterBy(0);

      document.getElementById("slider").addEventListener("input", function(e) {
        var year = parseInt(e.target.value, 10);
        filterBy(year);
      });
    }
  );
});
