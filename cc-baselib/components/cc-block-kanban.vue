<template>
    <div style="min-width:100%">
        <el-select v-model="分组属性" size="mini">
            <el-option
            v-for="属性名 in 属性名列表"
            :label="属性名.label||属性名.name"
            :key="属性名.name"
            :value="属性名.name"
            >
            </el-option>
        </el-select>
        <el-divider></el-divider>
        <el-row :gutter="20" >
           <el-col :span="8" v-for="块分组 in 块分组列表" :key="块分组['属性值']"> 
                <el-popover
                    placement="right"
                    title=""
                    width="400"
                    trigger="click">
                     <custom-attr-shower
                                :属性类型="属性类型"
                                :属性名="块分组['属性名']"
                                v-model="块分组['属性值']"
                                :显示原始自定义属性="false"
                                :思源伺服ip="思源伺服ip"
                                :apitoken="apitoken"
                                @change="块分组['解析值']=$event"
                                @hide="设定块列表(块分组['块列表'],分组属性,块分组['属性值'])"
                                :主界面="主界面"
                                style="min-height:30px"
                                >
                    </custom-attr-shower>
             
                    <h2
                    slot="reference" 
                    style="max-height:30px 
                    !important">
                    {{块分组["解析值"]['label']||块分组["解析值"]['value']||块分组["解析值"]||块分组['属性值']}}
                    </h2>
                  </el-popover>
              
                <el-divider></el-divider>
                <draggable tag="div" v-model="块分组['块列表']"  @change="设定块列表(块分组['块列表'],分组属性,块分组['属性值'])" class="drag-container" group="1" :options="options">
                            <el-card v-for="块信息 in 块分组['块列表']" :title="块信息['name']||块信息['content']"  >
                                <el-Popover 
                                  placement="right"
                                title=""
                                width="400"
                                trigger="hover">
                                    <div><span>id:{{ 块信息['id'] }}</span></div>
                                    <div><span>最后一次编辑于:{{ 块信息['updated'] }}</span></div>
                                    <div>类型:{{块信息['type']}}</div>
                                    <el-link @click="窗口内打开(块信息['id'])" >路径:{{ 块信息['hpath']}}</el-link>
                                    <div slot="reference" >{{块信息['content']}}</div>
                                </el-Popover >
                            </el-card>
                </draggable>
            </el-col>
        </el-row>       
    </div>
</template>

<script  >

    module.exports={
        name:"cc-block-kanban",
        components:{vuedraggable,"custom-attr-shower":"url:components/custom-attr-shower.vue"},
        props:[
                "源属性名列表",
                "源块列表",
                "主界面",
                "属性类型",
                "思源伺服ip",
                "apitoken",
              
               ],
        mounted(){
            this.源属性名列表字符串=JSON.stringify(this.源属性名列表)
       },
        data(){
            return {
                块列表:[],
                属性名列表:[],
                分组属性:"",
                块分组列表:[],
                options: {
                    dropzoneSelector: ".drag-inner-list",
                    draggableSelector: ".drag-item"
                },
                源属性名列表字符串:""
                }
        },
        watch:{
            源属性名列表字符串(val){
                let that =this 
              //  console.log("1sdad",that.源属性名列表)
                if(this.块列表){
                this.块列表=JSON.parse(JSON.stringify(this.源块列表))
                /*这里传入字符串是为了防止vue无法监听*/
                let 属性名列表 = JSON.parse(this.源属性名列表字符串)
                this.属性名列表 =属性名列表
                let 块列表= this.块列表
                for(属性名 in 属性名列表){
                    属性名列表[属性名]["值列表"]={}
                }
              //  console.log("2dasd",属性名列表,块列表)
                for (i=0;i<块列表.length;i++){
                    for (属性名 in 属性名列表){
                        if (块列表[i][属性名]){
                            let 属性值 = 块列表[i][属性名].slice(0)
                            if(!属性名列表[属性名]["值列表"][属性值]){
                                属性名列表[属性名]["值列表"][属性值]={}
                                //console.log("3",this.属性名列表)
                                属性名列表[属性名]["值列表"][属性值]["具有该属性值的块列表"]=[]
                                属性名列表[属性名]["值列表"][属性值]["字符串"]=块列表[i][属性名].slice(0)
                               
                            }
                            属性名列表[属性名]["值列表"][属性值]["具有该属性值的块列表"].push(块列表[i])
                          //  console.log(属性值,属性名列表[属性名]["值列表"][属性值])  
                        }  
                    } 
                }
               this.属性名列表 =JSON.parse(JSON.stringify(属性名列表))
              ///  console.log(333,this.属性名列表)
                this.重组完成=true
                }
            },
            分组属性(属性名){
                if(属性名){
                 ///   console.log("aaa",this.属性名列表[属性名])
                   this.块分组列表=[]
                   let 待分组块列表 =  JSON.parse(JSON.stringify(this.属性名列表[属性名]["值列表"]))
                    for(属性值 in 待分组块列表){
                        this.块分组列表.push({"属性名":属性名,"属性值":属性值,"块列表":待分组块列表[属性值]["具有该属性值的块列表"],'解析值':''})
                    }

                  //  console.log("bbb",this.块分组列表)
                }
            }
            
        },


        methods:{
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
            设定块列表:async function(块列表,属性名,属性值){
                for (i=0;i<块列表.length;i++){
                    let 块信息=块列表[i]
                    let id = 块信息["id"]
                    await 设置思源块属性(this.思源伺服ip,this.apitoken,id,属性名,属性值)
                    块信息[属性名]=属性值
                }
              //  console.log(this.块列表)
            }
        }
        
    }
</script>