/**
 * Created by limei on 2017/10/9.
 */
import * as globals from '../globals'
class SearchboxController {
  constructor(_view) {
    this._view = _view
  }

  //获取用户id
  getUserId(){
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      return user.userId;
    }
  }

  //获取标注列表
  getMarkerList(type){
    let userId = this.getUserId();
    let saveType = type === "marker" ? 1 : 2;
    let marker_data = {
      "userId": userId,
      "saveType": saveType
    };
    this._view.$http.post(globals.GETMARKER_DATA_URL,
      JSON.stringify(marker_data),
      {emulateJSON: true})
      .then((response) => {
        response = response.body;
        let markerData = response.data;
        if (type === "marker") {
          this._view.markerList = markerData;
        } else {
          this._view.collectionList = markerData;
        }
      });
  }
}

export default SearchboxController
