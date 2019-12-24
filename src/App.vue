
<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--左侧导航-->
   <!-- <leftNav></leftNav>-->
    <!--操作区域-->
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import leftNav from '@/components/common/leftNav'   //把leftNav组件放到模板中，先用import在App.vue中引入leftNav组件
export default {
  name: 'App',
  components:{ //引入后在vue的构造器里添加components属性，并放入我们的leftNav组件。
      leftNav
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 20px;
 /* margin-top: 60px;*/
}
html,body,*{
  margin: 0;
  padding: 0;
}
</style>
