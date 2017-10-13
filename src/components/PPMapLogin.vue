<template>
  <div class="login-box">
    <div class="login-img"></div>
    <div class="login-content big-font">
      <span class="close-btn" @click="closeResponse"></span>
      <div class="tabs">
        <span @click="userResponse('login')" :class="[opType==='login'?'active':'']">用户登录</span>
        <span  @click="userResponse('reg')" :class="[opType==='reg'?'active':'']">用户注册</span>
      </div>
      <div class="form-box">
        <div style="margin-top: 80px;" v-if="opType==='login'">
          <div class="form-group">
            <div class="form-item uname">
              <input type="text" class="input-item big-font" placeholder="用户名" v-model="log_userInfo.userName">
            </div>
          </div>
          <div class="form-group">
            <div class="form-item upwd">
              <input type="password" class="input-item big-font" placeholder="密码" v-model="log_userInfo.passWord" @keyup.enter="loginResponse">
            </div>
          </div>
          <div class="form-group">
            <button class="btn big-font" @click="loginResponse">登录</button>
          </div>
        </div>
        <div style="margin-top: 40px;" v-if="opType==='reg'">
          <div class="form-group">
            <div class="form-item uname">
              <input type="text" class="input-item big-font" placeholder="用户名" v-model="reg_userInfo.userName">
            </div>
          </div>
          <div class="form-group">
            <div class="form-item upwd">
              <input type="password" class="input-item big-font" placeholder="密码" v-model="reg_userInfo.passWord">
            </div>
          </div>
          <div class="form-group">
            <div class="form-item upwd">
              <input type="password" class="input-item big-font" placeholder="重复密码" v-model="reg_userInfo.passWord_r" @keyup.enter="registerResponse">
            </div>
          </div>
          <div class="form-group">
            <button class="btn big-font" @click="registerResponse">注册</button>
          </div>
        </div>
        <div class="error-box" v-if="hasError">
          <span v-if="errorType==='login_error'">* 请核对用户名或密码</span>
          <span v-if="errorType==='pwd_error'">* 密码不一致</span>
          <span v-if="errorType==='reg_error'">* 注册失败</span>
          <span v-if="errorType==='request_error'">* 请完整填写用户名和密码</span>
        </div>
        <div class="success-box" v-if="hasMsg">
          <span v-if="msgType==='login_success'">登录成功</span>
          <span v-if="msgType==='reg_success'">注册成功</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as globals from '../globals'
  import {mapGetters, mapActions, mapState} from 'vuex'
  import LoginController from '../controller/login_controller'
  export default {
    name: 'PPMapLogin',
    data () {
      return {
        opType: 'login',
        log_userInfo:{
          userName:'',
          passWord:''
        },
        reg_userInfo:{
          userName:'',
          passWord:'',
          passWord_r:''
        },
        hasError:false,
        errorType:'login_error',

        hasMsg:false,
        msgType:'login_success'
      }
    },
    mounted(){
      this.controller = new LoginController(this);
    },
    methods:{
      userResponse(type){
        this.opType = type;
        this.hasError = false;   //清空错误提示
        this.hasMsg = false;   //清空成功提示
      },
      closeResponse(){
        this.$emit('loginShow',false)
      },
      registerResponse(){
        this.hasError = false;   //清空错误提示
        this.hasMsg = false;   //清空成功提示
        let uname = this.reg_userInfo.userName;
        let upwd = this.reg_userInfo.passWord;
        let upwd2 = this.reg_userInfo.passWord_r;
        if (uname && upwd && upwd2) {
          if(upwd === upwd2){
            this.controller.userRegisterResonse();
          }else{
            this.hasError = true;
            this.errorType = 'pwd_error';
          }
        }else{
          this.hasError = true;
          this.errorType = 'request_error';
        }
      },
      loginResponse(){
        let uname = this.log_userInfo.userName;
        let upwd = this.log_userInfo.passWord;
        if (uname && upwd) {
          this.controller.userLoginResonse();
        }else{
          this.hasError = true;
          this.errorType = 'request_error';
        }
      },
    }
  }
</script>

<style>
  .login-box {
    width: 100%;
    height: 100%;
  }

  .close-btn{
    position: absolute;
    top: 10px;
    right: 10px;
    width: 25px;
    height: 25px;
    background: url("../../static/images/close.png") no-repeat center;
    cursor: pointer;
  }
  .close-btn:hover{
    background-image: url("../../static/images/close2.png");
  }

  .login-img {
    float: left;
    width: 237px;
    height: 350px;
    background: url("../../static/images/login.png") no-repeat center;
  }

  .login-content {
    float: left;
    width: 413px;
    height: 350px;
    background-color: #fff;
    position: relative;
  }

  .tabs{
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .tabs > span{
    color: #666;
    cursor: pointer;
    margin-left: 10px;
  }

  .tabs > span:hover,.tabs > span.active{
    color: #3b81ff;
  }
  .form-box{
    position: absolute;
    top: 50px;
    left: 60px;
    width: 310px;
    height: 300px;
  }
  .form-group{
    margin-bottom: 20px;
  }
  .form-item{
    width: 280px;
    height: 37px;
    line-height: 37px;
    padding-left: 30px;
    background-repeat: no-repeat;
    background-position: left center;
  }
  .form-item.uname{
    background-image: url("../../static/images/yhdl.png");
  }
  .form-item.upwd{
    background-image: url("../../static/images/mima.png");
  }
  .input-item{
    width: 250px;
    height: 24px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    border-style: none none solid none;
    border-color: #ccc;
    border-width: 1px;
    outline: 0;
  }

  .btn{
    width: 274px;
    margin-left: 30px;
    background-color: #9c0;
    color: #fff;
    padding: 6px 12px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
    transition: all ease .5s;
  }
  .btn:hover{
    background-color: #8dbe00;
    transition: all ease .5s;
  }
  .error-box{
    text-align: center;
    font-size: 13px;
    color: #f0004e;
  }
  .success-box{
    text-align: center;
    font-size: 13px;
    color: #119e25;
  }
</style>
