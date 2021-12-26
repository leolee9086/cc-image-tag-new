<template>
  <div class="layout">
    <div class="drawer-button-container">
      <el-button @click="显示详情面板 = !显示详情面板" circle icon="el-icon-edit">
      </el-button>
    </div>
    <cc-toolbar-main
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-main>
    <cc-toolbar-infor
      :显示="显示详情面板"
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-infor>
    <cc-toolbar-view></cc-toolbar-view>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-toolbar",
  props: ["思源伺服ip"],
  components: {
    "cc-toolbar-main": "url:../components/cc-toolbar-main.vue",
    "cc-toolbar-infor": "url:../components/cc-toolbar-infor.vue",
    "cc-toolbar-view": "url:../components/cc-toolbar-view.vue",
  },
  data() {
    return {
      窗口状态数组: [],
      操作历史数组: [],
      当前卡片数据id: "",
      当前链接数据id: "",
      窗口状态获取器: {},
      操作历史获取器: {},
      最近窗口状态: {},
      数据获取器: "",
      当前数据: "",
      /*操作面板显示*/
      显示详情面板: false,
    };
  },
  mounted() {
    this.窗口状态获取器 = liveQuery(() => this.$数据库.states.toArray()).subscribe({
      next: (result) => {
        result ? (this.窗口状态数组 = result) : null;
      },
    });
  },
  watch: {
    窗口状态数组: {
      handler: function (val, oldval) {
        let that = this;
        let 最近窗口状态 = val[val.length - 1];
        if (最近窗口状态) {
          that.当前卡片数据id = 最近窗口状态["current_cardid"] + "";
          that.当前链接数据id = 最近窗口状态["current_linkid"] + "";
        } else {
          that.当前卡片数据id = "";
          that.当前链接数据id = "";
        }
        //  console.log("当前卡片", that.当前卡片数据id);
        //  console.log("当前链接", that.当前链接数据id);
      },
    },
    当前链接数据id: {
      handler: function (val) {
        if (val) {
          // console.log(val);
          this.数据获取器 = liveQuery(() => this.$数据库.links.get(val)).subscribe({
            next: (result) => {
              result ? (this.当前数据 = result) : null;
            },
          });
        }
      },
    },
    当前卡片数据id: {
      handler: function (val) {
        if (val) {
          // console.log(val);

          this.数据获取器 = liveQuery(() => this.$数据库.cards.get(val)).subscribe({
            next: (result) => {
              result ? (this.当前数据 = result) : null;
            },
          });
        }
      },
    },
  },
};
</script>
<style scoped>
.front {
  z-index: 300;
}
</style>
