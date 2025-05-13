<template>
  <div class="quiz-container">
    <h2 class="quiz-title">趣味问答</h2>
    <div v-for="(question, index) in questions" :key="index" class="quiz-question">
      <h3>{{ index + 1 }}. {{ question.title }}</h3>
      <div class="quiz-options">
        <label
          v-for="(option, optIndex) in question.options"
          :key="optIndex"
          class="quiz-option"
          :class="{
            'selected': selectedAnswers[index] === optIndex,
            'correct-answer': showAnswer && optIndex === question.correctAnswer,
            'wrong-answer': showAnswer && selectedAnswers[index] === optIndex && optIndex !== question.correctAnswer
          }"
        >
          <input
            type="radio"
            :name="'question-' + index"
            :value="optIndex"
            v-model="selectedAnswers[index]"
            :disabled="showAnswer"
          >
          <span class="option-text">{{ option }}</span>
        </label>
      </div>
      <div v-if="showAnswer" class="quiz-feedback">
        <div v-if="selectedAnswers[index] === question.correctAnswer" class="correct-feedback">
          <span class="feedback-icon">✓</span> 回答正确！
        </div>
        <div v-else class="incorrect-feedback">
          <span class="feedback-icon">✗</span> 回答错误，正确答案是：{{ question.options[question.correctAnswer] }}
        </div>
      </div>
    </div>
    <div class="quiz-controls">
      <button @click="checkAnswers" class="check-button">检查答案</button>
      <button @click="resetQuiz" class="reset-button">重新开始</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  props: {
    questions: {
      type: Array,
      required: true,
      // 每个问题对象的结构：
      // {
      //   title: String,
      //   options: Array,
      //   correctAnswer: Number
      // }
    }
  },
  data() {
    return {
      selectedAnswers: Array(this.questions.length).fill(null),
      showAnswer: false
    }
  },
  methods: {
    checkAnswers() {
      this.showAnswer = true
    },
    resetQuiz() {
      this.selectedAnswers = Array(this.questions.length).fill(null)
      this.showAnswer = false
    }
  }
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fbfaf8;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.quiz-title {
  text-align: center;
  color: #634d0d;
  margin-bottom: 30px;
  font-family: 'STSong', 'SimSun', serif;
}

.quiz-question {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.quiz-question h3 {
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin-bottom: 15px;
}

.quiz-options {
  margin-top: 10px;
}

.quiz-option {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 6px 0;
  border: 1px solid #d6c9a5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fbfaf8;
}

.quiz-option:hover {
  background: #e6e1d3;
}

.quiz-option.selected {
  border-color: #4b3e2e;
  background: #e6e1d3;
}

.quiz-option.correct-answer {
  background: #e8f5e9;
  border-color: #4caf50;
  color: #2e7d32;
  position: relative;
}

.quiz-option.correct-answer::after {
  content: "✓";
  position: absolute;
  right: 12px;
  color: #2e7d32;
  font-weight: bold;
}

.quiz-option.wrong-answer {
  background: #ffebee;
  border-color: #f44336;
  color: #c62828;
  position: relative;
}

.quiz-option.wrong-answer::after {
  content: "✗";
  position: absolute;
  right: 12px;
  color: #c62828;
  font-weight: bold;
}

.quiz-option input[type="radio"] {
  margin-right: 10px;
  cursor: pointer;
}

.option-text {
  font-family: 'STKaiti', 'KaiTi', serif;
  color: #2c1810;
}

.quiz-feedback {
  margin-top: 12px;
  padding: 8px;
  border-radius: 4px;
}

.correct-feedback {
  color: #2e7d32;
  background: #e8f5e9;
  padding: 8px;
  border-radius: 4px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.incorrect-feedback {
  color: #c62828;
  background: #ffebee;
  padding: 8px;
  border-radius: 4px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.feedback-icon {
  margin-right: 8px;
  font-weight: bold;
}

.quiz-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.check-button, .reset-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.check-button {
  background: #4b3e2e;
  color: #fbfaf8;
}

.reset-button {
  background: #e6e1d3;
  color: #4b3e2e;
}

.check-button:hover {
  background: #2c1810;
}

.reset-button:hover {
  background: #d6c9a5;
}
</style> 