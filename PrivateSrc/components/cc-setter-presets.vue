<template>
  <el-collapse>
    <el-collapse-item v-for="(预设项目, i) in 卡片预设列表">
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
  data() {
    return {
      卡片预设列表: "",
      链接预设列表: "",
      内置属性名对照标: [
        { name: "color", label: "文字颜色", type: "color" },
        { name: "borderColor", label: "边框颜色", type: "color" },
      ],
    };
  },
  async mounted() {
    this.卡片预设列表 = await this.$数据库.cardpresets.toArray();
    this.链接预设列表 = await this.$数据库.linkpresets.toArray();
  },
  methods() {},
};
</script>
