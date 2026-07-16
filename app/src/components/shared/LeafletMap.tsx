import React, { useRef, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

interface LeafletMapProps {
  markers: MarkerData[];
  centerLat: number;
  centerLng: number;
  onMarkerPress?: (id: string) => void;
  style?: any;
}

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { height: 100%; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [CENTER_LAT, CENTER_LNG],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    var userIcon = L.divIcon({
      html: '<div style="background:#06B6D4;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 8px rgba(6,182,212,0.8);"></div>',
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([CENTER_LAT, CENTER_LNG], { icon: userIcon })
      .addTo(map)
      .bindPopup('You are here');

    var clubIcon = L.divIcon({
      html: '<div style="background:#7C3AED;width:28px;height:28px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 12px rgba(124,58,237,0.6);display:flex;align-items:center;justify-content:center;font-size:14px;">🎮</div>',
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    var markers = {MARKERS_JSON};
    markers.forEach(function(m) {
      var marker = L.marker([m.lat, m.lng], { icon: clubIcon })
        .addTo(map)
        .bindPopup('<b>' + m.name + '</b>' + (m.address ? '<br>' + m.address : ''));
      marker.on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', id: m.id }));
      });
    });
  </script>
</body>
</html>
`;

export function LeafletMap({ markers, centerLat, centerLng, onMarkerPress, style }: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);

  const html = MAP_HTML
    .replace("CENTER_LAT", String(centerLat))
    .replace("CENTER_LNG", String(centerLng))
    .replace("MARKERS_JSON", JSON.stringify(markers.map(m => ({ id: m.id, name: m.name, address: m.address, lat: m.lat, lng: m.lng }))));

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "markerPress" && onMarkerPress) {
        onMarkerPress(data.id);
      }
    } catch {}
  }, [onMarkerPress]);

  return (
    <View style={[{ flex: 1 }, style]}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={StyleSheet.absoluteFill}
        scrollEnabled={false}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}
