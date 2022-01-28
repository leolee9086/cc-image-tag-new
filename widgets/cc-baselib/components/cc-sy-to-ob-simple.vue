<template>
    <el-button 
    size="mini"
    @click="copytoob(syhtml)"
    icon="el-icon-document-copy" 
    round
    >
    导出到obsidian(预览模式下点击按钮后复制)
    </el-button>            
</template>
<script>
module.exports = {
    props:['syhtml'],
    model:{
        props:"markdown",
        event:"change"
    },
    data() {
        return {
            finalhtml:this.syhtml,
            blockinfor:{},
            docHtml:{},
            docHtmlleng:0
        }
    },
    methods: {
        copytoob:  function(syhtml){
            let that = this
            console.log(that.syhtml)
            let 当前文档背景图 = that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .protyle-background")
            let 当前文档id = 当前文档背景图.getAttribute("data-node-id")
           // await this.获取文档完整内容(当前文档id)
            let 当前预览html= that.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) .b3-typography")
            //let 当前文档html= this.syhtml.querySelector(".fn__flex-1.protyle[data-id]:not(.fn__flex-1.protyle.fn__none) [data-doc-type='NodeDocument']")
           // 当前预览html.innerHTML = this.docHtml
            console.log(当前预览html)
            that.转化html(当前预览html)
            },
        

        转化html:async function(原始html){
            /**let icons =  原始html.querySelectorAll(".protyle-attr,.protyle-action")
            icons.forEach(el=>el.remove())
            let blockcontents =  原始html.querySelectorAll("[spellcheck='false']")
            blockcontents.forEach(el=>el.outerHTML=el.innerHTML)
            while (原始html.querySelectorAll("div.list[data-subtype='u'] div.li").length!=0){checkuli(),console.log(原始html.querySelectorAll("div.list[data-subtype='u'] .li").length)}
            function checkuli(){
            el = 原始html.querySelector("div.list[data-subtype='u'] div.li")
            let replaceel = document.createElement("div")
            replaceel.innerHTML = "<li></li>"
            replaceel.firstChild.
            el.outerHTML= el.outerHTML.replace(/^<div/,'<li')
            }
            while (原始html.querySelectorAll("div.list[data-subtype='u']").length!=0){checkul(),console.log(原始html.querySelectorAll("div.list[data-subtype='u']").length)}
            function checkul(){
            el = 原始html.querySelector("div.list[data-subtype='u']")
            el.outerHTML= el.outerHTML.replace(/^<div/,'<ul')
            }**/
            
            
            
            
            let that = this
            let strongs = 原始html.querySelectorAll("strong")
            if(strongs.length>0)
            {
                strongs.forEach(el=>
                {   
                  
                    let outerHTML = el.outerHTML.replace(/strong/,"<span>strong</span>")
                    el.outerHTML = outerHTML+"<span><</span>/strong>"
                })
            }
            let links =  原始html.querySelectorAll('a')
            if(links.length>0)
            
                {   aaa(links)
                    async function aaa(links) 
                   { links.forEach(element => {
                   let elhref = element.getAttribute("href")
                    
                   let realhref = ""
                   if (elhref.slice(0,9)=="siyuan://"){
                    bbb()
                    async function bbb(){   
                    let id = elhref.replace(/siyuan\:\/\/blocks\//g,"")
                    await that.查找链接类型(id)
                    console.log('aaa',that.blockinfor)
                    let linkinfor =that.blockinfor
                    let hpath = linkinfor['hpath']
                    let index = hpath.lastIndexOf("\/");  

                    let docname  = hpath.substring(index + 1, hpath.length);

                    if (linkinfor["type"]=='d'){obhref =  linkinfor["content"]} 
                    else if(linkinfor["type"]=='h')  {obhref = docname+"#"+linkinfor["content"]}
                    else {obhref = docname+"#^"+id}                   
                    if (obhref!=""&& obhref){
                       console.log(obhref)
                 //  element.setAttribute("data-href",obhref)
                 ///  element.setAttribute("class","internal-link")
                  // element.setAttribute("target","_blank")
                  //  element.setAttribute("rel","noopener")
                  //  element.setAttribute('href',obhref)
               //   obhref = obhref.replace(/ /g,'%20')
         
               ////   obhref = obhref.replace(/\?/g,'%3F')
                ///  obhref = obhref.replace(/\%/g,'%25')
                //  obhref = obhref.replace(/\&/g,'%26')
                    element.outerHTML=`[[${obhref}|${element.innerHTML}]]`+`%%[${linkinfor["content"]}](${elhref})%%`


                   i=i+1
                   }}}
                });}
           
            }
     
              //     原始html.innerHTML=原始html.innerHTML+footnotes

        },
        查找链接类型:async  function(id){
              let that = this
              console.log("linkid",id)
              let sql语句 = "select * from blocks where id ='"+id+"'"
               let jsondatas =  {"stmt": sql语句} 
             function aa(){
             return axios({
                        method:'POST',
                        url:'http://'+vm.hosturl + '/api/query/sql',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result =>{
                         blockinfor1 =  result.data["data"][0]
                        if (blockinfor1){
                        return blockinfor1}
                        })}
              await  axios.all([aa()])
                .then(axios.spread((blockinfor)=>{
                    that.blockinfor = blockinfor
                    console.log('bbb',that.blockinfor)
                     return that.blockinfor

                }))

             },
        获取文档完整内容:async function(id){
            let that = this
            jsondatas = {"id":id,"k":"",mode:0,size:36}
            that.docHtmlleng = 0
            await axios({
                 method:'POST',
                        url:'http://'+vm.hosturl + '/api/filetree/getDoc',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result=>{
                            that.docHtmlleng = result.data["data"]['blockCount']
                        })

            jsondatas["size"]=that.docHtmlleng*6
            await axios({
                 method:'POST',
                        url:'http://'+vm.hosturl + '/api/filetree/getDoc',
                        headers:{'Authorization': 'Token '+ that.apitoken },
                        data:(jsondatas)
                        }).then(result=>{
                            that.docHtml = result.data["data"]['content']
                        })

            }
    
    },
    
}

</script>
 
<style>


</style>