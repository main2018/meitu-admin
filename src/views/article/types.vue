<template>
  <div class="article-types">
    <el-dialog :visible.sync="dialogVisible">
      <editorImage v-if="dialogVisible" @change="setCover"></editorImage>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cover = ''; dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!cover" @click="saveCover">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="typeShow">
      <el-form ref="typeForm" :model="type" label-width="80px" label-position="right" :rules="typeRules" status-icon>
        <el-form-item label="类型英文" prop="category">
          <el-input v-model="type.category"></el-input>
        </el-form-item>
        <el-form-item label="类型中文" prop="name">
          <el-input v-model="type.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="typeShow = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </span>
    </el-dialog>

    <el-table ref="dragTable" v-loading="listLoading" :data="types" row-key="index" border fit highlight-current-row style="width: 100%" cell-class-name="el-table-rect">

      <el-table-column width="200px" align="center" label="封面" prop="icon">
        <template slot-scope="scope">
          <div class="cover">
            <div
              class="background background-ratio"
              :style="{backgroundImage: `url(${qiniuDomain + scope.row.icon})`}"
              @click="currentIndex = scope.$index; dialogVisible = true"
            >
            </div>
          </div>
          <!-- <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="类型名称" prop="value">
        <template slot-scope="scope">
          <!-- <template v-if="editing && currentIndex === scope.$index">
            <el-input v-model="scope.row.name" class="edit-input" size="small" />
          </template> -->
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="子类型">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.subcategories" :key="item.index" closable @close="delTypesChild(scope.$index, index)">
            {{ item }}
          </el-tag>
          <el-input
            v-if="newTypeChildShow && currentIndex === scope.$index"
            :ref="`newTypeChildInput${scope.$index}`"
            v-model="newTypeChildValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.$index)"
            @blur="handleInputConfirm(scope.$index)"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.$index)">+ 新类型</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="类型模块" prop="value">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.hasImage" label="图片"></el-checkbox>
          <el-checkbox v-model="scope.row.hasVideo" label="视频"></el-checkbox>
          <el-checkbox v-model="scope.row.hasLink" label="链接"></el-checkbox>
          <el-checkbox v-model="scope.row.hasArticle" label="文章"></el-checkbox>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="排序" width="80" prop="order">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button v-if="editing && currentIndex === scope.$index" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit">
            确定
          </el-button> -->
          <!-- <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="editing = true; currentIndex = scope.$index"> -->
          <el-button type="primary" size="mini" @click="toEditType(scope.$index)">
            编辑
          </el-button>
          <el-button type="warning" size="mini" @click="changeOrder(scope.$index)">
            排序
          </el-button>
          <el-button type="danger" size="mini" @click="delType(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="拖拽" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column> -->
    </el-table>
    <div class="footer">
      <el-button type="success" @click="typeShow = true">添加类型</el-button>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import editorImage from '@/components/EditorImage'
import errGif from '@/assets/401_images/401.gif'
import Sortable from 'sortablejs'
import { getTypes, addType, delType, updateType, delSubcategory, addSubcategory } from '@/api/types'
import { qiniuDomain } from 'config/qiniu'
import { sortCompare } from '@/utils'

export default {
  components: {
    editorImage
  },
  data() {
    return {
      qiniuDomain,
      listLoading: true,
      newTypeChildShow: false,
      editing: false,
      dialogVisible: false,
      currentIndex: 0,
      newTypeChildValue: '',
      cover: '',
      typeRules: {
        category: [
          { required: true, message: '类型英文不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '类型中文不能为空', trigger: 'blur' }
        ]
      },
      typeShow: false,
      type: {
        category: '',
        name: ''
      },
      types: [
        {
          index: 1,
          value: '类型0',
          cover: errGif,
          childrens: [
            { index: 11, value: '子类型0' },
            { index: 12, value: '子类型1' }
          ]
        },
        {
          index: 2,
          value: '类型1',
          cover: errGif,
          childrens: [
            { index: 21, value: '子类型0' },
            { index: 22, value: '子类型1' }
          ]
        }
      ]
    }
  },
  created() {
    this.getTypes()
  },
  mounted() {
    this.$nextTick(() => {
      this.setSort()
    })
  },
  methods: {
    changeOrder(index) {
      const order = this.types[index].order

      this.$prompt('请输入排序数值（正整数）', '数值越大越靠后', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputValue: order,
        inputPattern: /^[+]{0,1}(\d+)$/,
        inputErrorMessage: '输入内容不正确，请输入正整数'
      }).then(({ value }) => {
        value = Number(value)
        const orders = this.types.map(type => type.order)

        if (orders.includes(value)) {
          return this.$message.error(`序号${value}已被占用，请重新输入`)
        }
        updateType(Object.assign({}, this.types[index], { order: value })).then(() => {
          this.$message.success('排序序号已修改')
          this.getTypes()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    getTypes() {
      getTypes().then(res => {
        const _list = res && res.data || []
        this.types = _list.sort(sortCompare('order'))
        console.log('types:', this.types)
      }).finally(() => { this.listLoading = false })
    },
    addType() {
      this.$refs.typeForm.validate((valid, result) => {
        if (valid) {
          const api = this.editing ? updateType : addType
          const hint = this.editing ? '修改' : '添加'
          const data = this.editing ? Object.assign({}, this.types[this.currentIndex], this.type) : this.type
          api(data).then(resp => {
            this.$message.success(`类型${hint}成功`)
            this.getTypes()
            this.typeShow = false
          })
        } else {
          const message = ((Object.values(result)[0] || [])[0] || {}).message || '您有未填写的字段'
          this.$message.error(message)
          return false
        }
      })
    },
    toEditType(index) {
      const { category, name } = this.types[index]
      this.type = {
        category,
        name
      }
      this.editing = true
      this.typeShow = true
      this.currentIndex = index
    },
    setCover(data) {
      if (data && data.length) {
        // const img = qiniuDomain + (data[0].response ? data[0].response.data.key : data[0].name)
        const img = (data[0].response ? data[0].response.key : data[0].name)
        this.cover = img
      }
    },
    saveCover() {
      this.$set(this.types[this.currentIndex], 'icon', this.cover)

      updateType(this.types[this.currentIndex]).then(() => {
        this.$message.success('类型封面修改成功')
        this.dialogVisible = false
        this.cover = ''
      })
    },
    confirmEdit(row) {
      const currentType = this.types[this.currentIndex]
      const { id, name } = currentType
      updateType({ id, name }).then(resp => {
        this.editing = false
        this.$message({
          message: 'The title has been edited',
          type: 'success'
        })
      })
    },
    showInput(index) {
      this.currentIndex = index
      this.newTypeChildShow = true
      this.$nextTick(_ => {
        this.$refs[`newTypeChildInput${index}`].$refs.input.focus()
      })
    },
    handleInputConfirm(index) {
      const value = this.newTypeChildValue
      const subcategories = this.types[index].subcategories
      if (!subcategories) this.types[index].subcategories = []

      // const maxIndex = Math.max(...this.types[index].subcategories.map(children => children.index))
      if (value) {
        const data = {
          category: this.types[index].category,
          subcategory: value
        }
        addSubcategory(data).then(() => {
          this.$message.success('子类型添加成功')
          this.types[index].subcategories.push(value)
        })
      }
      this.newTypeChildShow = false
      this.newTypeChildValue = ''
    },
    delType(index) {
      const _id = this.types[index]._id
      this.$confirm('确认删除？')
        .then(_ => {
          delType(_id).then(() => {
            this.types.splice(index, 1)
            this.$message.success('类型删除成功')
          })
        })
        .catch(_ => {})
    },
    delTypesChild(rowIndex, index) {
      const type = this.types[rowIndex]
      delSubcategory({ category: type.category, subcategory: this.types[rowIndex].subcategories[index] }).then(() => {
        this.$message.success('子类型删除成功')
        this.types[rowIndex].subcategories.splice(index, 1)
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.types.splice(evt.oldIndex, 1)[0]
          this.types.splice(evt.newIndex, 0, targetRow)
        }
      })
    }
  }
}
</script>

<style lang='sass'>
.article-types
  .cover
    margin-left: 10px
    display: inline-block
    width: 150px
    vertical-align: middle
  .el-tag + .el-tag
    margin-left: 10px
  .button-new-tag
    margin-left: 10px
    height: 32px
    line-height: 30px
    padding-top: 0
    padding-bottom: 0
  .input-new-tag
    width: 90px
    margin-left: 10px
    vertical-align: bottom
.sortable-ghost
  opacity: .8
  color: #fff!important
  background: #42b983!important

.footer
  padding: 20px 0
  text-align: right
</style>
