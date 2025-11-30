<template>
  <div style="padding: 20px;">
    <el-card header="分类管理">
      
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="createTime" label="创建时间" />
        
        <el-table-column label="操作">
          <template #default>
            <el-button type="primary" size="small">修改</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryList, type CategoryVO } from '../../api/category'

// 1. 定义数据 (响应式变量，相当于 Java 里的成员变量)
// ref([]) 相当于 List<CategoryVO> tableData = new ArrayList<>();
const tableData = ref<CategoryVO[]>([])

// 2. 定义加载方法
const loadData = async () => {
  try {
    // await 相当于同步等待后端返回，不需要写回调地狱
    const data = await getCategoryList()
    tableData.value = data // 将后端数据赋值给响应式变量，页面自动刷新
  } catch (e) {
    console.error(e)
  }
}

// 3. 页面初始化 (相当于 @PostConstruct)
onMounted(() => {
  loadData()
})
</script>