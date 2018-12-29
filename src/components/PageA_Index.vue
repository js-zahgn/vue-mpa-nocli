<template>
  <div id="abc">
      pageA chance
    <div @click="gotoBBBBB">{{msg}}</div>
  </div>
</template>

<script>
import '../css/test.css';
import '../css/tests.less';
export default {
    data () {
        return {
            msg: "点击跳转pageB"
        }
    },
    methods: {
        gotoBBBBB: function() {
            window.location.href = "./pageB.html";
        }
    }
}
</script>
<style lang="less" scoped>
#abc{
    background-color: red
}
</style>
