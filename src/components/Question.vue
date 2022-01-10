<template>
  <h2 class="text-3xl font-bold mb-2">Câu hỏi</h2>
  <p class="text-xl mb-3" v-if="question">{{ question.question }}</p>
  <div v-if="showAnswer && question" class="border border-slate-400 bg-gray-500 rounded-md p-4">
    <h2 class="text-3xl font-bold">Câu trả lời</h2>
    <p class="text-2xl text-green-500">{{ question.answer }}</p>
  </div>

</template>

<script lang="ts">
import {QuestionI} from "../types";
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<QuestionI | null>,
      required: true
    },
    showAnswer: {
      type: Boolean,
      default: false
    }
  },
})
</script>