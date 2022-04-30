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
      <el-row v-for="(属性, i) in $内置属性名对照表">
        <el-col :span="20">
          <span :aria-label="属性['name']">{{ 属性["label"] }}</span>
        </el-col>
        <el-col :span="4">
          <el-tooltip
            v-if="预设项目.attrs && 'byref' != 预设项目.attrs[属性['name']]"
            content="设为实例值,设为实例值之后,改变某一个引用不会改变所有使用了预设的元素"
          >
            <div slot="content">
              设为实例值,
              <br />改变某一个引用时 <br />不会改变其他元素项目
            </div>

            <span
              class="el-icon-delete"
              size="mini"
              @click="设为实例值(属性['name'], 预设项目)"
            ></span>
          </el-tooltip>
          <el-tooltip
            v-if="预设项目.attrs && 'byref' == 预设项目.attrs[属性['name']]"
            content
          >
            <div slot="content">
              设为预设值,
              <br />改变某一个引用时 <br />会改变所有使用了预设的元素
            </div>
            <span
              class="el-icon-check"
              size="mini"
              @click="设为预设值(属性['name'], 预设项目)"
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
      this.$数据库[当前预设表]
        ? (this.预设列表 = await this.$数据库[当前预设表].toArray())
        : null;
      console.log(this.预设列表);
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
