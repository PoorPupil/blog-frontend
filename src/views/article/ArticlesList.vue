<script setup lang="ts">
import {ref, onMounted} from 'vue'

// 1. 定义响应式变量
const currentPage = ref(1) // 当前页码，默认为1
const pageSize = ref(5)    // 每页显示条数
const total = ref(0)       // 总条数（由后端返回）
const tableData = ref([])  // 当前页要显示的数据列表

const handleCurrentChange = (val: number) => {
  console.log(`当前页: ${val}`)
  currentPage.value = val // 更新当前页码
  loadData() // 重新请求数据
}

const loadData = async () => {

  console.log(`正在请求后端：获取第 ${currentPage.value} 页，每页 ${pageSize.value} 条`)
  // 在 Java 后端通常对应 PageInfo 或 Page 对象
  setTimeout(() => {
    total.value = 50 // 假设数据库总共有50条
    // 这里应该是后端返回的当前页数据，这里仅做模拟
    tableData.value = Array.from({ length: pageSize.value }, (_, i) => ({
      id: (currentPage.value - 1) * pageSize.value + i + 1,
      name: `数据项 ${(currentPage.value - 1) * pageSize.value + i + 1}`
    }))
  }, 500)
}



</script>


<template>


  <div class="example-pagination-block">
    <el-pagination
        background
        layout="prev, pager, next, total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"/>
  </div>
</template>

<style scoped>
.example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block {
  margin-bottom: 16px;
}
</style>
