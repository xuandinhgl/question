<template>
  <div class="flex justify-center items-start bg-slate-500 w-100 min-h-screen text-gray-300 p-4 lg:items-center">
    <div class="mx-auto w-full max-w-3xl pt-5 drop-shadow-sm	bg-slate-600 rounded-md p-4">
      <h2 class="text-center "><span class="text-cyan-600 font-bold text-2xl">{{current}}</span><span class="text-2xl">/</span><span class="text-green-600 font-bold text-2xl">{{ total }}</span></h2>
      <div class="mb-5">
        <question :question="fQuestion" :show-answer="showAnswer"/>
      </div>
      <div class="flex justify-between">
        <button @click.prevent="onShowAnswer"
                class="py-2 px-4 mr-4 bg-green-700 rounded-md text-white hover:bg-green-600">
          <img src="/icons/spell-check-solid.svg" alt="" width="20" height="20" class="text-white">
        </button>
        <button @click.prevent="onPlayQuestion" class="py-2 px-4 mr-4 bg-green-700 rounded-md text-white hover:bg-green-600">
          <img src="/icons/volume-up-solid.svg" alt="" width="20" height="20" class="text-white">
        </button>
        <button @click.prevent="onShowNextQuestion"
                class="py-2 px-4 mr-4 bg-emerald-700 rounded-md text-white hover:bg-emerald-600">
          <img src="/icons/step-forward-solid.svg" alt="" width="20" height="20" class="text-white">
        </button>
      </div>
      <audio v-if="videoUrl" @ended="endAudio" :src="videoUrl" ref="videoRef" controls style="width: 0; height: 1px" autoplay type="audio/mp3"></audio>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";

import {apiClient} from "./api";
import Question from './components/Question.vue'

import {QuestionI} from "./types";
import {getAllQuestions} from "./queries";
import {client} from "./sanity";

export default defineComponent({
  components: {
    Question
  },
  setup() {
    let questions = reactive([]);
    const fQuestion = ref({} as QuestionI);
    const total = ref(0)
    const current = ref(0)

    onMounted (async () => {
      questions = await client.fetch(getAllQuestions).then(res => res)
      const q = nextQuestion();
      total.value = questions.length
      if (q) {
        fQuestion.value = q;
      }
    });

    const videoUrl = ref('');
    const isQuestion = ref(true);

    const getVoice = async (input: string)  => {
      if (input) {
        const response = await apiClient.post('', input).then(res => res.data)
        return response.async
      }

      return null
    }

    const nextQuestion = (): QuestionI | null => {
      if (questions.length) {
        isQuestion.value = true
        const randomIndex = Math.floor(Math.random() * questions.length)
        const question: QuestionI = questions[randomIndex]
        if (question) {
          current.value = current.value+1
          questions.splice(randomIndex, 1)
        }

        return question
      }

      return null
    }


    const showAnswer = ref(false)

    const onShowAnswer = () => {
      showAnswer.value = true
      isQuestion.value = false
      play()
    }

    const onShowNextQuestion = () => {
      const q = nextQuestion()
      if (q) {
        fQuestion.value = q
      }
      showAnswer.value = false
      videoUrl.value = ''
      onPlayQuestion()
    }

    const onPlayQuestion = () => {
      isQuestion.value = true
      play()
    }

    const play = async () => {
      if (videoUrl.value && isQuestion.value) {
        const tmp = videoUrl.value
        videoUrl.value = ''
        setTimeout(() => {
          videoUrl.value = tmp
        }, 100)
        return ;
      }
      let txt = fQuestion?.value?.answer
      if (isQuestion.value) {
        txt = fQuestion?.value?.question
      }

      if (txt) {

        const url = await getVoice(txt)

        if (url) {
          setTimeout(() => {
            videoUrl.value = url
          }, 3000)
        }
      }
    }

    const endAudio = () => {
      if (!isQuestion.value) {
        videoUrl.value = ''
      }
    }

    return {
      fQuestion,
      showAnswer,
      onPlayQuestion,
      onShowAnswer,
      onShowNextQuestion,
      videoUrl,
      endAudio,
      current, total
    }

  }
})

</script>