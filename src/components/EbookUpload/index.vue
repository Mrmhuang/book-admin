<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"

      :file-list="fileList"
      :on-exceed="onExceed"

      :disabled="disabled"
      drag

      class="image-uploader"
      accept="application/epub+zip"

      show-file-list
    >


      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        请将电子书拖入或
        <em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">
        图书已上传
      </div>
    </el-upload>
  </div>
</template>

<script>
  import {getToken} from "../../utils/auth";
  export default {
      name: "index",
      data(){
        return {
          action: `${process.env.VUE_APP_BASE_API}/book/upload`
        }
      },
      props: {
        fileList: {
          type: Array,
          default() {
            return []
          }
        },
        disabled: {
          type: Boolean,
          default: false
        }
      },
      methods:{
        beforeUpload(){},  //可以在上传之前对电子书做一些操作
        onSuccess(response,file){
          console.log(response)
          // let information = {
          //   'title':response.result[0].title,
          //   'author':response.author,
          //   'publisher':response.publisher,
          //   'language':response.language,
          //   'rootFile':response.rootFile,
          //   'filePath':response.filePath,
          //   'unzipPath':response.unzipPath,
          //   'coverPath':response.coverPath,
          //   'fileName':response.fileName,
          //   'cover':response.cover
          // }
          this.$emit('onSuccess',response.data)
          this.$message({
            type:'success',
            message:'上传成功'
          })
        },
        onError(err){
          console.log(err)
          let msg = ''
          // let msg  = '失败原因:' + (err.errorMsg && JSON.parse(err.errorMsg)) || ''
          this.$message({
            type:'warning',
            message: '上传失败' + msg  || '上传失败'
        })
        },
        onRemove(){
          this.$emit('onRemove')
        },  //上传成功后关闭
        onExceed(){
          this.$message({
            type:'warning',
            message: '一次最多只能上传一本电子书'
          })
        }  //不懂
      },
      computed:{
        headers(){
          return  {
            Authorization: `Bearer ${getToken()}`
          }
        }
      }
    }
</script>

<style scoped>

</style>
