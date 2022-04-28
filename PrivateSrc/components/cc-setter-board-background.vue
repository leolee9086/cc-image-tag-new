<template>
  <div>
    <cc-color-pane v-model="背景色" :自定义颜色数组="自定义颜色数组"></cc-color-pane>
    <el-row>
      <el-col :span="12">
        <cc-assets-selector
          v-model="背景图片源"
          :apitoken="apitoken"
          :思源伺服ip="思源伺服ip"
          :k="背景图片格式"
        ></cc-assets-selector>
      </el-col>
      <el-col :span="12">
        <el-select v-model="背景图片格式" size="mini" allow-create filterable>
          <el-option v-for="格式 in 图片格式列表" :label="格式" :value="格式"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-input v-model="背景图片源" size="mini"></el-input>
    <el-input-number size="mini" v-model="背景图像缩放倍数"></el-input-number>
    <el-switch
      v-model="背景图像模式"
      active-text="重复"
      active-value="重复"
      inactive-value="填充"
    ></el-switch>
  </div>
</template>
<script>
module.exports = {
  name: "cc-setter-board-background",
  props: [],
  data() {
    return {
      背景色: "",
      背景图片源: "",
      背景图像模式: "",
      背景图像缩放倍数: 1,
      自定义颜色数组: [],
      图片格式列表: ["jpg", "png", "svg"],
      背景图片格式: "",
      思源伺服ip: "",
      apitoken: "",
    };
  },
  async mounted() {
    this.思源伺服ip = window.location.host;
    await this.加载数据();

    this.$事件总线.$on("自定义颜色改变", ($event) => (this.自定义颜色数组 = $event));
  },
  methods: {
    加载数据: async function () {
      let that = this;
      try {
        that.背景图片源 = (await that.$数据库.metadata.get("backgroundImage")).value;
      } catch (e) {
        that.背景图片源 = "";
        that.$数据库.metadata.put({ key: "backgroundImage", value: "" });
      }
      try {
        that.自定义颜色数组 = (await that.$数据库.metadata.get("customcolors")).value;
      } catch (e) {
        that.自定义颜色数组 = [];
        that.$数据库.metadata.put({ key: "customcolors", value: [] });
      }
      try {
        that.背景图像缩放倍数 = (
          await that.$数据库.metadata.get("backgroundscale")
        ).value;
      } catch (e) {
        that.背景图像缩放倍数 = 1;

        that.$数据库.metadata.put({ key: "backgroundscale", value: 1 });
      }
      try {
        that.背景图像模式 = (await that.$数据库.metadata.get("backgroundtype")).value;
      } catch (e) {
        that.背景图像模式 = "填充";
        that.$数据库.metadata.put({ key: "backgroundtype", value: "填充" });
      }
    },
  },
  watch: {
    背景色(val) {
      this.$事件总线.$emit("背景色改变", val);
      this.$当前窗口状态.backgroundColor = val;
      this.$数据库.metadata.put({ key: "backgroundColor", value: val });
    },
    自定义颜色数组: {
      handler(val) {
        this.$事件总线.$emit("自定义颜色改变", val);
        this.$数据库.metadata.put({ key: "customcolors", value: val });
        //console.log(val);
      },
      deep: true,
    },
    背景图像模式: function (val) {
      this.$事件总线.$emit("改变背景图像模式", val);
      this.$数据库.metadata.put({ key: "backgroundtype", value: val });
    },
    背景图像缩放倍数: function (val) {
      this.$事件总线.$emit("缩放背景", val);
      this.$数据库.metadata.put({ key: "backgroundscale", value: val });
    },
    背景图片源: function (val) {
      this.$数据库.metadata.put({ key: "backgroundImage", value: val });
    },
  },
};
</script>
