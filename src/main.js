document.addEventListener('DOMContentLoaded', () => {  

  // 主要參考文件：https://leafletjs.com/examples/quick-start/
  let center = [24.9983469, 121.5810358]; // 預設中心點為台北市動物園

  // 跟使用者要位置
  function successGPS(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    center = [lat, lng];
    triggerLeaflet()
  };
  function errorGPS() {
    window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 台北市動物園');
    triggerLeaflet()
  }

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
  } else {
    window.alert('您的裝置不具備GPS，無法使用此功能');
    triggerLeaflet()
  }

  // 執行 Leaflet
  function triggerLeaflet() {

    // *** 放置地圖
    const map = L.map('map', {
      center: center,
      zoom: 17, // 0-18
      attributionControl: true, // 是否秀出 leaflet
      zoomControl: true , // 是否秀出 - + 按鈕
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);



    // *** 放置標記 + 客製標記
    // 客製標記 https://leafletjs.com/reference-1.7.1.html#icon
    const customIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/universal-7/614/17_-_Location-256.png',
      iconSize: [42, 42],
    });
    const marker = L.marker(center, {
      icon: customIcon,
      title: '跟 <a> 的 title 一樣', // 跟 <a> 的 title 一樣
      opacity: 1.0
    }).addTo(map);


    // 放置 markers
    const btnPutMarkers = document.getElementById('put-markers');
    btnPutMarkers.addEventListener('click', e => {
      e.preventDefault();
      for(let i = 0; i < 10; i++) {
        let lng_first = center[1] + (0.0005 * i);
        let location = [ center[0], lng_first ];
        let marker = L.marker(location, { icon: customIcon }).addTo(map);
      }
      e.target.classList.add('disabled')
    })



    // *** 標記上放泡泡
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();



    // *** 標記上放 tooltip
    marker.bindTooltip("my tooltip text", {
      direction: 'bottom', // right、left、top、bottom、center。default: auto
      sticky: true, // true 跟著滑鼠移動。default: false
      permanent: false, // 是滑鼠移過才出現，還是一直出現
      opacity: 1.0
    }).openTooltip();



    // *** map click 事件
    const popup = L.popup();
    function onMapClick(e) {
      let lat = e.latlng.lat; // 緯度
      let lng = e.latlng.lng; // 經度
      popup
        .setLatLng(e.latlng)
        .setContent(`緯度：${lat}<br/>經度：${lng}`)
        .openOn(map);
    }
    map.on('click', onMapClick);



    // *** */ zoom in, zoom out
    zoomIn(map);
    zoomOut(map);



    // *** 使用其它圖層（新增在地圖內）
    // 圖層來源：https://leaflet-extras.github.io/leaflet-providers/preview/
    // 使用來源：https://stackoverflow.com/questions/33759578/how-to-change-base-layer-using-js-and-leaflet-layers-control
    var baselayers = {
      'OpenStreetMap.Mapnik': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      'OpenStreetMap.DE': L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'),
      'OpenStreetMap.CH': L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png'),
      'OpenStreetMap.France':  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'),
      'OpenStreetMap.HOT': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'),
      'OpenStreetMap.BZH': L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png'),
      'OpenTopoMap': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
      'Stadia.AlidadeSmooth': L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'),
      'Stadia.AlidadeSmoothDark': L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'),
      'Stadia.OSMBright': L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'),
      'Stadia.Outdoors': L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png')
    };
    var overlays = {};
    L.control.layers(baselayers, overlays).addTo(map);
    baselayers['OpenStreetMap.Mapnik'].addTo(map);



    // *** 使用其它圖層（地圖外的按鈕）
    changeLayer(map)
    console.log('dddd')
  }

  // zoom in
  function zoomIn(map) {
    const btnZoom = document.getElementById('zoom-in');
    btnZoom.addEventListener('click', e => {
      e.preventDefault();
      map.zoomIn(1);
    })
  }

  // zoom out
  function zoomOut(map) {
    const btnZoom = document.getElementById('zoom-out');
    btnZoom.addEventListener('click', e => {
      e.preventDefault();
      map.zoomOut(1);
    })
  }

  // 使用其它圖層（地圖外的按鈕）
  function changeLayer(map) {
    const btnLayers = document.querySelectorAll('.js-change-layer');
    Array.prototype.forEach.call(btnLayers, btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        let layer = e.target.dataset.layer; // 取得 data-layer 的值
        L.tileLayer(layer).addTo(map)
      })
    })
  }

})