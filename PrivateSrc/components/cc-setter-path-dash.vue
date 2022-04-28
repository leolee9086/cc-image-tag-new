<template>
  <div>
    <el-switch v-model="使用虚线" active-text="使用虚线"></el-switch>
    <template v-if="使用虚线">
      <el-row v-for="(长度, i) in 虚线定义数组">
        <span v-if="(i & 1) != 1">线段:</span>
        <span v-if="(i & 1) == 1">间隙:</span>
        <el-input-number size="mini" v-model="虚线定义数组[i]"> </el-input-number>
        <el-button
          size="mini"
          @click="虚线定义数组.splice(i, 1)"
          icon="el-icon-minus"
          circle
        ></el-button>
      </el-row>
      <el-button
        size="mini"
        @click="虚线定义数组.push(10)"
        icon="el-icon-plus"
        circle
      ></el-button>
    </template>
  </div>
</template>
<script>
module.exports = {
  name: "cc-setter-path-dash",
  props: ["链接"],
  data() {
    return {
      当前对象数据: {},
      虚线定义数组: [10, 10],
      使用虚线: false,
    };
  },
  mounted() {
    this.当前对象数据 = this.$当前窗口状态.current_link || {};
    this.挂载事件();
  },
  methods: {
    挂载事件() {
      let 事件总线 = this.$事件总线;
      事件总线.$on("激活数据", ($event) =>
        $event.type == "link" ? (this.当前对象数据 = $event) : null
      );
      事件总线.$on("保存数据", ($event) => {
        $event
          ? (this.当前对象数据 = this.$根据时间戳更新本地数据($event, this.当前对象数据))
          : null;
      });
    },
  },
  watch: {
    使用虚线(val) {
      if (val) {
        this.虚线定义数组 = this.虚线定义数组[0]
          ? this.当前对象数据.attrs.path_dash
          : [10, 10];
      } else {
        this.虚线定义数组 = [];
      }
    },
    当前对象数据: {
      handler: function (val) {
        if (val && val.attrs) {
          if (val.attrs.path_dash) {
            this.使用虚线 = true;
          } else {
            this.使用虚线 = false;
            this.虚线定义数据 = [];
          }
          if (val.attrs.path_dash !== this.虚线定义数组) {
            let array = val.attrs.path_dash;
            if (array && JSON.stringify(array) !== JSON.stringify(this.虚线定义数组)) {
              this.虚线定义数组 = array;
              this.使用虚线 = true;
            }
          }
        }
      },
      deep: true,
    },
    虚线定义数组: {
      handler: function (val) {
        if (!this.当前对象数据) {
          return null;
        }
        this.当前对象数据.attrsproxy = {};
        if (val && val[0]) {
          //console.log(this.当前对象数据);
          this.当前对象数据 && this.当前对象数据.attrs
            ? (this.当前对象数据.attrsproxy.path_dash = val)
            : null;

          this.当前对象数据 ? this.$事件总线.$emit("保存数据", this.当前对象数据) : null;
        } else {
          this.当前对象数据 && this.当前对象数据.attrs
            ? (this.当前对象数据.attrsproxy.path_dash = null)
            : null;
          this.当前对象数据 ? this.$事件总线.$emit("保存数据", this.当前对象数据) : null;
          this.使用虚线 = false;
        }
      },
      deep: true,
    },
  },
};
</script>
