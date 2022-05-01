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
          @click="当前面板名 != '预设' ? (当前面板名 = '预设') : (当前面板名 = '')"
          circle
          class="el-icon-s-check"
          aria-label="展开|关闭面板"
        >
        </span>
      </div>

      <div class="drawer-button">
        <span
          @click="
            当前面板名 != '画板设置' ? (当前面板名 = '画板设置') : (当前面板名 = '')
          "
          circle
          class="el-icon-data-board"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="
            当前面板名 != '全局设置' ? (当前面板名 = '全局设置') : (当前面板名 = '')
          "
          circle
          class="el-icon-setting"
          aria-label="展开|关闭面板"
        ></span>
      </div>
      <div class="drawer-button">
        <span
          @click="显示帮助 = true"
          circle
          class="el-icon-question"
          aria-label="展开|关闭面板"
        ></span>
      </div>
    </div>
    <cc-toolbar-main
      :思源伺服ip="思源伺服ip"
      :卡片数据id="当前卡片数据id"
      :链接数据id="当前链接数据id"
    ></cc-toolbar-main>
    <cc-toolbar-draw> </cc-toolbar-draw>

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
    <cc-toolbar-presets :显示="当前面板名 == '预设'"> </cc-toolbar-presets>
    <cc-toolbar-boards :显示="当前面板名 == '全局设置'"> </cc-toolbar-boards>
    <cc-toolbar-view></cc-toolbar-view>
    <cc-sydoc-searcherdialog
      :思源伺服ip="思源伺服ip"
      :apitoken="''"
    ></cc-sydoc-searcherdialog>
    <el-dialog title="帮助" :visible.sync="显示帮助" width="80%" height="80%" top="10">
      <iframe
        ref="siyuanEditor"
        :src="`/widgets/cc-image-tag-new/?baseid=20131111000000-lpanybz`"
        data-src=""
        border="0"
        :fullscreen="true"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        :style="`margin: 0%; padding: 0%; width: 100%; height: 90vh;`"
      ></iframe>
    </el-dialog>
  </div>
</template>
<script>
module.exports = {
  name: "cc-layers-toolbar",
  props: ["思源伺服ip", "卡片数组", "链接数组"],
  data() {
    return {
      显示帮助: false,
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
        //  //console.log("当前卡片", that.当前卡片数据id);
        //  //console.log("当前链接", that.当前链接数据id);
      },
    },
    当前链接数据id: {
      handler: function (val) {
        if (val) {
          // //console.log(val);
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
          // //console.log(val);

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
