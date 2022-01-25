<template>
  <el-drawer :modal="false" title="预设管理" size="100%" :visible="显示">
    <el-row>
      <el-input v-model="当前预设名">
        <span @click="新建预设()" slot="append">创建新预设</span>
      </el-input>
    </el-row>
    <el-collapse>
      <el-collapse-item v-for="(预设项目, i) in 预设列表">
        <div slot="title">
          {{ 预设项目.name }}
          <el-button
            size="mini"
            icon="el-icon-delete"
            circle
            v-if="
              !(
                (预设项目.name == '一般概念' && 当前对象数据.type == 'card') ||
                (预设项目.name == '属于' && 当前对象数据.type == 'link')
              )
            "
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
            <el-tooltip
              v-if="预设项目.attrs && 'byref' == 预设项目.attrs[属性名]"
              content
            >
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
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-presets",
  props: ["显示"],
  data() {
    return {
      卡片预设列表: [],
      链接预设列表: [],
      预设列表: [],
      当前预设: {},
      当前预设名: "",
      当前对象数据: {},
    };
  },
  async mounted() {
    this.卡片预设列表 = await this.$数据库.cardpresets.toArray();
    this.链接预设列表 = await this.$数据库.linkpresets.toArray();
    this.$事件总线.$on("激活卡片", ($event) => (this.当前对象数据 = $event));
    this.$事件总线.$on("激活链接", ($event) => (this.当前对象数据 = $event));
    this.$事件总线.$on("保存数据", ($event) =>
      this.$根据时间戳更新本地数据($event, this.当前对象数据)
    );
  },
  methods: {
    创建新预设() {},
  },
  watch: {
    当前对象数据: {
      handler(val) {
        this.当前预设名 = val.subtype;
        this.预设列表 = val.type == "card" ? this.卡片预设列表 : this.链接预设列表;
      },
      deep: true,
    },
    当前预设名: {
      async handler(val) {
        let 预设表名 = this.当前对象数据.type + "presets";
        if (预设表名) {
          this.当前预设 = await this.$数据库[预设表名].filter((data) => {
            return data.name == val;
          });
          this.事件总线.$emit("当前预设改变", this.当前预设, this.当前对象数据.type);
          console.log(this.当前预设);
        }
      },
    },
  },
};
</script>
