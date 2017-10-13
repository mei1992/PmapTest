<template>
  <div id="wrapper">
    <!-- main view -->
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
  </div>
</template>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style: none;
  }

  #wrapper {
    width: 100%;
    height: 100%;
  }
  html, body {
    width: 100%;
    height: 100%;
    font-family: Arial,Helvetica,SimSun,sans-serif;
    font-size: 14px;
    /*font-size: 62.5%;*/
  }
  .big-font{
    font-size: 16px;
  }
  .small-font{
    font-size: 12px;
  }

  a.minemap-ctrl-logo{
    display: none;
  }

  .clearfix {
    display: inline-block;
  }

  .clearfix:after {
    display: block;
    content: ".";
    height: 0;
    line-height: 0;
    clear: both;
    visibility: hidden;
  }

  .shadow-border{
    box-shadow: 1px 2px 1px rgba(0, 0, 0, .15);
  }

  .hidden{
    display: none;
  }

  .fl-list > li{
    float: left;
  }

  .minemap-popup-content{
    border: 1px solid #ddd;
    border-bottom: none;
    padding: 2px 5px;
  }
  h2.pop_title {
    font-size: 14px;
    text-align: left;
    color: #3c3c3c;
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    font-weight: normal;
  }

  .pop_box > span {
    margin-top: 10px;
    float: left;
  }

  .name_input {
    border: 1px solid #bbb;
    border-radius: 2px;
    height: 20px;
    padding: 2px 10px;
    margin-top: 10px;
    width: 170px;
    margin-left: 10px;
  }

  .desc_box {
    border: 1px solid #bbb;
    border-radius: 2px;
    padding: 2px 10px;
    margin-top: 10px;
    width: 170px;
    min-height: 60px;
    margin-left: 10px;
  }
  .minemap-popup-close-button {
    font-size: 20px;
    color: #aaa;
    right: 8px;
  }

  .minemap-popup-close-button:hover {
    background-color: #fff;
    color: #777;
  }

  .pop_box .pop_btn {
    border: 1px solid #b7b4b4;
    border-radius: 3px;
    padding: 5px 12px;
    cursor: pointer;
    margin-right: 3px;
    background-color: #fff;
  }

  .pop_box .pop_btn:hover {
    background-color: #f6f6f6;
  }

  .minemap-ctrl-scale {
    line-height: 10px;
    background-color: transparent;
    font-size: 12px;
    border-color: #999;
    text-align: center;
  }
</style>
