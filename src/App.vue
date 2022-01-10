<template>
  <div class="flex justify-center items-start bg-slate-200 w-100 min-h-screen text-gray-300 p-4 lg:items-center">
    <div class="mx-auto w-full max-w-3xl pt-5 drop-shadow-sm	bg-slate-600 rounded-md p-4">
      <div class="mb-5">
        <question :question="fQuestion" :show-answer="showAnswer"/>
      </div>
      <div class="flex justify-between">
        <button @click.prevent="onShowAnswer"
                class="py-2 px-4 mr-4 bg-green-700 rounded-md text-white hover:bg-green-600">Xem câu trả lởi
        </button>
        <button @click.prevent="play" class="py-2 px-4 mr-4 bg-green-700 rounded-md text-white hover:bg-green-600">Nghe câu hỏi</button>
        <button @click.prevent="onShowNextQuestion"
                class="py-2 px-4 mr-4 bg-emerald-700 rounded-md text-white hover:bg-emerald-600">Câu tiếp theo
        </button>
      </div>
      <audio v-if="videoUrl" :src="videoUrl" ref="videoRef" controls style="width: 0; height: 1px" autoplay type="audio/mp3"></audio>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {apiClient} from "./api";

import Question from './components/Question.vue'
import {questions} from "./constant";
import {QuestionI} from "./types";

export default defineComponent({
  components: {
    Question
  },
  setup() {
    const videoUrl = ref('');

    const getVoice = async (input: string)  => {
      if (input) {
        const response = await apiClient.post('', input).then(res => res.data)
        return response.async
      }

      return null
    }

    const nextQuestion = (): QuestionI | null => {
      if (questions.length) {

        const randomIndex = Math.floor(Math.random() * questions.length)
        const question: QuestionI = questions[randomIndex]
        if (question) {
          questions.splice(randomIndex, 1)
        }

        return question
      }

      return null
    }

    const fQuestion = ref(nextQuestion())
    const showAnswer = ref(false)

    const onShowAnswer = () => {
      showAnswer.value = true
      play(null, false)
    }

    const onShowNextQuestion = () => {
      fQuestion.value = nextQuestion()
      showAnswer.value = false
    }

    const play = async (payload: MouseEvent| null, isQuestion = true) => {
      let txt = fQuestion?.value?.answer
      if (isQuestion) {
        txt = fQuestion?.value?.question
      }

      if (txt) {

        const url = await getVoice(txt)

        if (url) {
          setTimeout(() => {
            videoUrl.value = url
          }, 1200)
        }
      }
    }

    return {
      fQuestion,
      showAnswer,
      play,
      onShowAnswer,
      onShowNextQuestion,
      videoUrl
    }

  }
})

</script>



