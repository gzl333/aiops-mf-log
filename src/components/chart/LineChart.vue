<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, toRefs } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])

const props = defineProps({
  option: {
    type: Object,
    required: true
  }
})
// eslint-disable-next-line
let chart: any = null
const chartStartLoading = () => {
  chart.showLoading({
    text: '数据正在加载...',
    textStyle: { fontSize: 30, color: '#444' },
    effectOption: { backgroundColor: 'rgba(0, 0, 0, 0)' }
  })
}
const chartStopLoading = () => {
  chart.hideLoading()
}
defineExpose({ chartStartLoading, chartStopLoading })
const container = ref<HTMLElement>()
onMounted(() => {
  chart = echarts.init(container.value!)
  chart.setOption(props.option)
  const { option } = toRefs(props)
  watch(option, () => {
    console.log(props)
    chart.setOption(props.option)
  }, { deep: true })
  const chartResize = () => {
    chart.resize()
  }
  window.addEventListener('resize', chartResize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', chartResize)
  })
})
</script>

<template>
  <div class="LineChart" style="width: 100%">
    <div ref="container" :style="{ width: '100%', height: '220px' }"></div>
  </div>
</template>

<style lang="scss" scoped>
.LineChart {
}
</style>
