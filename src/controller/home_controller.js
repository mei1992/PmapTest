/**
 * Created by limei on 2017/10/9.
 */

import * as globals from '../globals'
class HomeController {
  constructor(_view) {
    this._view = _view
  }

  /* minemap初始化与方案切换 */
  getMapByDivId(divId, showControl, token, solution, style, type) {
    token = !token ? globals.MAP_ACCESS_TOKEN : token;
    solution = !solution ? globals.MAP_SOLUTION : solution;
    style = !style ? globals.STYLE_PRE_URL + globals.MAP_STYLE_URL : style;

    let mapType = type === "minemap" ? minemap : minemapwmts;
    mapType.accessToken = token;
    mapType.solution = solution;
    mapType.domainUrl = globals.APP_DOMAIN_ROOT;
    //if (type === "minemapwmts") {
    mapType.spriteUrl = globals.MAP_SPRITE_URL;
    mapType.fontsUrl = globals.MAP_FONTS_URL;
    //}

    let map = new mapType.Map({
      container: divId,
      style: style,
      center: globals.MAP_CENTER,
      zoom: globals.MAP_ZOOM,
      pitch: globals.MAP_PITCH,
      minZoom: globals.MAP_MIN_ZOOM,
      maxZoom: globals.MAP_MAX_ZOOM
    });
    map.repaint = true;
    if (typeof showControl === "boolean" && showControl) map.addControl(new mapType.Navigation(), "bottom-right");
    map.setMinZoom(globals.MAP_MIN_ZOOM);
    map.setMaxZoom(globals.MAP_MAX_ZOOM);
    return map;
  }

  /*初始化地图和edit插件*/
  initMapEdit(token, solution, itemStyle, mapType) {
    this._view.map = this._view.controller.getMapByDivId('map', false, token, solution, itemStyle, mapType);
    this._view.map.setCenter([116.46, 39.92]);

    //给地图添加标尺
    this._view.map.addControl(new minemap.Scale(), "bottom-left");

    //初始化地图画图
    this._view.edit = new minemap.edit.init(this._view.map, {
      boxSelect: false,
      touchEnabled: false,
      displayControlsDefault: true,
      showButtons: false,
      keybindings: false
    });

    // 注册edit事件
    this._view.regEvent(this._view.map);
  }

  //隐藏路况
  hideTraffic() {
    this._view.trafficArr = [];
    let preStyle = globals.SERVICE_ADDRESS + 'solu/' + this._view.cur_solution;
    this._view.$http.get(preStyle + '?token=' + globals.MAP_ACCESS_TOKEN)
      .then(response => {
        response = response.body;
        let trafficLayers = response.data.rows[0].layers;
        trafficLayers.map((item) => {
          let content = JSON.parse(item.content || '{}')
          if (content['source'] === 'Traffic' && content['source-layer'] === 'Trafficrtic') {
            this._view.trafficArr.push(item.id)
            this._view.map.setLayoutProperty(item.id, 'visibility', 'none');
          }
        });
        //console.log(response);
      }, response => {
        // error callback
      });
  }

  //显示路况
  showTraffic() {
    for (var i = 0; i < this._view.trafficArr.length; i++) {
      this._view.map.setLayoutProperty(this._view.trafficArr[i], 'visibility', 'visible');
    }
  }

  //获取用户id
  getUserId() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user.userId;
    }
  }

  //加入标注信息
  addToMarkers(geometry, name, desc, type) {
    this._view.userId = this._view.userId ? this._view.userId : this.getUserId();
    let marker_data = {
      "markerName": name,
      "markerContent": desc,
      "userId": this._view.userId,
      "markerGeom": JSON.stringify(geometry),
      "markerType": type,
      "saveType": 1
    };

    this._view.$http.post(globals.INSERTMARKER_DATA_URL,
      JSON.stringify(marker_data),
      {emulateJSON: true})
      .then((response) => {
          response = response.body;
          //console.log(response);
        });
  }

  //规划路径
  routePlan(_this_,index,startPoi,endPoi){
    let start_lngLat = startPoi.geom ? startPoi.geom.coordinates : startPoi.coordinates;
    let end_lngLat = endPoi.geom ? endPoi.geom.coordinates : endPoi.coordinates;

    this._view.$http.get(globals.SERVICE_ADDRESS + "route/driving?&token=5f00971168e04aa1b299a4da98fe57d9&sPoint= "
      + [start_lngLat[0],start_lngLat[1]] + "&ePoint=" + [end_lngLat[0],end_lngLat[1]] + "&shpFlag=10487&costModel=37&numAlt=1&source=37&traffic=1")
      .then(response => {
        let routeData = response.body.data;
        _this_.rows = routeData.rows[index];
        _this_.totalSignal = _this_.rows.signal;
        _this_.segmts = routeData.rows[index].segmt;
        for (var i = 0; i < _this_.segmts.length; i++) {
          if (_this_.segmts[i].roadName && _this_.roadNames.length < 3) {
            if (_this_.roadNames.indexOf(_this_.segmts[i].roadName[1]) === -1) {
              _this_.roadNames.push(_this_.segmts[i].roadName[1])
            }
          }
        }
        let time = Math.ceil(_this_.rows.duration.duration / 60);
        let hour = parseInt(time / 60);
        let minut = time - (hour * 60);
        if (time >= 60) {
          _this_.totalTime = hour + '小时' + minut + '分钟'
        } else {
          _this_.totalTime = time + '分钟'
        }

        _this_.totalDist = _this_.rows.distsum.dist;
        var len = _this_.rows.segmt.length - 1;
        var coordinatesArr = [{
          type: 'Feature',
          geometry: _this_.rows.segmt[0].clist.geometry,
          properties: {
            color: '#5298FF'
          }
        }, {
          type: 'Feature',
          geometry: _this_.rows.segmt[len].clist.geometry,
          properties: {
            color: '#5298FF'
          }
        }];
        for (var j = 1; j < len; j++) {
          coordinatesArr.push({
            type: 'Feature',
            geometry: _this_.rows.segmt[j].clist.geometry,
            properties: {
              color: function () {
                var traffic = _this_.rows.segmt[j].clisttraffic.features[0].properties.traffic;
                if (traffic == 1) {
                  return '#17bf00';
                } else if (traffic == 2) {
                  return '#ff9f19'
                } else {
                  return '#f23030'
                }
              }()
            }
          })

        }
        if (this._view.map.getSource("lineSource")) {
          this._view.map.removeLayer('lines');
          this._view.map.removeSource('lineSource');
        }
        this._view.map.addSource("lineSource", {
          "type": "geojson",
          'data': {
            type: 'FeatureCollection',
            features: coordinatesArr
          }
        });
        this._view.map.addLayer({
          "id": "lines",
          "type": "line",
          "source": "lineSource",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            'line-width': 6,
            'line-color': {
              'type': 'identity',
              'property': 'color'
            }
          }
        });
      });
    _this_.routeShow = true;

  }

}

export default HomeController
