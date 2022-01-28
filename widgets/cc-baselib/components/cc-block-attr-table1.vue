 <template>
    <el-table
        :data="块属性列表"
        v-if="重组完成&&显示模式['表格']"
        style="margin:0px"
        >
        <el-table-column  
            label="标题|内容"
            prop="content"
            >
            <template slot-scope="scope">
                
                    <el-popover 
                    placement="right"
                    width="200"
                    trigger="hover"
                    >
                    <div slot='reference'>
                            <i class="el-icon-arrow-right" v-if="当前内容块序号==scope.$index"></i>
                        <div @click="显示模式['表单']=true;当前内容块序号=scope.$index">{{scope.row.title||scope.row.content}}</div>
                    </div>
                    <el-link @click="窗口内打开(scope.row.id)">{{scope.row.box}}{{scope.row.hpath}}</el-link>
                </el-popover>
            </template> 
        </el-table-column>
        <el-table-column
        label="基础属性"
        v-if="显示基础属性">
            <el-table-column  
            label="命名"
            prop="name"
            >
                <template slot-scope="scope" >
                    <el-input
                    class = "noborder" 
                    v-model="scope.row.name"
                    @change="设定块属性(scope.row.id,'name',scope.row.name,scope.row['type'],scope.row)"
                    size = "mini"
                    ></el-input>
                </template>                
            </el-table-column>
            <el-table-column  
            label="书签"
            prop="bookmark"
            
            >
                <template slot-scope="scope" >
                    <el-select
                            size="mini"
                            v-model="scope.row.bookmark"
                            @change="设定块属性(scope.row.id,'bookmark',scope.row.bookmark,scope.row['type'],scope.row)"
                            @input="设定块属性(scope.row.id,'bookmark',scope.row.bookmark,scope.row['type'],scope.row)"
                            clearable
                            filterable
                            allow-create
                            >
                            <el-option
                            v-for="item in 书签列表"
                            :label="item"
                            :value="item"
                            ></el-option>
                    </el-select>
                </template>                
            </el-table-column>
            <el-table-column  
            label="别名"
            prop="alias"
            >
            <template slot-scope="scope" >
                <el-input
                class = "noborder" 
                v-model="scope.row.alias"
                @change="设定块属性(scope.row.id,'alias',scope.row.alias,scope.row['type'],scope.row)"
                size = "mini"
                ></el-input>
            </template>                
            </el-table-column>
            <el-table-column  
                label="备注"
                prop="memo"
                >
                <template slot-scope="scope" >
                    <el-input
                    class = "noborder" 
                    v-model="scope.row.memo"
                    @change="设定块属性(scope.row.id,'memo',scope.row.memo,scope.row['type'],scope.row)"
                    size = "mini"
                    ></el-input>
                </template>                
                </el-table-column>
                    <el-table-column
                        label="样式"
                        prop="style"
                        >
                    <template slot-scope="scope">
                        <div v-if="scope.row.type!='d'&&scope.row.type!='doc'">
                        <el-popover 
                        placement="right"
                        title="设定块样式"
                        width="400"
                        trigger="click">
                        <el-input type="textarea" v-model="scope.row.style" @change="设定块属性(scope.row.id,'style',scope.row.style,scope.row.type,scope.row)"></el-input>
                        <div slot="reference">
                        <div v-bind:style="scope.row.style"  >{{scope.row.content}}</div>
                        </div>
                        </el-popover>
                        </div>
                        <div v-if="scope.row.type=='d'||scope.row.type=='doc'">文档块无样式</div>
                    </template>
                </el-table-column>
                </el-table-column>
                <el-table-column
                    label="自定义属性"
                    v-if="显示自定义属性">
                    <template slot="header" slot-scope="scope" >
                        <span>自定义属性</span>                             
                    </template>
                        <el-table-column  
                        v-for="(item,i)  in 自定义属性名列表对象 "
                        :key = "item['name']"
                        :label="item['标签列表'][0]"
                        :prop="item['name']"
                        v-if="!item['hide']"  
                        >
                        <template slot="header" slot-scope="scope" >
                            <el-popover 
                            placement="right"
                            title="样式"
                            width="400"
                            @show="设定全部表头(块属性列表)"
                            trigger="click"
                            >
                            <el-divider></el-divider>
                                <div><span>属性标签</span>
                                <el-select v-model="item['属性标签']"
                                default-first-option
                                size="mini"
                                filterable
                                allow-create
                                >
                                    <el-option
                                    v-for =  "属性标签 in  item['标签列表']"
                                    :label = "属性标签"
                                    :value = "属性标签"
                                    >
                                    </el-option>
                                </el-select>
                                <el-button size="mini" @click="应用全部(item['name'],'label',item['属性标签'])" >应用到全部</el-button>
                                </div>

                                <div><span>属性数值</span>
                                <el-select 
                                default-first-option
                                v-model="item['属性值']"
                                size="mini"
                                filterable
                                allow-create
                                >
                                    <el-option
                                    v-for =  "属性值 in  item['值列表']"
                                    :label = "属性值"
                                    :value = "属性值"
                                    >
                                    </el-option>
                                </el-select>
                                <el-button size="mini" @click="应用全部(item['name'],'value',item['属性值'])" >应用到全部</el-button>
                                </div>

                                <div><span>属性类型</span>
                                <el-select 
                                v-model="item['属性类型']"
                                default-first-option
                                size="mini"
                                >
                                    <el-option
                                    v-for =  "属性类型 in  属性类型"
                                    :label = "属性类型"
                                    :value = "属性类型"
                                    >
                                    </el-option>
                                </el-select>
                                <el-button size="mini"  @click="应用全部(item['name'],'type',item['属性类型'])" >应用到全部</el-button>
                                </div>
                                <el-divider></el-divider>
                            
                                <el-row  >
                                   
                                        <el-button @click="初始化列表自定义属性(item['name'],'初始化空值')" size="mini">初始化空值</el-button>
                                 
                                        <el-button @click="初始化列表自定义属性(item['name'],'全部初始化')" size="mini">全部初始化</el-button>
                                </el-row>
                                <el-divider v-if="item['默认值']" ></el-divider>
                                <el-row v-if="item['默认值']">
                                        <el-button @click="初始化列表自定义属性(item['name'],'全部初始化',item['默认值'])" size="mini">全部默认</el-button>
                        
                                        <el-button @click="初始化列表自定义属性(item['name'],'全部初始化',item['默认值'])" size="mini">空值默认</el-button>
                                        <el-divider v-if="item['默认值']" ></el-divider>
                                        <div>默认为:{{默认值转义(item['默认值'])}}</div>
                                        <el-divider v-if="item['默认值']" ></el-divider>
                                        <custom-attr-shower
                                                    :属性类型="属性类型"
                                                    :属性名="item['name']"
                                                    v-model="item['默认值']"
                                                    :显示原始自定义属性="false"
                                                    :思源伺服ip="思源伺服ip"
                                                    :apitoken="apitoken"
                                                    @change="item['解析值']=$event"
                                                    @hide="设定块属性(集合规则块['id'],item['name'],item['默认值'],集合规则块['type'],集合规则块)"
                                                    :主界面="主界面"
                                                    style="min-height:30px"
                                                    >
                                        </custom-attr-shower>
                                </el-row>
                                <el-divider ></el-divider>
                                <el-row>
                                    <el-col :span="6">
                                    
                                        <el-button @click="删除列表自定义属性(item['name'])" size="mini">全部删除</el-button>
                                   </el-col>
                                </el-row>
                                <div class="dark-on-hover fullfill" slot="reference">
                                <div>{{item['name']}}</div>  
                                <div v-if="item['属性标签']" style="color:lightblue">{{item['属性标签']}}</div>  
                                <div class="el-icon-close"></div>
                                </div>
                        </el-popover>                           
                        </template>
                        <template slot-scope="scope" >
        
                            <custom-attr-shower
                                :属性类型="属性类型"
                                :属性名="item['name']"
                                v-model="scope.row[item['name']]"
                                :显示原始自定义属性="显示原始自定义属性"
                                :思源伺服ip="思源伺服ip"
                                :apitoken="apitoken"
                                v-if="scope.row[item['name']]"
                                @change="scope.row[item['name']+'对象']=$event"
                                @hide="设定块属性(scope.row.id,'custom-'+item['name'],scope.row[item['name']],scope.row['type'],scope.row)"
                                :主界面="主界面"
                                >
                            </custom-attr-shower>
                            <el-input
                                class = "noborder" 
                                :placeholder="'无'+item['name']"
                                @focus="$set(scope.row,item['name'],'default')"
                                size = "mini"
                                v-if="!scope.row[item['name']]"
                            ></el-input>                           
                        </template>                
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </template>