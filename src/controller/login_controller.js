/**
 * Created by limei on 2017/10/9.
 */

import * as globals from '../globals'
class LoginController {
  constructor(_view) {
    this._view = _view
  }

  userRegisterResonse() {
    this._view.$http.post(globals.GETUSERREG_DATA_URL,
      JSON.stringify(this._view.reg_userInfo),
      { emulateJSON: true})
      .then((response) => {
      response = response.body;
      if(response.code === 0){
        this._view.hasMsg = true;
        this._view.msgType = 'reg_success';
        this._view.userResponse('login');
      }else{
        this._view.hasError = true;
        this._view.errorType = 'reg_error';
      }
    });
  }

  userLoginResonse() {
    this._view.$http.post(globals.GETUSERLOGIN_DATA_URL,
      JSON.stringify(this._view.log_userInfo),
      { emulateJSON: true})
      .then((response) => {
        response = response.body;
        if(response.code === 0){
          this._view.hasMsg = true;
          this._view.msgType = 'log_success';
          if (localStorage) {
            localStorage.setItem("user", response.message);
          } else {
            console.log("不支持");
          }
          setTimeout(() => {
            this._view.$emit('loginShow',false);
          },200)
        }else if(response.code === 1){
          this._view.hasError = true;
          this._view.errorType = 'login_error';
        }
      });
  }
}

export default LoginController
