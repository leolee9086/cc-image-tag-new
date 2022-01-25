<template>
  <el-row>
    <el-col :span="12">
      <el-image :src="标记图像路径"></el-image>
    </el-col>
    <el-col :span="12">
      <el-input-number size="mini" v-model="标记大小"></el-input-number>
      <cc-assets-selector
        v-model="标记图像路径"
        :apitoken="apitoken"
        :思源伺服ip="思源伺服ip"
        :k="标记图片格式"
      ></cc-assets-selector>
      <el-select v-model="标记图片格式" size="mini" allow-create filterable>
        <el-option v-for="格式 in 图片格式列表" :label="格式" :value="格式"> </el-option>
      </el-select>
      <el-input v-model="标记图像路径" size="mini"></el-input>
      <el-checkbox
        v-model="标记自动旋转"
        :inactive-value="0"
        :active-value="1"
      ></el-checkbox>
      <cc-knob :size="50" v-model="标记旋转角度"> </cc-knob>
    </el-col>
  </el-row>
</template>
<script>
module.exports = {
  name: "cc-setter-anchor",
  props: ["位置", "对象数据", "思源伺服ip", "预设", "bref"],
  data() {
    return {
      当前对象数据: this.对象数据,
      apitoken: "",
      标记大小: 1,
      标记图像路径: "",
      标记图片格式: "",
      标记自动旋转: "",
      标记旋转角度: "",
      图片格式列表: ["jpg", "png", "jpeg", "svg"],
      updated: "0",
    };
  },
  mounted() {
    this.$事件总线.$on("保存数据", ($event) => this.判断id($event));
    this.$事件总线.$on("激活卡片", ($event) => this.判断id($event));
    this.$事件总线.$on("激活链接", ($event) => this.判断id($event));
  },
  methods: {
    判断id($event) {
        this.当前对象数据= this.$根据时间戳更新本地数据($event,this.当前对象数据)
    },
  },
  watch: {
    对象数据: {
      handler: function (val) {
        this.当前对象数据 = val;
      },
      deep: true,
    },
    当前对象数据: {
      handler: function (val) {
        if (val && val.attrs) {
          let attrs = val.attrs;
          this.标记大小 = attrs[`${this.位置}_anchor_size`]
            ? attrs[`${this.位置}_anchor_size`]
            : 20;
          this.标记图像路径 = attrs[`${this.位置}_anchor_image`];

          this.标记自动旋转 =
            attrs[`${this.位置}_anchor_rotate`] && attrs[`${this.位置}_anchor_rotate`]
              ? 1
              : 0;
          this.标记旋转角度 = attrs[`${this.位置}_anchor_rotate_offset`];
          this.updated = val.updated;
        }
      },
      deep: true,
      immediate: true,
    },
    标记属性对象: {
      handler: async function (val) {
        if (val[`${this.位置}_anchor_size`] && this.对象数据.id) {
          let 数据表名 = this.对象数据.type + "s";
          //console.log(数据表名);
          await this.$数据库[数据表名]
            .filter((data) => {
              return data.id == this.对象数据.id;
            })
            .modify((value) => {
              for (属性名 in val) {
                value.attrs[属性名] = val[属性名];
              }
              value = this.$更新数据时间戳(value);
            });
          if (!this.byref) {
            for (属性名 in val) {
              let 真实预设 = JSON.parse(JSON.stringify(this.预设));
              真实预设.attrs[属性名] = val[属性名];
              this.$事件总线.$emit("变更预设值", 属性名, 真实预设);
            }
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    标记属性对象() {
      let obj = {};
      let 位置 = this.位置;
      obj[`${位置}_anchor_size`] = this.标记大小;
      obj[`${位置}_anchor_image`] = this.标记图像路径;
      obj[`${位置}_anchor_rotate`] = this.标记自动旋转;
      obj[`${位置}_anchor_rotate_offset`] = this.标记旋转角度;
      return obj;
    },
  },
};
</script>
