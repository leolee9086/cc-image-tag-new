<template>
  <el-select
    :aria-label="`[一般概念]和[属于]是最基本的预设,不包含任何值.
    每次刷新之后会重置.
    但是可以用于批量更改属性`"
    size="mini"
    v-model="预设名"
    @focus="获取预设()"
  >
    <el-option
      v-for="(预设, i) in 预设列表"
      :key="预设.id"
      :label="预设.name"
      :value="预设.name"
    ></el-option>
  </el-select>
</template>
<script>
module.exports = {
  name: "cc-presets-selector",
  props: ["数据id", "数据表名", "value"],
  model: { prop: "value", event: "change" },
  data() {
    return {
      当前数据: {},
      当前预设: {},
      预设表名: "",
      预设名: {},
      预设列表: [],
    };
  },
  async mounted() {
    await this.初始化();
    this.$事件总线.$on("改变数据预设", (数据, 预设名) => this.判断id(数据, 预设名));
  },
  methods: {
    判断id: function (数据, 预设名) {
      // console.log("aaa", 数据, 预设名);
      if (数据.id == this.数据id && 预设名 != this.预设名) {
        this.预设名 = 预设名;
        this.应用预设();
      }
    },
    获取预设: async function () {
      let 预设表名 = this.数据表名.replace("s", "presets");
      // console.log(预设表名);
      if (预设表名) {
        this.预设列表 = await this.$获取预设表(预设表名);
        // console.log(this.预设列表);
        if (this.预设名) {
          this.预设 = await this.$获取预设(预设表名, this.预设名);
        }
      }
    },
    初始化: async function () {
      if (!this.$数据库[this.数据表名]) {
        return;
      }
      this.当前数据 = await this.$数据库[this.数据表名].get(this.数据id);
      this.预设名 = this.当前数据.subtype;
      this.当前数据.type == "card"
        ? (this.$当前窗口状态.current_cardpreset_name = this.预设名 || "一般概念")
        : (this.$当前窗口状态.current_linkpreset_name = this.预设名 || "属于");
      this.预设表名 = this.数据表名.replace("s", "presets");
      // console.log(this.预设表名);
      this.预设列表 = await this.$数据库[this.预设表名].toArray();
      // console.log(this.预设列表);
      this.当前预设 = await this.$获取预设(this.预设表名, this.预设名);
    },
    应用预设: function () {
      this.当前数据.type == "card"
        ? (this.$当前窗口状态.current_cardpreset_name = this.预设名 || "一般概念")
        : (this.$当前窗口状态.current_linkpreset_name = this.预设名 || "属于");
      this.$事件总线.$emit("改变数据预设", this.当前数据, this.预设名);
    },
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) {
          this.预设名 = val;
        }
      },
      immediate: true,
    },

    数据id: {
      handler: async function (val) {
        val ? await this.初始化() : null;
      },
      immediate: true,
    },
    预设名: function (val) {
      if (!this.预设表名) {
        return null;
      }
      this.$emit("change", val);
      if (val !== this.当前数据.subtype && this.当前数据.id == this.数据id) {
        this.应用预设();
      }
    },
  },
};
</script>
