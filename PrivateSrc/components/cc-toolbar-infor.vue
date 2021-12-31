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
      <el-tooltip
        :content="`[一般概念]和[属于]是最基本的预设,不包含任何值.
      每次刷新之后会重置.
      但是可以用于批量更改属性`"
      >
        <el-select size="mini" v-model="预设名" @focus="获取预设()">
          <el-option
            v-for="(预设, i) in 预设列表"
            :key="预设.id"
            :label="预设.name"
            :value="预设.name"
          >
          </el-option>
        </el-select>
      </el-tooltip>
    </el-row>
    <el-tabs v-model="当前面板">
      <el-tab-pane label="连接" name="连接">
        <el-collapse>
          <el-collapse-item>
            <strong slot="title">思源连接属性</strong>
            <el-input size="mini" v-model="当前思源块id">
              <span slot="prepend">
                <span class="el-icon-siyuan"></span>
                <span>id:</span>
              </span>
            </el-input>

            <cc-block-list
              :blocklist="当前反向链接列表['backlinks']"
              title="反向链接"
              :count="当前反向链接列表['linkRefsCount']"
            ></cc-block-list>

            <cc-block-list
              :blocklist="当前反向链接列表['backmentions']"
              :count="当前反向链接列表['mentionsCount']"
              title="提及"
            ></cc-block-list>
            <cc-block-list
              :blocklist="当前正向链接列表"
              :count="当前正向链接列表.length"
              title="正向链接"
            ></cc-block-list>
          </el-collapse-item>
          <el-collapse-item>
            <strong slot="title">图上连接</strong>
            <el-collapse-item title="出链">
              <el-collapse-item v-for="(outgoinglink, i) in 当前图上正向链接列表">
                <el-row slot="title">
                  <el-select
                    v-model="outgoinglink.subtype"
                    @change="设定链接(outgoinglink)"
                  >
                    <el-option
                      v-for="item in 链接类型列表"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-row>
                <el-input v-model="outgoinglink.markdown" size="mini">
                  <div slot="prepend">标记</div>
                </el-input>
                <span>{{ outgoinglink.markdown }}</span>
              </el-collapse-item>
            </el-collapse-item>
            <el-collapse-item title="入链">
              <el-collapse-item v-for="(backlink, i) in 当前图上反向链接列表">
                <span>{{ backlink.markdown }}</span>
              </el-collapse-item>
            </el-collapse-item>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>

      <el-tab-pane label="样式" name="样式">
        <el-row>
          <el-input v-model="新预设名">
            <span @click="新建预设()" slot="append">创建新预设</span>
          </el-input>
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
                  >
                  </cc-color-pane>
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
                  >
                  </cc-color-pane>
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
                  >
                  </cc-color-pane>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
            <el-collapse-item title="链接样式" v-if="当前数据类型 == 'link'">
              <el-tabs>
                <el-tab-pane label="连接线" name="连接线">
                  <span slot="label">
                    连接线
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
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>

                  <el-divider></el-divider>
                  <cc-color-pane v-model="属性对象.path_color" :显示web命名颜色="true">
                  </cc-color-pane>
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
                  <el-col :span="12">
                    <el-image :src="属性对象.from_anchor_image"></el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      size="mini"
                      v-model="属性对象.from_anchor_size"
                    ></el-input-number>
                    <cc-assets-selector
                      v-model="属性对象.from_anchor_image"
                      :apitoken="apitoken"
                      :思源伺服ip="思源伺服ip"
                      :k="起点图片格式"
                    ></cc-assets-selector>
                    <el-select v-model="起点图片格式" size="mini" allow-create filterable>
                      <el-option v-for="格式 in 图片格式列表" :label="格式" :value="格式">
                      </el-option>
                    </el-select>
                    <el-input v-model="属性对象.from_anchor_image" size="mini"></el-input>
                    <el-checkbox
                      v-model="起点自动旋转"
                      @change="属性对象.from_anchor_rotate = $event"
                      :inactive-value="0"
                      :active-value="1"
                    ></el-checkbox>
                    <cc-knob :size="50" v-model="属性对象.from_anchor_rotate_offset">
                    </cc-knob>
                  </el-col>
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
                  <el-col :span="12">
                    <el-image :src="属性对象.mid_anchor_image"></el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      size="mini"
                      v-model="属性对象.mid_anchor_size"
                    ></el-input-number>
                    <cc-assets-selector
                      v-model="属性对象.mid_anchor_image"
                      :apitoken="apitoken"
                      :思源伺服ip="思源伺服ip"
                      :k="起点图片格式"
                    ></cc-assets-selector>
                    <el-select v-model="起点图片格式" size="mini" allow-create filterable>
                      <el-option v-for="格式 in 图片格式列表" :label="格式" :value="格式">
                      </el-option>
                    </el-select>
                    <el-input v-model="属性对象.mid_anchor_image" size="mini"></el-input>
                    <el-checkbox
                      v-model="中点自动旋转"
                      @change="属性对象.mid_anchor_rotate = $event"
                      :inactive-value="0"
                      :active-value="1"
                    ></el-checkbox>
                    <cc-knob :size="50" v-model="属性对象.mid_anchor_rotate_offset">
                    </cc-knob>
                  </el-col>
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
                  <el-col :span="12">
                    <el-image :src="属性对象.to_anchor_image"></el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-input-number
                      size="mini"
                      v-model="属性对象.to_anchor_size"
                    ></el-input-number>
                    <cc-assets-selector
                      v-model="属性对象.to_anchor_image"
                      :apitoken="apitoken"
                      :思源伺服ip="思源伺服ip"
                      :k="起点图片格式"
                    ></cc-assets-selector>
                    <el-select v-model="起点图片格式" size="mini" allow-create filterable>
                      <el-option v-for="格式 in 图片格式列表" :label="格式" :value="格式">
                      </el-option>
                    </el-select>
                    <el-input v-model="属性对象.to_anchor_image" size="mini"></el-input>
                    <el-checkbox
                      v-model="终点自动旋转"
                      @change="属性对象.to_anchor_rotate = $event"
                      :inactive-value="0"
                      :active-value="1"
                    ></el-checkbox>
                    <cc-knob :size="50" v-model="属性对象.to_anchor_rotate_offset">
                    </cc-knob>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="预设" name="预设">
        <el-collapse>
          <el-collapse-item v-for="(预设项目, i) in 预设列表">
            <div slot="title">
              {{ 预设项目.name }}
              <el-button
                size="mini"
                icon="el-icon-delete"
                circle
                v-if="
                  预设项目.id != '20211230111132-wbdnm23' &&
                  预设项目.id != '20211230113017-0vgkowg'
                "
                @click="删除预设(预设项目)"
              ></el-button>
            </div>
            <el-row v-for="(属性名, i) in 属性列表">
              <el-col :span="20"
                ><span>{{ 属性名 }}</span>
              </el-col>
              <el-col :span="4">
                <el-tooltip
                  v-if="预设项目.attrs && 'byref' != 预设项目.attrs[属性名]"
                  content="设为实例值,设为实例值之后,改变某一个引用不会改变所有使用了预设的元素"
                >
                  <div slot="content">
                    设为实例值,<br />改变某一个引用时<br />不会改变其他元素项目
                  </div>

                  <span
                    class="el-icon-delete"
                    size="mini"
                    @click="设为实例值(属性名, 预设项目)"
                  ></span>
                </el-tooltip>
                <el-tooltip
                  v-if="预设项目.attrs && 'byref' == 预设项目.attrs[属性名]"
                  content=""
                >
                  <div slot="content">
                    设为预设值,<br />改变某一个引用时<br />会改变所有使用了预设的元素
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
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script>
module.exports = {
  name: "cc-toolbar-infor",
  props: ["卡片数据id", "链接数据id", "思源伺服ip", "显示"],
  components: componentsList,
  data() {
    return {
      当前面板: "样式",
      apitoken: "",
      当前对象数据: "",
      当前正向链接列表: [],
      当前反向链接列表: [],
      当前思源块id: "",
      当前图上反向链接列表: [],
      当前图上正向链接列表: [],
      链接类型列表: ["属于", "不属于"],
      工具栏宽度: 150,
      工具栏高度: 30,
      最小化窗口: true,
      工具栏左侧位置: 100,
      属性对象: {},
      自定义颜色数组: [],
      当前数据类型: "",
      起点图片格式: "",
      终点图片格式: "",
      图片格式列表: ["jpg", "png", "jpeg", "svg"],
      起点自动旋转: false,
      终点自动旋转: false,
      中点自动旋转: true,
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
      属性列表: [
        "color",
        "borderColor",
        "backgroundColor",
        "def_block",

        "path_width",
        "path_type",
        "path_color",

        "from_anchor_size",
        "to_anchor_size",
        "mid_anchor_size",

        "from_anchor_image",
        "to_anchor_image",
        "mid_anchor_image",

        "from_anchor_rotate",
        "to_anchor_rotate",
        "mid_anchor_rotate",

        "from_anchor_rotate_offset",
        "to_anchor_rotate_offset",
        "mid_anchor_rotate_offset",
      ],
    };
  },
  mounted() {
    this.获取预设();
  },

  watch: {
    预设: {
      handler: function (val, oldval) {
        if (val && val.attrs) {
          // console.log(val);
          this.属性列表.forEach((属性名) => {
            if (!(val.attrs[属性名] === "byref") && !(val.attrs[属性名] === undefined)) {
              //console.log(val.attrs[属性名]);

              this.属性对象[属性名] = val.attrs[属性名];
            }
          });
          this.设定当前标记(this.属性对象);
        }
      },
      deep: true,
    },

    预设名: {
      handler: async function (val, oldval) {
        if (this.当前对象数据.type == "link") {
          await this.$数据库.linkpresets
            .filter((data) => {
              if (data.name == val) {
                return true;
              }
            })
            .toArray((array) =>
              array[0] ? (this.预设 = array[0]) : this.重建预设(this.当前对象数据)
            );
          this.新预设名 = this.预设.name || "未命名";
          this.预设id = this.预设.id;
          await this.$数据库.links.update(this.当前对象数据.id, {
            subtype: this.预设.name,
          });
        }
        if (this.当前对象数据.type == "card") {
          await this.$数据库.cardpresets
            .filter((data) => {
              if (data.name == val) {
                return true;
              }
            })
            .toArray((array) =>
              array[0] ? (this.预设 = array[0]) : this.重建预设(this.当前对象数据)
            );
          this.新预设名 = this.预设.name || "未命名";
          this.预设id = this.预设.id;
          await this.$数据库.cards.update(this.当前对象数据.id, {
            subtype: this.预设.name,
          });
        }
      },
    },
    卡片数据id: {
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.当前对象数据 = await this.$数据库.cards.get(this.卡片数据id);
          this.属性对象 = JSON.parse(JSON.stringify(this.当前对象数据.attrs));
          this.属性对象.id = this.当前对象数据.id;
          this.当前对象名称 = this.当前对象数据.name;
          this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.当前对象数据.id}&baseid=${this.$baseid}&table=cards`;
        }
      },
    },
    链接数据id: {
      handler: async function (val, oldval) {
        if (val && val != oldval) {
          this.当前对象数据 = await this.$数据库.links.get(this.链接数据id);
          this.属性对象 = JSON.parse(JSON.stringify(this.当前对象数据.attrs));
          this.属性对象.id = this.当前对象数据.id;
          this.属性对象.path_width = this.属性对象.path_width || 1;
          this.当前对象名称 = this.当前对象数据.name;
          this.卡片超链接 = `/widgets/cc-image-tag-new/vditor-card-editor.html?id=${this.当前对象数据.id}&baseid=${this.$baseid}&table=cards`;
        }
      },
    },
    当前对象数据: {
      handler: async function (val, oldval) {
        //  console.log("当前数据", val);
        if (!val) {
          return null;
        }
        this.当前数据类型 = val.type;
        //  console.log(this.当前数据类型);
        this.当前思源块id = val.attrs.def_block;
        this.预设名 = val.subtype;
        await this.获取预设();
        if (val.type == "card") {
          this.当前图上正向链接列表 = await this.$数据库.links
            .filter((value) => {
              if (value.attrs) {
                if (value.attrs.from_id == val) {
                  return true;
                }
              }
            })
            .toArray();
          this.当前图上反向链接列表 = await this.$数据库.links
            .filter((value) => {
              if (value.attrs) {
                if (value.attrs.to_id == val) {
                  return true;
                }
              }
            })
            .toArray();
        }
        if (val.type == "card") {
        }
      },
      deep: true,
    },
    当前思源块id: {
      async handler(val, oldval) {
        if (val) {
          this.当前思源块id = val.replace("((", "").replace("))", "").slice(0, 22);
          id = this.当前思源块id;
          //  console.log(id);
          this.当前反向链接列表 = await this.以id获取反向链接(id);
          this.当前正向链接列表 = await this.以id获取正向链接(id);

          this.$set(this.属性对象, "def_block", id);
        } else {
          this.当前反向链接列表 = [];
          this.当前正向链接列表 = [];
        }
      },
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
        // console.log(val.id, oldval.id);
        let flag = false;
        if (val.id == oldval.id) {
          flag = true;
        }
        this.设定当前标记(val, flag);
      },
      deep: true,
    },
  },

  methods: {
    删除预设: async function (预设项目) {
      let id = 预设项目.id;
      if (this.当前对象数据.type == "link") {
        await this.$数据库.linkpresets.delete(预设项目.id);
        await this.$数据库.links
          .filter((data) => {
            if (data.subtype == this.预设名) {
              return true;
            }
          })
          .modify((value) => (value.subtype = "属于"));
        this.预设名 = "属于";
      }
      if (this.当前对象数据.type == "card") {
        await this.$数据库.cardpresets.delete(预设项目.id);
        await this.$数据库.cards
          .filter((data) => {
            if (data.subtype == this.预设名) {
              return true;
            }
          })
          .modify((value) => (value.subtype = "一般概念"));
        this.预设名 = "一般概念";
      }
      await this.获取预设();
    },
    重建预设: async function (对象数据) {
      if (对象数据 && 对象数据.id) {
        this.新预设名 = 对象数据.subtype;
      }
      await this.新建预设();
    },
    变更预设值: async function (属性名, 预设项目) {
      if (属性名) {
        this.预设.attrs[属性名] = this.属性对象[属性名];
        if (this.当前对象数据.type == "link") {
          await this.$数据库.linkpresets.put(this.预设);
          await this.$数据库.links
            .filter((data) => {
              if (data.subtype == this.预设名) {
                return true;
              }
            })
            .modify((value) => (value.attrs[属性名] = this.属性对象[属性名]));
        }
        if (this.当前对象数据.type == "card") {
          await this.$数据库.cardpresets.put(this.预设);
          await this.$数据库.cards
            .filter((data) => {
              if (data.subtype == this.预设名) {
                return true;
              }
            })
            .modify((value) => (value.attrs[属性名] = this.属性对象[属性名]));
        }
      }
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
        // console.log(this.预设列表);
      }
      if (this.当前对象数据.type == "card") {
        //  console.log(this.预设列表);

        await this.$数据库.cardpresets.put(预设项目);
      }
      await this.获取预设();
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
        //console.log(this.预设列表);
      }
      if (this.当前对象数据.type == "card") {
        // console.log(this.预设列表);

        await this.$数据库.cardpresets.put(预设项目);
      }
      await this.获取预设();
      let 预设名 = this.预设名 + "";
      this.预设名 = "";
      this.预设名 = 预设名;
    },
    获取预设: async function () {
      if (this.当前对象数据.type == "link") {
        this.预设列表 = await this.$数据库.linkpresets.toArray();
        //  console.log(this.预设列表);
      }
      if (this.当前对象数据.type == "card") {
        //  console.log(this.预设列表);

        this.预设列表 = await this.$数据库.cardpresets.toArray();
      }
      if (this.预设名 && this.当前对象数据.type == "card") {
        await this.$数据库.cardpresets
          .filter((data) => {
            if (data.name == this.预设名) {
              return true;
            }
          })
          .toArray((array) => (array[0] ? (this.预设 = array[0]) : null));
      }
      if (this.预设名 && this.当前对象数据.type == "link") {
        await this.$数据库.linkpresets
          .filter((data) => {
            if (data.name == this.预设名) {
              return true;
            }
          })
          .toArray((array) => (array[0] ? (this.预设 = array[0]) : null));
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

      if (this.当前对象数据.type == "link") {
        try {
          await this.$数据库.linkpresets.put(新预设);
          this.重命名计数 = 1;
        } catch (e) {
          //  console.log(e);
          this.新预设名 = this.新预设名 + this.$用Lute生成时间戳();
          this.重命名计数 = this.重命名计数 + 1;
          this.新建预设();
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
        }
      }
    },

    设定当前标记: function (val, flag) {
      let 上传数据 = { id: "", subtype: this.预设.name, attrsproxy: {} };
      上传数据.id = this.当前对象数据.id;
      上传数据.type = this.当前对象数据.type;

      let 属性列表 = this.属性列表;

      for (序号 in 属性列表) {
        let 属性名 = 属性列表[序号];
        上传数据["attrsproxy"][属性名] = val[属性名];
        if (this.预设.attrs && flag) {
          //  console.log(this.预设.attrs);
          if (this.预设.attrs[属性名] != "byref") {
            this.变更预设值(属性名);
          }
        }
      }

      if (this.当前对象数据.type == "card") {
        this.$事件总线.$emit("保存卡片", 上传数据);
      }
      if (this.当前对象数据.type == "link") {
        this.$事件总线.$emit("保存链接", 上传数据);
      }
    },
    resizing: function (x, y, w, h) {
      this.工具栏高度 = h;
      this.工具栏宽度 = w;
    },
    设定链接(link) {
      this.$数据库.links.put(link);
    },
    以id获取反向链接: async function (id) {
      let that = this;
      // console.log("aaa", this.$思源伺服ip);
      if (id) {
        let 原始反向链接列表 = await 以id获取反向链接(that.思源伺服ip, this.apitoken, id);
        return 原始反向链接列表["data"];
      }
    },
    以id获取正向链接: async function (id) {
      this.思源伺服ip = window.location.host;
      let obj = {};
      let sql = `select * from blocks where id in (select def_block_id from refs where block_id = '${id}')`;
      obj = await 以sql向思源请求块数据(this.思源伺服ip, this.apitoken, sql);
      // console.log(obj);
      return obj;
    },
  },
};
</script>
<style scoped>
.el-drawer__wrapper {
  width: 30vw !important;
  position: fixed;
  left: 70vw;
  top: 0;
  float: right;
}
</style>
