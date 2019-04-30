<template>
  <div class="app-container">
    <div class="article-list-header">
      <el-select v-model="currentType" placeholder="请选择" @change="typeChange">
        <el-option
          v-for="item in selectTypeData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @click.native="typeClick(item)"
        >
        </el-option>
      </el-select>
      <div class="article-list-header-eys" :style="{color: isEyeActive ? 'red' : ''}">
        <el-tooltip effect="dark" :content="`展示${eyeOpen ? '隐藏' : '显示'}的文章`" placement="top">
          <svg-icon :icon-class="eyeOpen ? 'eye-open' : 'eye'" @click="isDelActive = false; isEyeActive = true; eyeOpen = !eyeOpen" />
        </el-tooltip>
      </div>
      <div class="article-list-header-del" :style="{color: isDelActive ? 'red' : ''}">
        <el-tooltip effect="dark" :content="`展示${isDelActive ? '全部' : '删除'}的文章`" placement="top">
          <i class="el-icon-delete" @click="isEyeActive = false; isDelActive = !isDelActive;" />
        </el-tooltip>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="tabelData" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        width="50"
      >
      </el-table-column>
      <!-- <el-table-column align="center" label="ID" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" :label="$t('article.status')" width="100">
        <template slot-scope="{row}">
          {{ row.status | statusFilter }}
        </template>
      </el-table-column>

      <el-table-column :label="$t('article.title')">
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('article.actions')" width="200">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button type="danger" size="small" :disabled="scope.row.status === -1" :loading="currentId === scope.row.id" icon="el-icon-delete" @click="del(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page-size="100" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchList, delArticle } from '@/api/article'
// import Pagination from '@/components/Pagination'
import { getTypes } from '@/api/types'
import { sortCompare } from '@/utils'

export default {
  name: 'ArticleList',
  // components: { Pagination },
  filters: {
    statusFilter(status) {
      if (status === -1) return '删除'

      return ['显示', '隐藏'][status]
    }
  },
  data() {
    return {
      eyeOpen: false,
      isEyeActive: false,
      isDelActive: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 100
      },
      types: [],
      currentType: '',
      currentId: ''
    }
  },
  computed: {
    selectTypeData() {
      const list = this.types.map(type => {
        return {
          value: type.category,
          label: type.name
        }
      })
      return [{ value: '', label: '全部' }, ...list]
    },
    tabelData() {
      let res = this.currentType ? this.list.filter(item => item.category === this.currentType) : this.list

      if (this.isEyeActive) {
        const status = this.eyeOpen ? 0 : 1
        res = res.filter(item => item.status === status)
      }
      if (this.isDelActive) {
        const status = -1
        res = res.filter(item => item.status === status)
      }
      return res
    }
  },
  created() {
    this.getTypes()
    this.getList()
  },
  methods: {
    del(id) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.currentId = id
          delArticle(id)
            .then(() => {
              this.$message.success('删除成功')
              this.getList()
            })
            .finally(() => { this.currentId = '' })
        })
        .catch(_ => {})
    },
    typeChange(val) {
    },
    typeClick(item) {
      const isAll = item && !item.value

      if (isAll) {
        this.isEyeActive = false
        this.isDelActive = false
      }
    },
    getTypes() {
      getTypes().then(res => {
        const _list = res && res.data || []
        this.types = _list.sort(sortCompare('order'))
      }).finally(() => { this.listLoading = false })
    },
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        // console.log('response', response)
        this.list = response.data || []
        this.total = this.list.length
      }).finally(() => { this.listLoading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.article-list-header{
  padding: 20px 0;
  display: flex;
  align-items: center;
  &-eys, &-del{
    margin-left: 10px;
    padding: 0 10px;
    cursor: pointer;
    &:hover{
      color: blue;
    }
  }
}
</style>
