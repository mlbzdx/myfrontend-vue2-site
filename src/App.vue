<template>
  <div class="app-container">
    App组件
    <div>组件测试：</div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
@import "~@/styles/global.less";
.app-container {
  overflow: scroll;
  height: 100vh;
}
</style>
