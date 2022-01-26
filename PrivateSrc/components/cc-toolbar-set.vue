<template>
  <el-drawer
    :modal="false"
    title="画板设置"
    size="100%"
    :visible="显示"
    :show-close="false"
  >
    <el-row>
      <el-col :span="24">
        <el-input v-model="当前画板命名" size="mini">
          <span slot="prepend">画板命名</span>
        </el-input>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20" type="flex" justify="space-around">
      <el-col :span="6">
        <el-upload
          class="upload-demo"
          accept=".cctag"
          :http-request="导入旧版JSON数据"
          :action="`http://${思源伺服ip}/api/asset/upload`"
          :headers="{ Authorization: 'Token' + apitoken }"
          :flile-list="JSON文件列表"
          :multiple="false"
        >
          <el-button
            area-label="导入文件"
            slot="trigger"
            size="mini"
            class="el-icon-upload"
            >导入旧版文件</el-button
          >
        </el-upload>
      </el-col>
      <el-col :span="6">
        <el-upload
          class="upload-demo"
          accept=".cccards"
          :http-request="覆盖导入JSON数据"
          :action="`http://${思源伺服ip}/api/asset/upload`"
          :headers="{ Authorization: 'Token' + apitoken }"
          :flile-list="JSON文件列表"
          :multiple="false"
        >
          <el-button
            area-label="导入文件"
            slot="trigger"
            size="mini"
            class="el-icon-upload"
            >导入文件</el-button
          >
        </el-upload>
      </el-col>
      <el-col :span="6">
        <el-upload
          class="upload-demo"
          accept=".cccards"
          :http-request="覆盖导入mardown数据"
          :action="`http://${思源伺服ip}/api/asset/upload`"
          :headers="{ Authorization: 'Token' + apitoken }"
          :flile-list="JSON文件列表"
          :multiple="false"
        >
          <el-button
            area-label="导入文件"
            slot="trigger"
            size="mini"
            class="el-icon-upload"
            >导入markdown</el-button
          >
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <strong>当前工作空间:{{ 工作空间名 }}</strong>
      </el-col>
      <el-col :span="12">
        <cc-loader-file @filechange="设定工作空间($event)"></cc-loader-file>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <cc-setter-board-background></cc-setter-board-background>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <el-switch
          size="mini"
          @change="$当前窗口状态.showname = $event"
          v-model="折叠时显示名称"
          active-text="折叠卡片时显示名称"
        ></el-switch>
      </el-col>
      <el-tooltip content="折叠时是否显示名称">
        <el-switch
          area-label="折叠时是否显示名称"
          @change="$当前窗口状态.showsubtype = $event"
          size="mini"
          v-model="折叠时显示类别"
          active-text="折叠卡片时显示类别"
        ></el-switch>
      </el-tooltip>
    </el-row>
    <el-switch
      area-label="折叠时是否显示名称"
      size="mini"
      v-model="是否默认优先显示markdown"
      active-text="优先显示markdown"
    ></el-switch>
    <el-switch
      area-label="是否某认以思源markdown覆盖卡片markdown"
      size="mini"
      v-model="是否默认以思源块内容覆盖卡片markdown"
      active-text="以内容块覆盖卡片markdown"
    ></el-switch>
    <el-switch
      area-label="链接是否默认显示标记"
      size="mini"
      v-model="是否默认显示链接标记"
      active-text="是否默认显示链接标记"
    ></el-switch>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-set",
  props: ["显示"],
  data() {
    return {
      当前画板命名: "",
      JSON文件列表: [],
      思源伺服ip: "",
      apitoken: "",
      折叠时显示名称: true,
      折叠时显示类别: true,
      是否默认优先显示markdown: false,
      是否默认以思源块内容覆盖卡片markdown: false,
      是否默认显示链接标记: true,
      工作空间名: "",
      工作空间列表: "",
    };
  },
  async mounted() {
    await this.加载数据();
  },
  methods: {
    设定工作空间: async function ($event) {
      let obj = {
        id: 00000,
        name: $event.name,
        value: $event,
      };
      await this.$画板元数据库.workspace.put(obj);
      this.工作空间名 = $event.name;
      this.$事件总线.$emit("设定工作空间", $event, false);
      console.log($event);
    },
    加载数据: async function () {
      let that = this;
      try {
        that.当前画板命名 = (await that.$数据库.metadata.get("name")).value;
      } catch (e) {
        that.当前画板命名 = "未命名";
        that.$数据库.metadata.put({ key: "name", value: "未命名" });
      }
      that.画板列表 = await that.$画板元数据库.boards.toArray();
    },
    导入旧版JSON数据() {},
    覆盖导入JSON数据() {},
    覆盖导入mardown数据() {},
  },
  watch: {
    是否默认显示链接标记(val) {
      this.$当前窗口状态.show_tag_by_default = val ? true : false;
    },
    是否默认优先显示markdown(val) {
      this.$当前窗口状态.show_markdown_by_default = val ? true : false;
    },
    是否默认以思源块内容覆盖卡片markdown(val) {
      if (val) {
        alert(
          "请注意,开启选项后,连接思源块时,卡片markdown内容将会被思源块的markdown属性覆盖"
        );
        this.$当前窗口状态.reload_markdown_by_default = val ? true : false;
      }
    },
  },
};
</script>
<style></style>
