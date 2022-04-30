<template>
    <div>
        <el-container>
            <el-header style="max-height:30px !important">
                   <el-row >
                        <el-col :span="6">
                        <el-link @click="窗口内打开(集合规则块['id'])" v-if="集合规则块">集合设定位于:{{集合规则块['hpath']}}</el-link>
                        </el-col>
                        <el-col :span="6">
                        <el-button @click="获取块属性列表(realsql);重组完成=true" v-if="!重组完成" size="mini">获取</el-button> 
                        <el-button @click="获取块属性列表(realsql);" v-if="重组完成"  size="mini">刷新</el-button>                             
                        <el-button @click="获取块属性列表(realsql),显示模式['表单']=false,显示模式['表格']=false,显示模式['看板']=true,显示模式['表单最大化']=false"  v-if="重组完成&&!显示模式['看板']"  size="mini">显示看板</el-button>                             
                        <el-button @click="获取块属性列表(realsql),显示模式['表格']=true,显示模式['看板']=false,显示模式['表单最大化']=false" v-if="显示模式['看板']" size="mini">返回表格</el-button>
                        </el-col>
                        <el-col :span="6">
                        <el-input-number v-if="!显示模式['看板']" :min="0" :max="1000" v-model ="块数量限制" size =mini></el-input-number>               
                        </el-col>
                        <el-col :span="6">
                        <custom-attr-constructor
                        v-model="列表新属性"
                        :属性类型="属性类型"
                        :已有属性列表="自定义属性名列表对象"
                        @hide="增加列表自定义属性(列表新属性);"
                        v-if="!显示模式['看板']"
                         :思源伺服ip="思源伺服ip"
                          :apitoken="apitoken"
                        ></custom-attr-constructor>
                        </el-col>
                     </el-row>
            </el-header>
            <el-main style="margin: 0 !important">
            <el-container>
            <el-aside v-if="显示模式['表单']"  :width="asidwidth"> 
                <el-row >
                <el-col :span="9"><div @click= "查找上一个块()"><i class="el-icon-arrow-left" ></i>显示下一个块属性</div></el-col>
                <el-col :span="9"><div @click= "查找下一个块()">显示下一个块属性<i class="el-icon-arrow-right" ></i></div></el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row >
                <el-col :span="6"> <div @click= "显示模式['表单']=false,显示模式['表格']=true">关闭</div></el-col>
                <el-col :span="6"> <div @click= "显示模式['表单最大化']=true,显示模式['表格']=false">最大化</div></el-col>
                <el-col :span="6"> <div @click= "显示模式['表单最大化']=false,显示模式['表格']=true">还原</div></el-col>
                </el-row>
                 <el-divider></el-divider>
                <el-link @click="窗口内打开(当前内容块id)">{{当前内容块id}}</el-link>
                <el-divider></el-divider>
                <cc-block-attr-form
                    :主界面="主界面"
                    :apitoken="apitoken"
                    :思源伺服ip="思源伺服ip"
                    :内容块id="当前内容块id"
                    :是否显示基础属性="显示基础属性"
                    :是否显示源属性名="显示源属性名"
                    :是否显示原始自定义属性="显示原始自定义属性"
                    :是否显示自定义属性="显示自定义属性"
                    :新属性模板="新属性"
                    :属性类型="属性类型"
                    :书签列表="书签列表"
                    >
                </cc-block-attr-form>
                <el-divider></el-divider>
            </el-aside>
            <el-main style="padding:0px">
                <cc-block-kanban  
                :源块列表="块属性列表" 
                :源属性名列表="属性名列表"
                :主界面="主界面"
                :属性类型="属性类型"
                :思源伺服ip="思源伺服ip"
                v-if="显示模式['看板']"
                ></cc-block-kanban>
            
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
            </el-main>
            </el-container>
            </el-main>
        </el-container>
    </div>
</template>
<script>

    module.exports={
        name:"custom-block-attr-table",
        components:componentsList,
        props:["集合规则块","显示源属性名","当前文档信息","sql","显示基础属性","思源伺服ip","apitoken","主界面","显示自定义属性","显示原始自定义属性","属性类型","新属性","书签列表"],
        model:{
            event:"hide",
            prop:"新属性"
        },
       
        mounted: function () {
                this.realsql=this.解析模板sql(this.sql)+`limit ${this.块数量限制}`
                 this.获取块属性列表(this.realsql)
                },
        data(){
            return{
                显示模式:{"表单":false,"看板":false,"表格":true,'表单最大化':false,'看板最大化':false},
                当前内容块序号:0,
                realsql:"",
                块数量限制:32,
                基础属性列表:[
                            {"label":"命名","value":"name"},
                            {"label":"别名","value":"alias"},
                            {"label":"备注","value":"memo"},
                            {"label":"书签","value":"bookmark"},
                            ],
                块属性列表:[],
                自定义属性名列表对象:{},
                列表新属性:this.新属性,
                集合规则对象:{},
                重组完成:false,
                临时属性对象:{},
                临时信息对象:{},
                属性名列表:"",
                看板属性:"",
            }
        },
        computed:{
            当前内容块id(){
                let that =this
                return that.块属性列表[that.当前内容块序号]["id"]
            },
            asidwidth(){
                if (this.显示模式['表单最大化']){
                    return "100%"
                }
                else if (this.显示模式['表单']){
                    return "40%"
                } 
            },
     
        },
        watch:{
           sql(newsql){
               this.realsql=this.解析模板sql(newsql)+`limit ${this.块数量限制}`
                this.获取块属性列表(this.realsql)
            },
            自定义属性名列表对象(val){
                this.属性名列表=JSON.parse(JSON.stringify(val))
           //     console.log(this.属性名列表)
            }
        },
        
        methods:{
            默认值转义:function(默认值){
                let 转义值 = html转义(默认值)
                let 最终值 = 转义值.replace("\"value\"\:","默认数值:")
                 最终值 = 最终值.replace("\"type\"\:","默认类型:")
                 最终值 = 最终值.replace("\"label\"\:","默认标签:")
                    return 最终值
            },
            查找上一个块: function(){
                let that = this
                 let 序号 = that.当前内容块序号
                if (that.块属性列表[序号-1]){that.当前内容块序号=that.当前内容块序号-1}
            },
            查找下一个块: function(){
                let that = this
                let 序号 = that.当前内容块序号
                if (that.块属性列表[序号+1]){that.当前内容块序号=that.当前内容块序号+1}
                
            },
            解析模板sql(sql){
                let tempsql = sql.slice(0)
                let 块信息=this.当前文档信息
                tempsql = tempsql.replace(/\.action\{\.id\}/g,块信息["id"])
                tempsql = tempsql.replace(/\.action\{\.content\}/g,this.当前文档信息["content"])
                tempsql = tempsql.replace(/\.action\{\.alias\}/g,this.当前文档信息["alias"])
                tempsql = tempsql.replace(/\.action\{\.name\}/g,this.当前文档信息["name"])
                tempsql = tempsql.replace(/\.action\{\.updated\}/g,this.当前文档信息["updated"])
                tempsql = tempsql.replace(/\.action\{\.hpath\}/g,this.当前文档信息["hpath"])
                tempsql = tempsql.replace(/\.action\{\.path\}/g,this.当前文档信息["path"])
                tempsql = tempsql.replace(/\.action\{\.aspath\}/g,this.当前文档信息["path"].slice(0, this.当前文档信息["path"].length - 3))
             //  console.log("tempsql",tempsql)
                return tempsql
            },
           
            删除列表自定义属性:async function(属性名){
                let that = this
                let 块属性列表 =  that.块属性列表
                for(i=0;i<块属性列表.length;i++){
                    that.设定块属性(块属性列表[i]["id"],"custom-"+属性名,"",块属性列表[i]['type'],块属性列表[i])
                }
                that.自定义属性名列表对象[属性名] = undefined
                delete that.自定义属性名列表对象[属性名]
            },
             增加列表自定义属性:async function(新属性){
                let that = this
                let 块属性列表 =  that.块属性列表
                let 新属性名 = 新属性["name"]
                
                while (that.自定义属性名列表对象[新属性名])
                {新属性名="new"+新属性名}
                
                
                
                let 新属性对象 = {"value":新属性["value"],"label":新属性["label"],"type":新属性["type"]}
                let 新属性文本 = JSON.stringify(新属性对象)
                for(i=0;i<块属性列表.length;i++){
                    this.$set(块属性列表[i],新属性名,新属性文本)
                    await that.设定块属性(块属性列表[i]["id"],"custom-"+新属性名,新属性文本,块属性列表[i]['type'],块属性列表[i])
                    if (!that.自定义属性名列表对象[新属性名]){
                    that.$set(that.自定义属性名列表对象,新属性名,{"name":新属性名,"标签列表":[],"值列表":[],"hide":false})
                    let 属性名对象 = that.自定义属性名列表对象[新属性名]
                    属性名对象["标签列表"].push(新属性对象["label"])
                    属性名对象["值列表"].push(新属性对象["value"])
                    }
                    else{  
                        let 属性名对象 = that.自定义属性名列表对象[新属性名]
                        属性名对象["标签列表"].push(新属性对象["label"])
                        属性名对象["值列表"].push(新属性对象["value"])
                    }
                }
                await that.获取块属性列表(that.sql+`limit ${this.块数量限制}`)
              //  console.log(that.自定义属性名列表对象)
            },
                校验属性名(属性名){
                属性名=属性名.replace(/[^\a-\z\A-\Z0-9]/g,"")
                this.新属性名=属性名
             //   console.log(属性名)
                },
                返回属性对象:function(){
                    let realvalue={"name":this.新属性名,"value":this.新属性值,"label":this.属性标签,"type":this.新属性类型}
                //    console.log("aaaa",realvalue)
                    this.$emit("hide",JSON.parse(JSON.stringify( realvalue)))
                },
                获取块属性列表:async function (sql){
                    let that = this
                    this.重组完成=false
                    that.块列表=[]
                    块属性列表 =  await 以sql向思源请求块数据(that.思源伺服ip,that.apitoken,sql)
                    that.自定义属性名列表对象={}
                    if(块属性列表){
                   // for (i=0;i<块属性列表.length;i++){that.块属性列表[i]=块属性列表[i]}
                    await that.重组列表自定义属性(块属性列表)
                    }
                },
                重组列表自定义属性:async function(块列表){
                    let that = this
                    
                  //  console.log("块列表",块列表)
                 //  console.log("列表长度",块列表.length)
                //    块列表 =JSON.parse(JSON.stringify(块列表))
                 //   console.log(块列表)
                    for(i=0;i<块列表.length;i++){
                        let 块信息 = 块列表[i]
                        await aaa(块信息)
                        async function aaa(块信息){
                     //   console.log("a",块信息)
                        
                        let id =  块信息["id"]
                        that.临时属性对象 = await  以id获取思源块属性(that.思源伺服ip,that.apitokn,id)
                        that.临时信息对象 = await that.通过id获取文档属性(id)
                        临时属性对象=that.临时属性对象
                        临时信息对象=that.临时信息对象
                      //  console.log("临时属性对象",临时属性对象)
                     //   console.log("临时信息对象",临时信息对象)
                        for(属性名 in 临时信息对象){if(属性名!="ial"){临时属性对象[属性名]=临时信息对象[属性名]}}
                        for(属性名 in 临时信息对象["ial"]){临时属性对象[属性名]=临时信息对象["ial"][属性名]}
                      //  console.log("临时属性对象",临时属性对象)
                      //  console.log("临时信息对象",临时信息对象)

                        for(属性名 in 临时属性对象){
                            let 属性值 = 临时属性对象[属性名]
                            if (属性名.slice(0,6)=="custom"){
                                属性名 = 属性名.slice(7)
                                if(!that.自定义属性名列表对象[属性名]){    
                                that.$set(that.自定义属性名列表对象,属性名,{"name":"","类型列表":[],"属性类型":"","标签列表":[],"属性标签":"","属性值":"","值列表":[],"hide":false})
                                that.自定义属性名列表对象[属性名]["name"]=属性名
                            }
                            }
                            属性值 = that.html转义(属性值)
                            
                                块信息[属性名]=属性值
                              
                            }
                       //     console.log(i,块列表[i])
                        }
                        }
                   //     console.log("列表",块列表)
                    
                    for(i=0;i<块列表.length;i++) {
                        let 块信息 = 块列表[i]
                        for (自定义属性名 in that.自定义属性名列表对象){
                            if(块信息[自定义属性名]){}
                           // else (this.$set(块信息,自定义属性名,null))
                        }    
                    }
                    if (that.集合规则块){
                        let 集合规则块 = that.集合规则块
                        that.集合规则对象 = {"生效":true}
                     ///   console.log("集合规则块",集合规则块)
                        let 临时块信息= await  以id获取思源块属性(that.思源伺服ip,that.apitokn,集合规则块["id"])
                        临时块信息 =临时块信息
                        let 集合规则对象=临时块信息
                        for (item in 集合规则对象){
                            if (item.slice(0,6)=="custom"){
                               that.$set(that.集合规则对象,item.slice(7),集合规则对象[item])
                            }
                        }

                       /// console.log("集合规则对象",集合规则对象)
                        /// console.log("集合规则对象",that.集合规则对象)

                    }
                    for (item in that.自定义属性名列表对象){
                        
                            let 属性名 =item
                            if (!that.集合规则对象[属性名]&&that.集合规则对象["生效"]){
                                that.自定义属性名列表对象[属性名]["hide"]=true
                              //  console.log("自定义属性名列表对象",that.自定义属性名列表对象)
                            
                        }   
                    }
                    for (item in that.集合规则对象){
                        
                            let 属性名 =item
                            if (!that.自定义属性名列表对象[属性名]&&that.集合规则对象["生效"]){
                                that.$set(that.自定义属性名列表对象,属性名,{"name":属性名,"类型列表":[],"属性类型":"","标签列表":[],"属性标签":"","属性值":"","值列表":[],"hide":false})
                              //  console.log("自定义属性名列表对象",that.自定义属性名列表对象)
                        }   
                    }
                    for (item in that.集合规则对象){
                        
                            let 属性名 =item
                            if (that.集合规则对象["生效"]){
                                let string = that.集合规则对象[属性名]+""
                               // console.log(string)
                                

                                that.自定义属性名列表对象[属性名]["默认值"]=string
                               // console.log("自定义属性名列表对象",that.自定义属性名列表对象)
                        }   
                    }
                    delete that.自定义属性名列表对象["生效"]
                    that.块属性列表=JSON.parse(JSON.stringify( 块属性列表))
                //  console.log(that.块属性列表)
                    this.重组完成=true

                },
               
                设定全部表头(块属性列表){
                    let that =this
                //    console.log(块属性列表)
                    for(i=0;i<块属性列表.length;i++){
                        let 块信息=块属性列表[i]
                        for (属性名 in 块信息){
                            if (that.自定义属性名列表对象[属性名]){
                                let 属性对象 = 块信息[属性名+"对象"]
                                if(属性对象){
                                this.设定表头(属性对象,属性名)
                             //   console.log(属性对象,属性名)
                             }
                            }
                        }
                    }
                },
                设定表头(对象,属性名){
                    let that = this
                    if(!that.自定义属性名列表对象[属性名]){
                                that.$set(that.自定义属性名列表对象,属性名,{"name":"","类型列表":[],"属性类型":"","标签列表":[],"属性标签":"","属性值":"","值列表":[],"hide":false})
                                that.自定义属性名列表对象[属性名]["name"]=属性名
                                }
                    let 标签列表 = Array.from(that.自定义属性名列表对象[属性名]["标签列表"])
                    标签列表.push(对象["label"]) 
                    that.自定义属性名列表对象[属性名]["标签列表"]=Array.from(new Set(标签列表))

                    let 值列表= Array.from(that.自定义属性名列表对象[属性名]["值列表"])
                    值列表.push(对象["value"]) 
                    that.自定义属性名列表对象[属性名]["值列表"]=Array.from(new Set(值列表))

                    let 类型列表= Array.from(that.自定义属性名列表对象[属性名]["类型列表"])
                    类型列表.push(对象["type"])
                    that.自定义属性名列表对象[属性名]["类型列表"]=Array.from(new Set(类型列表))
                 //   console.log(标签列表,值列表,类型列表)
                },
                窗口内打开:async function(id){
                    let that = this
                    id = id.replace("((","").replace("))","")
                    let 虚拟链接 =  that.主界面.createElement("span")
                    虚拟链接.setAttribute("data-type","block-ref")
                    虚拟链接.setAttribute("data-id",id)
                    let 临时目标 = that.主界面.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
                //  console.log(临时目标)
                    临时目标.appendChild(虚拟链接)
                    let 点击事件 =  that.主界面.createEvent('MouseEvents')
                    点击事件.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    虚拟链接.dispatchEvent(点击事件);
                    虚拟链接.remove()
                },
                设定块属性:async function (id,属性名,属性值,块类型,块对象){
                    let that =this
                    await 设置思源块属性(that.思源伺服ip,that.apitoken,id,属性名,属性值)
                    this.设定块属性元素(id,块类型,块对象)
                },
                 html转义(原始字符串){
                    var 临时元素 = document.createElement("div"); 
                    临时元素.innerHTML = 原始字符串; 
                    var output = 临时元素.innerText || 临时元素.textContent; 
                    临时元素 = null; 
                ///  console.log(output)
                    return output; 
                },
                应用全部(属性名,属性选项名,属性选项值){
                    let 块属性列表= this.块属性列表
                    for (i=0;i<this.块属性列表.length;i++){
                        let id = this.块属性列表[i]["id"]
                        let 属性对象 = this.块属性列表[i][属性名+'对象'] 
                        if(属性对象){
                        属性对象[属性选项名]=属性选项值
                        this.块属性列表[i][属性名] =JSON.stringify(属性对象)
                       // console.log(id,this.块属性列表[i])
                        this.设定块属性(id,"custom-"+属性名,this.块属性列表[i][属性名],this.块属性列表[i]['type'],this.块属性列表[i])
                        }
                    }
                },
                初始化列表自定义属性(属性名,选项,默认值){
                    let 块属性列表= this.块属性列表
                    let 源属性对象= JSON.parse(JSON.stringify(this.自定义属性名列表对象[属性名]))
                    let 属性对象 ={"label":源属性对象["属性标签"],"type":源属性对象["属性类型"],"value":源属性对象["属性值"]}
                   // console.log('初始化为',属性对象)
                    if(!属性对象["label"]){属性对象["label"]=属性名}
                    if(!属性对象["type"]){属性对象["type"]="原始文本"}
                    if(!属性对象["value"]){属性对象["value"]="default"}
                    for (i=0;i<this.块属性列表.length;i++){
                       // console.log(this.块属性列表[i])
                            
                                let id = this.块属性列表[i]["id"]
                                if(选项=="全部初始化"){
                                    if(默认值){this.块属性列表[i][属性名]=默认值}
                                    else{this.块属性列表[i][属性名] =JSON.stringify(属性对象);}
                                    this.设定块属性(id,"custom-"+属性名,this.块属性列表[i][属性名],this.块属性列表[i]['type'],this.块属性列表[i])
                                    }
                                else if (选项=="初始化空值"&&!this.块属性列表[i][属性名]){
                                    if(默认值){this.块属性列表[i][属性名]=默认值}
                                    else {this.块属性列表[i][属性名] =JSON.stringify(属性对象)}
                                    this.设定块属性(id,"custom-"+属性名,this.块属性列表[i][属性名],this.块属性列表[i]['type'],this.块属性列表[i])
                                }
                        }
                },
                通过id获取文档属性:async function(id){
                let that = this 
                let obj ={}
                await axios({
                    method:"post",
                    url:'http://'+that.思源伺服ip + '/api/block/getDocInfo',
                    headers:{'Authorization': 'Token '+ that.apitoken },
                    data:({"id":`${id}`})
                    }).then(
                        result=>{
                          //  console.log(result.data)
                            obj = result.data["data"]
                            if (result.data["data"]['refCount']){
                            obj.块被引用数 = result.data["data"]['refCount']}
                        }
                    )
                return obj
            },
             设定块属性元素(id,内容块类型,块对象){
                let that =this
               // console.log("内容块类型",内容块类型)
                let 属性元素 = this.通过id和块类型查找属性元素(id,内容块类型)
             //   console.log("属性元素",属性元素)
                let 属性元素内容 =  this.以当前属性生成属性元素内容(块对象)
                if(属性元素){
                   属性元素.innerHTML = 属性元素内容  
                } 
                let 块元素 = that.主界面.querySelector(`.protyle-wysiwyg [data-node-id='${id}']`)
                if(块元素){
                    块元素.setAttribute("name",块对象["name"])
                    块元素.setAttribute("alias",块对象["alias"])
                    块元素.setAttribute("memo",块对象["memo"])
                    块元素.setAttribute("bookmark",块对象["bookmark"])
                    块元素.setAttribute("style",块对象["style"])
                    
                }
            },
            以当前属性生成属性元素内容(块对象){
                let that = this
                let 书签 = 块对象["bookmark"]
                let 命名 = 块对象["name"]
                let 别名 = 块对象["alias"]
                let 备注 = 块对象["memo"]
                let 被引用数 = 块对象['块被引用数']
               
                let 临时书签元素 = document.createElement('div')
                if (书签!=""&&书签){
                    临时书签元素.innerHTML = `<div class="protyle-attr--bookmark">${书签}</div>`}
                let 临时命名元素 = document.createElement('div')
                if (命名!=""&&命名){
                临时命名元素.innerHTML = `<div class="protyle-attr--name"><svg><use xlink:href="#iconN"></use></svg>${命名}</div>`}
                let 临时别名元素 = document.createElement('div')
                if (别名!=""&&别名){
                    临时别名元素.innerHTML = `<div class="protyle-attr--alias"><svg><use xlink:href="#iconA"></use></svg>${别名}</div>`}
                let 临时备注元素 = document.createElement('div')
                if (备注!=""&&备注){
                临时备注元素.innerHTML =`<div class="protyle-attr--memo b3-tooltips b3-tooltips__nw" aria-label="${备注}"><svg><use xlink:href="#iconM"></use></svg></div>`
                }
                let 临时反引元素 = document.createElement('div')

                if (被引用数!=0&&被引用数){
                    临时反引元素.innerHTML =`<div class="protyle-attr--refcount popover__block" data-id="${被引用数}" style="">${被引用数}</div>`
                }
                let 属性元素内容 = 临时书签元素.innerHTML+ 临时命名元素.innerHTML+临时别名元素.innerHTML+临时备注元素.innerHTML+临时反引元素.innerHTML
                return 属性元素内容
            },
            通过id和块类型查找属性元素(id,块类型){
                let that = this 
                let 主界面 = that.主界面
              ///  console.log(主界面)
                if(块类型=="d"||块类型=="doc"){
                    let 文档标题元素 =  主界面.querySelector(`.protyle-background[data-node-id='${id}']+.protyle-title`)
                   // console.log(文档标题元素)
                   if(文档标题元素){
                    let   文档属性元素 =  文档标题元素.querySelector(".protyle-attr")
                    
                  //  console.log(文档属性元素)
                    return 文档属性元素}
                }
                else{
                    let 块元素 = 主界面.querySelector(`.protyle-wysiwyg [data-node-id='${id}']`)
                  //   console.log(块元素)
                    if (块元素){
                    let 块属性元素 =  块元素.querySelector(".protyle-attr")
                 //   console.log(块属性元素)
                    return 块属性元素
                    
                    }
                }

            },

        }
    }
</script>
<style>
    div.dark-on-hover:hover {
        background-color: rgba(128, 128, 128, 0.329);
    } 
    div.fullfill{
        margin: 0;
        padding:0;
    }  
</style>