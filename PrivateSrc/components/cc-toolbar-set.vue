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
      <el-col :span="8">
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
      <el-col :span="8">
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
      <el-col :span="8">
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
    <el-divider></el-divider>
    <cc-background-setter></cc-background-setter>
    <el-divider></el-divider>
    <el-tooltip content="折叠时是否显示类型">
      <el-switch
        size="mini"
        @change="$当前窗口状态.showsubtype = $event"
        v-model="折叠时显示名称"
      ></el-switch>
    </el-tooltip>
    <el-tooltip content="折叠时是否显示名称">
      <el-switch
        area-label="折叠时是否显示名称"
        @change="$当前窗口状态.showname = $event"
        size="mini"
        v-model="折叠时显示类别"
      ></el-switch>
    </el-tooltip>
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
    };
  },
  methods: {
    导入旧版JSON数据() {},
    覆盖导入JSON数据() {},
    覆盖导入mardown数据() {},
  },
};
</script>
<style></style>
