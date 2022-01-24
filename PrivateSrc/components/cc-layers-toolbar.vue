<template>
  <div class="layout">
    <div class="drawer-button-container right">
      <div class="drawer-button">
        <span
          @click="当前面板名 != '详情' ? (当前面板名 = '详情') : (当前面板名 = '')"
          circle
          class="el-icon-postcard"
          aria-label="展开|关闭面板"
        >
        </span>
      </div>
      <div class="drawer-button">
        <span
          @click="当前面板名 != '历史' ? (当前面板名 = '历史') : (当前面板名 = '')"
          circle
          class="el-icon-time"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="当前面板名 != '连接' ? (当前面板名 = '连接') : (当前面板名 = '')"
          circle
          class="el-icon-link"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="
            当前面板名 != '图上连接' ? (当前面板名 = '图上连接') : (当前面板名 = '')
          "
          circle
          class="el-icon-share"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="
            当前面板名 != '画板设置' ? (当前面板名 = '画板设置') : (当前面板名 = '')
          "
          circle
          class="el-icon-setting"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="
            当前面板名 != '画板列表' ? (当前面板名 = '画板列表') : (当前面板名 = '')
          "
          circle
          class="el-icon-data-board"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="当前面板名 != '预设' ? (当前面板名 = '预设') : (当前面板名 = '')"
          circle
          class="el-icon-s-check"
          aria-label="展开|关闭面板"
        >
        </span>
      </div>
       <div class="drawer-button">
        <span
          @click="当前面板名 != '绘制' ? (当前面板名 = '绘制') : (当前面板名 = '')"
          circle
          class="el-icon-edit"
          aria-label="展开|关闭面板"
        >
        </span>
      </div>
    </div>
    <cc-toolbar-main
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-main>
    <cc-toolbar-infor
      :显示="当前面板名 == '详情'"
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-infor>
    
    <cc-toolbar-history :显示="当前面板名 == '历史'"> </cc-toolbar-history>
    <cc-toolbar-link :显示="当前面板名 == '图上连接'"> </cc-toolbar-link>
    <cc-toolbar-ref :显示="当前面板名 == '连接'"> </cc-toolbar-ref>
    <cc-toolbar-set :显示="当前面板名 == '画板设置'"> </cc-toolbar-set>
    <cc-toolbar-draw :显示="当前面板名 == '绘制'"> </cc-toolbar-draw>
    <cc-toolbar-presets :显示="当前面板名 == '预设'"> </cc-toolbar-presets>

    <cc-toolbar-view></cc-toolbar-view>
    <cc-sydoc-searcher :思源伺服ip="思源伺服ip" :apitoken="''"></cc-sydoc-searcher>
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
      /*操作面板显示*/
      显示详情面板: false,
      当前面板名: "",
      面板位置设定: {
        leftTop: {},
        leftBottom: {},
        rightTop: {},
        rightBootom: {},
      },
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
