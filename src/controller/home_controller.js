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
        console.log(response);
      }, response => {
        // error callback
      });
    /*$.ajax({
     url: preStyle + '?token=' + globals.MAP_ACCESS_TOKEN,
     //url: 'http://minedata.cn/service/solu/' + that.cur_solution + '?token=' + globals.MAP_ACCESS_TOKEN,
     dataType: "json",
     success: function (data) {
     if (data.data.rows[0].layers) {
     let arr = data.data.rows[0].layers
     let idarr = []
     for (let i = 0; i < arr.length; i++) {
     let content = JSON.parse(arr[i].content || '{}')
     if (content['source'] === 'Traffic' && content['source-layer'] === 'Trafficrtic') {
     that.trafficArr.push(arr[i].id)
     that.map.setLayoutProperty(arr[i].id, 'visibility', 'none');
     }
     }
     }
     },
     error: function (XMLHttpRequest, textStatus, errorThrown) {
     console.log(XMLHttpRequest)
     console.log(textStatus)
     console.log(errorThrown)
     }
     });*/
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
          console.log(response);
        });
  }

}

export default HomeController
