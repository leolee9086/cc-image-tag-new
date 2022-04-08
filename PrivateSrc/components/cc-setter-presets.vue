<template>
  <el-collapse>
    <el-collapse-item v-for="(预设项目, i) in 预设列表">
      <div slot="title">
        {{ 预设项目.name }}
        <el-button
          size="mini"
          icon="el-icon-delete"
          circle
          v-if="!(预设项目.name == '一般概念' || 预设项目.name == '属于')"
          @click="删除预设(预设项目)"
        ></el-button>
      </div>
      <el-row v-for="(i, 属性名) in $卡片预设属性默认值">
        <el-col :span="20">
          <span>{{ 属性名 }}</span>
        </el-col>
        <el-col :span="4">
          <el-tooltip
            v-if="预设项目.attrs && 'byref' != 预设项目.attrs[属性名]"
            content="设为实例值,设为实例值之后,改变某一个引用不会改变所有使用了预设的元素"
          >
            <div slot="content">
              设为实例值,
              <br />改变某一个引用时 <br />不会改变其他元素项目
            </div>

            <span
              class="el-icon-delete"
              size="mini"
              @click="设为实例值(属性名, 预设项目)"
            ></span>
          </el-tooltip>
          <el-tooltip v-if="预设项目.attrs && 'byref' == 预设项目.attrs[属性名]" content>
            <div slot="content">
              设为预设值,
              <br />改变某一个引用时 <br />会改变所有使用了预设的元素
            </div>
            <span
              class="el-icon-check"
              size="mini"
              @click="设为预设值(属性名, 预设项目)"
            ></span>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
module.exports = {
  name: "cc-setter-presets",
  props: ["当前对象数据"],
  data() {
    return {
      预设列表: "",
      内置属性名对照标: [
        { name: "color", label: "文字颜色", type: "color" },
        { name: "borderColor", label: "边框颜色", type: "color" },
      ],
    };
  },
  async mounted() {
    await this.获取预设表();
  },
  watch: {
    当前对象数据: {
      async handler(val, oldval) {
        if (!oldval) {
          return null;
        } else {
          await this.获取预设表();
        }
      },
      deep: true,
    },
  },
  methods: {
    async 获取预设表() {
      let 当前预设表 = this.当前对象数据.type + "presets";
      this.预设列表 = await this.$数据库[当前预设表].toArray();
    },
    删除预设(预设数据) {
      let 当前预设表 = this.当前对象数据.type + "presets";

      this.$事件总线.$emit("删除预设", 预设数据, 当前预设表);
      this.获取预设表();
    },

    设为实例值: async function (属性名, 预设项目) {
      预设项目.attrs[属性名] = "byref";
      if (属性名.indexOf("to") >= 0) {
        预设项目.attrs.to_anchor_rotate = "byref";
        预设项目.attrs.to_anchor_image = "byref";
        预设项目.attrs.to_anchor_size = "byref";
        预设项目.attrs.to_anchor_rotate_offset = "byref";
      }
      if (属性名.indexOf("from") >= 0) {
        预设项目.attrs.from_anchor_rotate = "byref";
        预设项目.attrs.from_anchor_image = "byref";
        预设项目.attrs.from_anchor_size = "byref";
        预设项目.attrs.from_anchor_rotate_offset = "byref";
      }
      if (属性名.indexOf("mid") >= 0) {
        预设项目.attrs.mid_anchor_rotate = "byref";
        预设项目.attrs.mid_anchor_image = "byref";
        预设项目.attrs.mid_anchor_size = "byref";
        预设项目.attrs.mid_anchor_rotate_offset = "byref";
      }
      if (属性名.indexOf("path") >= 0) {
        预设项目.attrs.path_width = "byref";
        预设项目.attrs.path_type = "byref";
        预设项目.attrs.path_color = "byref";
      }
      if (this.当前对象数据.type == "link") {
        await this.$数据库.linkpresets.put(预设项目);
        // //console.log(this.预设列表);
      }
      if (this.当前对象数据.type == "card") {
        //  //console.log(this.预设列表);

        await this.$数据库.cardpresets.put(预设项目);
      }
      await this.获取预设表();
    },
    设为预设值: async function (属性名, 预设项目) {
      预设项目.attrs[属性名] = undefined;
      if (属性名.indexOf("to") >= 0) {
        预设项目.attrs.to_anchor_rotate = undefined;
        预设项目.attrs.to_anchor_image = undefined;
        预设项目.attrs.to_anchor_size = undefined;
        预设项目.attrs.to_anchor_rotate_offset = undefined;
      }
      if (属性名.indexOf("from") >= 0) {
        预设项目.attrs.from_anchor_rotate = undefined;
        预设项目.attrs.from_anchor_image = undefined;
        预设项目.attrs.from_anchor_size = undefined;
        预设项目.attrs.from_anchor_rotate_offset = undefined;
      }
      if (属性名.indexOf("mid") >= 0) {
        预设项目.attrs.mid_anchor_rotate = undefined;
        预设项目.attrs.mid_anchor_image = undefined;
        预设项目.attrs.mid_anchor_size = undefined;
        预设项目.attrs.mid_anchor_rotate_offset = undefined;
      }
      if (属性名.indexOf("path") >= 0) {
        预设项目.attrs.path_width = undefined;
        预设项目.attrs.path_type = undefined;
        预设项目.attrs.path_color = undefined;
      }
      if (this.当前对象数据.type == "link") {
        await this.$数据库.linkpresets.put(预设项目);
        ////console.log(this.预设列表);
      }
      if (this.当前对象数据.type == "card") {
        // //console.log(this.预设列表);

        await this.$数据库.cardpresets.put(预设项目);
      }
      await this.获取预设表();
    },
  },
};
</script>
