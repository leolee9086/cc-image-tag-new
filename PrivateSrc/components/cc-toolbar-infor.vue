<template>
  <el-drawer
    :modal="false"
    :title="`节点信息:${卡片数据id || 链接数据id}`"
    size="100%"
    :visible="显示"
    :wrapper-closable="false"
  >
    <el-row slot="title">
      <div>
        {{ `节点信息:${$当前窗口状态.current_cardid || $当前窗口状态.current_linkid}` }}
      </div>
      <strong>预设类型</strong>
      <cc-presets-selector
        :数据id="当前对象数据.id || ''"
        :数据表名="当前对象数据.type + 's' || ''"
        v-model="预设名"
      ></cc-presets-selector>
    </el-row>
    <el-row>
      <el-collapse>
        <el-collapse-item title="节点样式">
          <strong slot="title">节点样式</strong>
          <el-tabs>
            <el-tab-pane label="边框色" name="边框色">
              <span slot="label">
                边框色
                <el-tooltip
                  v-if="预设.attrs.borderColor != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <cc-color-pane
                v-model="属性对象.borderColor"
                :显示web命名颜色="true"
                :自定义颜色数组="自定义颜色数组"
              ></cc-color-pane>
            </el-tab-pane>
            <el-tab-pane label="背景色" name="背景色">
              <span slot="label">
                背景色
                <el-tooltip
                  v-if="预设.attrs.backgroundColor != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <cc-color-pane
                v-model="属性对象.backgroundColor"
                :显示web命名颜色="true"
                :自定义颜色数组="自定义颜色数组"
              ></cc-color-pane>
            </el-tab-pane>

            <el-tab-pane label="文字色" name="文字色">
              <span slot="label">
                文字色
                <el-tooltip
                  v-if="预设.attrs.color != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <cc-color-pane
                v-model="属性对象.color"
                :显示web命名颜色="true"
                :自定义颜色数组="自定义颜色数组"
              ></cc-color-pane>
            </el-tab-pane>
            <el-tab-pane label="几何设置" name="几何设置">
              <span slot="label">边框和锚点</span>
              <el-row>
                <el-tooltip
                  v-if="预设.attrs.fixed_anchor != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
                <el-switch
                  :value="
                    属性对象.fixed_anchor !== undefined ? 属性对象.fixed_anchor : false
                  "
                  @change="属性对象.fixed_anchor = $event"
                ></el-switch>
                <span>始终连接到中点</span>
              </el-row>
              <el-row>
                <el-tooltip
                  v-if="预设.attrs.borderWidth != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
                <el-input-number
                  size="mini"
                  :value="属性对象.borderWidth"
                  @change="属性对象.borderWidth = $event"
                  :min="1"
                  :max="50"
                ></el-input-number>
              </el-row>
              <el-row>
                <el-tooltip
                  v-if="预设.attrs.borderStyle != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
                <el-select v-model="属性对象.borderStyle">
                  <el-option
                    v-for="(item, i) in 边框线型对照表"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="主题" name="主题"> </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
        <el-collapse-item title="链接样式" v-if="当前数据类型 == 'link'">
          <strong slot="title">链接样式</strong>

          <el-tabs>
            <el-tab-pane label="连接线" name="连接线">
              <span slot="label">
                几何设置
                <el-tooltip
                  v-if="预设.attrs.path_width != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <el-row>
                <el-col :span="15">
                  <el-slider
                    v-model="属性对象.path_width"
                    @change="属性对象.path_width = $event"
                  ></el-slider>
                </el-col>
                <el-col :span="9">
                  <el-select v-model="属性对象.path_type" size="mini">
                    <el-option
                      v-for="(item, i) in [`直线`, `折线`, '简单曲线']"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
              <cc-setter-path-dash :链接="当前对象数据"> </cc-setter-path-dash>
              <el-divider></el-divider>
              <cc-color-pane
                v-model="属性对象.path_color"
                :显示web命名颜色="true"
                :自定义颜色数组="自定义颜色数组"
              ></cc-color-pane>
            </el-tab-pane>
            <el-tab-pane label="起点标记" name="起点标记">
              <span slot="label">
                起点标记
                <el-tooltip
                  v-if="预设.attrs.from_anchor_size != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <cc-setter-anchor
                位置="from"
                :对象数据="当前对象数据"
                :思源伺服ip="思源伺服ip"
                :预设="预设"
                :byref="预设.attrs.mid_anchor_size == 'byref'"
              ></cc-setter-anchor>
            </el-tab-pane>
            <el-tab-pane label="中点标记" name="中点标记">
              <span slot="label">
                中点标记
                <el-tooltip
                  v-if="预设.attrs.mid_anchor_size != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <cc-setter-anchor
                位置="mid"
                :对象数据="当前对象数据"
                :思源伺服ip="思源伺服ip"
                :预设="预设"
                :byref="预设.attrs.mid_anchor_size == 'byref'"
              ></cc-setter-anchor>
            </el-tab-pane>
            <el-tab-pane label="终点标记样式" name="终点标记样式">
              <span slot="label">
                终点标记
                <el-tooltip
                  v-if="预设.attrs.to_anchor_size != 'byref'"
                  content="这是一个预设值,修改后会修改所有同类型元素"
                >
                  <span class="el-icon-copy-document"></span>
                </el-tooltip>
              </span>
              <cc-setter-anchor
                位置="to"
                :对象数据="当前对象数据"
                :思源伺服ip="思源伺服ip"
                :预设="预设"
                :byref="预设.attrs.to_anchor_size == 'byref'"
              ></cc-setter-anchor>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <div v-if="开发模式" v-html="JSON.stringify(当前对象数据)"></div>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-infor",
  props: ["卡片数据id", "链接数据id", "思源伺服ip", "显示"],
  data() {
    return {
      开发模式: false,
      当前面板: "样式",
      apitoken: "",
      当前对象数据: "",
      链接类型列表: ["属于", "不属于"],
      工具栏宽度: 150,
      工具栏高度: 30,
      最小化窗口: true,
      工具栏左侧位置: 100,
      属性对象: {},
      自定义颜色数组: [],
      当前数据类型: "",
      预设列表: [{}],
      预设id: "",
      预设: {
        id: "",
        name: "",
        attrs: "",
      },
      预设名: "",
      新预设名: "",
      重命名计数: 1,
      属性列表: [],
      边框线型对照表: [
        { value: "solid", label: "实线" },
        { value: "double", label: "双线" },
        { value: "dashed", label: "虚线" },
        { value: "dotted", label: "点线" },
        { value: "groove", label: "线雕" },
        { value: "ridge", label: "浮雕" },
        { value: "inset", label: "陷入" },
        { value: "outset", label: "突起" },
      ],
    };
  },
  mounted() {
    for (属性名 in this.$卡片预设属性默认值) {
      this.属性列表.push(属性名);
    }
    //console.log(this.属性列表);
    this.获取预设();
    this.添加监听器();
    this.获取思源主题列表();
    this.开发模式 = this.$开发模式;
  },

  watch: {
    自定义颜色数组: {
      handler(val) {
        this.$事件总线.$emit("自定义颜色改变", val);
        this.$数据库.metadata.put({ key: "customcolors", value: val });
      },
      deep: true,
    },
    预设名: {
      handler: async function (val, oldval) {
        let 预设表名 = this.当前对象数据.type + "presets" || "cadpresets";
        //  this.$事件总线.$emit("改变数据预设", this.当前对象数据, val);
        await this.$数据库[预设表名]
          .filter((data) => {
            if (data.name == this.当前对象数据.subtype) {
              return true;
            }
          })
          .toArray((array) =>
            array[0] ? (this.预设 = array[0]) : this.重建预设(this.当前对象数据)
          );
        this.新预设名 = val || "未命名";
        this.预设id = this.预设.id;
        this.$事件总线.$emit("改变数据预设", this.当前对象数据, val);
      },
    },

    当前对象数据: {
      handler: function (val, oldval) {
        if (!val) {
          return null;
        }
        if (val && oldval && val.id == oldval.id && val.subtype !== oldval.subtype) {
          this.预设名 = val.subtype;
          this.获取预设();
        }
        if (val && oldval && val.id == oldval.id && val.subtype === oldval.subtype) {
          this.变更预设();
        }
        this.当前数据类型 = val.type;
        if (val.attrs) {
          for (属性名 in this.$预设属性默认值列表) {
            console.log(属性名);
            this.属性对象[属性名] = val.attrs[属性名];
          }
        }

        this.属性对象.id = val.id;
        this.属性对象 = JSON.parse(JSON.stringify(this.属性对象));
      },
      deep: true,
    },

    最小化窗口: {
      handler(val, oldval) {
        if (val) {
          this.工具栏高度 = 30;
          this.工具栏宽度 = 150;
        } else {
          this.工具栏高度 = 600;
          this.工具栏宽度 = 400;
        }
      },
    },
    属性对象: {
      handler: function (val, oldval) {
        console.log(val, oldval);
        let flag = false;

        if (val.id == oldval.id) {
          flag = true;
          let temp = {};
          temp.attrsproxy = val;
          temp.id = val.id;
          temp.type = this.当前数据类型;
          this.$事件总线.$emit("保存数据", temp);
          this.变更预设();
        }
      },
      deep: true,
    },
    显示: {
      handler: async function (val, oldval) {
        //console.log(val.id, oldval.id);
        this.获取预设();
      },

      deep: true,
    },
  },

  methods: {
    获取思源主题列表: async function () {
      let temp = await 获取思源配置(this.$思源伺服ip, this.apitoken);
      this.思源配置对象 = temp.data;
      console.log(this.思源配置对象);
      this.黑暗模式主题列表 = this.思源配置对象.appearance.darkThemes;
      this.明亮模式主题列表 = this.思源配置对象.appearance.lightThemes;
    },
    添加监听器: function () {
      this.$事件总线.$on(
        "激活卡片",
        ($event) => (this.当前对象数据 = $event || this.当前对象数据)
      );
      this.$事件总线.$on(
        "激活链接",
        ($event) => (this.当前对象数据 = $event || this.当前对象数据)
      );
      this.$事件总线.$on("自定义颜色改变", ($event) => (this.自定义颜色数组 = $event));
      this.$事件总线.$on("保存数据", ($event) => this.判断id($event));
    },
    判断id($event) {
      if ($event && $event.attrs && !$event.attrsproxy) {
        if (
          $event == this.当前对象数据.id &&
          $event.updated > this.当前对象数据.updated
        ) {
          !$event.attrs.trashed ? (this.当前对象数据 = $event) : null;
        }
      }
    },
    删除预设: function (预设项目) {
      let 预设表名 = this.当前对象数据.type + "presets";
      this.$事件总线.$emit("删除预设", 预设项目, 预设表名, this.获取预设);
      this.预设名 = 预设表名 == "cardpresets" ? "一般概念" : "属于";
    },
    重建预设: async function (对象数据) {
      if (对象数据 && 对象数据.id) {
        this.新预设名 = 对象数据.subtype;
      }
      await this.新建预设();
    },

    变更预设: function () {
      console.log(this.预设);

      this.$内置属性名对照表.forEach((element) => {
        let 属性名 = element["name"];
        if (this.预设.attrs[属性名] === "byref") {
          console.log(属性名);
          return;
        }
        console.log(属性名);
        this.预设.type = this.当前对象数据.type;
        this.预设.attrs[属性名] = this.属性对象[属性名];
        console.log(this.属性对象);

        console.log(this.预设);
        this.$事件总线.$emit("变更预设值", 属性名, this.预设);
      });
    },

    获取预设: async function (flag) {
      if (!this.当前对象数据.type) {
        return null;
      }
      let 预设表名 = this.当前对象数据.type + "presets";
      this.预设列表 = await this.$获取预设表(预设表名);
      if (this.预设名) {
        this.预设 =
          JSON.parse(JSON.stringify(await this.$获取预设(预设表名, this.预设名))) ||
          this.预设 ||
          {};
        console.log(this.预设);
      }
    },
    新建预设: async function () {
      let id = Lute.NewNodeID();
      let attrs = {};
      if (this.重命名计数 > 5) {
        alert("出错了,更改名称再次尝试");
        this.新预设名 = this.预设名;

        return null;
      }
      for (i in this.属性列表) {
        let 属性名 = this.属性列表[i];

        attrs[属性名] =
          this.属性对象[属性名] === undefined ? "byref" : this.属性对象[属性名];
      }
      let 新预设 = {};
      新预设["id"] = id;
      新预设["name"] = this.新预设名 || "未命名";
      新预设["attrs"] = attrs;
      新预设["attrs"]["def_block"] = "byref";

      if (this.当前对象数据.type == "link") {
        try {
          await this.$数据库.linkpresets.put(新预设);
          this.重命名计数 = 1;
        } catch (e) {
          //  console.log(e);
          this.新预设名 = this.新预设名 + this.$用Lute生成时间戳();
          this.重命名计数 = this.重命名计数 + 1;
          this.新建预设();
          return null;
        }
      }
      if (this.当前对象数据.type == "card") {
        try {
          await this.$数据库.cardpresets.put(新预设);
          this.重命名计数 = 1;
        } catch (e) {
          //  console.log(e);

          this.新预设名 = this.新预设名 + this.$用Lute生成时间戳();
          this.重命名计数 = this.重命名计数 + 1;
          this.新建预设();
          return null;
        }
      }
      await this.获取预设();
    },

    设定链接(link) {
      //  this.$数据库.links.put(link);
    },
  },
};
</script>
