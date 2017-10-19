/**
 * Created by limei on 2017/10/12.
 */
//测距marker
export function createMeasureMarker() {
  var el = document.createElement('div');
  el.id = 'close_marker';
  el.style["background-image"] = "url(\'../../static/images/close_marker.png\')";
  el.style["background-size"] = "cover";
  el.style.width = "10px";
  el.style.height = "10px";
  el.style.position = "absolute";
  el.style.cursor = "pointer";
  return el;
}

//添加point标注标记
export function createPointMarker(type) {
  var el = document.createElement('div');
  el.id = 'close_marker';
  el.style["background-image"] = type===1 ? "url(\'../../static/images/point.png\')" : "url(\'../../static/images/pos_icon.png\')";
  el.style["background-size"] = "cover";
  el.style.width = "30px";
  el.style.height = "30px";
  el.style.position = "absolute";
  el.style.cursor = "pointer";
  return el;
}

//添加起终点marker
export function createStartEndMarker(type) {
  var el = document.createElement('div');
  el.style["background-image"] = "url(\'../../static/images/markers-point.png\')";
  el.id = "mapMarker";
  el.style.width = "25px";
  el.style.height = "40px";
  el.style.position = "absolute";
  el.style.cursor = "pointer";
  if(type === 'start'){
    el.style["background-position"] = "-200px -138px";
  }else{
    el.style["background-position"] = "-225px -138px";
  }
  return el;
}
