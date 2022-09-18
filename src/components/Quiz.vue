<template>
    <v-parallax >
        <div v-if="user.loggedIn">
            <v-card class="mx-auto my-12 pa-3" max-width="70%" elevation="8" style="background-color: #003865;" shaped>

                <template v-slot:title>
                    <h1 class="text-center" style="font-size: 40px; color: #FEB139; font-family: Feather;">QUIZ</h1>
                </template>

                <v-divider class="mx-4"></v-divider>

                <div class="d-flex justify-space-around">
                    <v-btn :disabled="!start" rounded="pill" @click="load(0)"
                        style="font-size: 20px; font-family:Feather; color: black; background-color: #FEB139; margin-bottom: 10px;" :loading="loadingbtn[0]">
                        Start Quiz
                    </v-btn>
                </div>

                <v-divider class="mt-4"></v-divider>

                <v-container justify="center">
                    <v-row dense>
                        <v-container>
                            <div v-show="!loading">

                                <v-row no-gutters justify="center" style="text-align:center; margin-bottom: 10px; margin-top: -30px;">
                                    <v-col>
                                        <v-sheet class="pa-2 ma-2" style="background-color: #003865;">
                                            <h2 style="font-family: Feather;">Score: <strong>{{ correctAnswers }}</strong></h2>
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="pa-2 ma-2" style="background-color: #003865;">
                                            <h3 style="font-family: Feather;">Question<br><strong>{{ index + 1 }}&nbsp;out of&nbsp;{{ questions.length
                                            }}</strong></h3>
                                        </v-sheet>
                                    </v-col>
                                    <v-col>
                                        <v-sheet class="pa-2 ma-2" style="background-color: #003865;">
                                            <h2 style="font-family: Feather;">Heart: <strong>{{ heart }}</strong></h2>
                                        </v-sheet>
                                    </v-col>
                                </v-row>

                            </div>
                        </v-container>

                        <h1 v-html="loading ? 'Click Start Button to Begin' : currentQuestion.question"
                            style="width:100%; text-align: center; font-size: 30px; color: #FEB139; font-family: Feather; margin-top: -20px;"></h1>
                        <!-- Only first question is displayed -->
                        <v-divider class="mx-4"></v-divider>

                        <form id="formBtn" class="d-flex flex-column pa-6 w-100" v-if="currentQuestion">
                            <v-row no-gutters justify="center" style="text-align:center;" >
                                <v-col v-for="answer in currentQuestion.answers">
                                    <v-sheet class="pa-2 ma-2" style="background-color: #003865;">
                                        <button :index="currentQuestion.key" :key="answer" v-html="answer"
                                            @click.prevent="handleClick" type="button"
                                            class="btn btn-secondary w-100 h-100" style="background-color: #FEB139;"></button>
                                    </v-sheet>
                                </v-col>
                            </v-row>

                        </form>

                    </v-row>
                </v-container>
            </v-card>
        </div>
        <div v-else>
            <v-card class="mx-auto mt-6 bg-info" max-width="25%" variant="outlined">
                <v-card-item color="white">
                    <div>
                        <div class="text-overline mb-1">
                            YOU ARE NOT LOGGED IN!
                        </div>
                        <div class="text-caption mb-3">Please login if you already have an account, otherwise create one
                            now.</div>
                    </div>
                </v-card-item>
            </v-card>
        </div>
    </v-parallax>

</template>
  
<script>
import axios from 'axios';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, toDisplayString } from "vue";
import { auth } from '../firebase'
import DataService from "../services/DataService";

//Assets
import sound from '../assets/sounds/music.mp3'
import ImageSrc from '../assets/images/blackbg.jpg'
const audio = new Audio(sound)
audio.volume = 0.4
audio.loop = true

export default {
    setup() {
        const Image = ImageSrc;
        const store = useStore()
        const router = useRouter()
        auth.onAuthStateChanged(user => {
            store.dispatch("fetchUser", user);
        });
        const user = computed(() => {
            return store.getters.user;
        });
        const signOut = async () => {
            await store.dispatch('logOut')
            router.push('/login')
        }
        return { user, signOut, Image }
    },
    data() {
        return {
            timeTake: "",
            History: {
                averageScore: "",
                timeTaken: "",
                timeFinished: "",
            },
            playingSound: false,
            heart: 5,
            start: true,
            category: 0,
            difficulty: 0,
            loadingbtn: [],
            questions: [],
            loading: true,
            index: 0,
            value: 50,
        };
    },
    computed: {
        currentQuestion() {
            if (this.questions !== []) {
                return this.questions[this.index];
            }
            return null;
        },
        correctAnswers() {
            if (this.questions && this.questions.length > 0) {
                let streakCounter = 0;
                this.questions.forEach(function (question) {
                    if (!question.rightAnswer) {
                        return;
                    } else if (question.rightAnswer === true) {
                        streakCounter++;
                    }
                });
                return streakCounter;
            } else {
                return "--";
            }
        },
        pluralizeAnswer() {
            // For grammatical correctness
            return this.correctAnswers === 1 ? "Answer" : "Answers";
        },
        quizCompleted() {
            if (this.questions.length === 0) {
                return false;
            }
            /* Check if all questions have been answered */
            let questionsAnswered = 0;
            this.questions.forEach(function (question) {
                question.rightAnswer !== null ? questionsAnswered++ : null;
            });
            return questionsAnswered === this.questions.length;
        },
        outOfHeart() {
            if (this.heart == 0) {
                return true;
            }
            /* Check if all questions have been answered */
            let questionsAnswered = 0;
            this.questions.forEach(function (question) {
                question.rightAnswer !== null ? questionsAnswered++ : null;
            });
            return questionsAnswered === this.questions.length;
        },
        score() {
            if (this.questions !== []) {
                return {
                    allQuestions: this.questions.length,
                    answeredQuestions: this.questions.reduce((count, currentQuestion) => {
                        if (currentQuestion.userAnswer) {
                            // userAnswer is set when user has answered a question, no matter if right or wrong
                            count++;
                        }
                        return count;
                    }, 0),
                    correctlyAnsweredQuestions: this.questions.reduce(
                        (count, currentQuestion) => {
                            if (currentQuestion.rightAnswer) {
                                // rightAnswer is true, if user answered correctly
                                count++;
                            }
                            return count;
                        },
                        0
                    ),
                };
            } else {
                return {
                    allQuestions: 0,
                    answeredQuestions: 0,
                    correctlyAnsweredQuestions: 0,
                };
            }
        },
    },
    watch: {
        quizCompleted(completed) {
            completed &&
                setTimeout(() => {
                    this.saveTutorial();
                    this.$emit("quiz-completed", this.score);
                }, 3000);
        },
        outOfHeart(completed) {
            completed && setTimeout(() => {
                this.saveTutorial();
                this.$emit("quiz-completed", this.score);
            }, 3000);
        },
    },
    methods: {
        saveTutorial() {
            const today = new Date();
            var data = {
                averageScore: Math.floor(
                    (this.score.correctlyAnsweredQuestions / this.score.allQuestions) *
                    100
                ) + "%",
                timeTaken: this.timeTake,
                timeFinished: today.toGMTString(),
            };
            DataService.create(data)
                .then(() => {
                    console.log("Created new item successfully!");
                    this.submitted = true;
                })
                .catch(e => {
                    console.log(e);
                });
        },

        newTutorial() {
            this.submitted = false;
            this.History = {
                averageScore: 0,
                timeTaken: "",
                timeFinished: "",
            };
        },

        playSound() {
            if (this.playingSound) {
                audio.pause();
                audio.currentTime = 0
            } else {
                audio.currentTime = 9
                audio.play();
            }
        },
        load(i) {
            const taken = new Date()
            this.loadingbtn[i] = true
            if (i == 1) {
                setTimeout(() => (this.loadingbtn[i] = false, this.playingSound = !this.playingSound), 1000)
            } else {
                setTimeout(() => (this.loadingbtn[i] = false, this.timeTake = taken.toGMTString(), this.fetchQuestions(this.category, this.difficulty), this.start = false), 3000)
            }
        },
        async fetchQuestions(category, difficulty) {
            this.loading = true;

            //fetching questions from api
            let index = 0; //To identify single answer
            if (category == 0) { // Science: Computers
                if (difficulty == 0) { // Easy

                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;

                } else if (difficulty == 1) { // Medium
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                } else if (difficulty == 2) { // Hard
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                }
            } else if (category == 1) { // Entertainment: Board Games
                if (difficulty == 0) { // Easy
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=16&difficulty=easy&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                } else if (difficulty == 1) { // Medium
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=16&difficulty=medium&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                } else if (difficulty == 2) { // Hard
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=16&difficulty=hard&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                }
            } else if (category == 2) { // Entertainment: Video Games
                if (difficulty == 0) { // Easy
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                } else if (difficulty == 1) { // Medium
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                } else if (difficulty == 2) { // Hard
                    let { data } = await axios.get('https://opentdb.com/api.php?amount=10&category=15&difficulty=hard&type=multiple')
                    let questions = data.results.map((question) => {
                        question.answers = [
                            question.correct_answer,
                            ...question.incorrect_answers,
                        ];
                        //shuffle above array
                        for (let i = question.answers.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [question.answers[i], question.answers[j]] = [
                                question.answers[j],
                                question.answers[i],
                            ];
                        }
                        //add right answers and key
                        question.rightAnswer = null;
                        question.key = index;
                        index++;
                        return question;


                    });

                    this.questions = questions;
                    this.loading = false;
                }
            }
        },
        handleClick(e) {
            let index = e.target.getAttribute("index");
            let pollutedUserAnswer = e.target.innerHTML; // innerHTML is polluted with decoded HTML entities e.g ' from &#039;
            /* Clear from pollution with ' */
            let userAnswer = pollutedUserAnswer.replace(/'/, "&#039;");
            //set answer
            this.questions[index].userAnswer = userAnswer;
            /* Set class "clicked" on button with userAnswer -> for CSS Styles; Disable other sibling buttons */
            e.target.classList.add("clicked");
            let allButtons = document.querySelectorAll(`[index="${index}"]`);
            for (let i = 0; i < allButtons.length; i++) {
                if (allButtons[i] === e.target) continue;
                allButtons[i].setAttribute("disabled", "");
            }
            this.checkCorrectAnswer(e, index);
        },
        checkCorrectAnswer(e, index) {
            let question = this.questions[index];
            if (question.userAnswer) {
                if (this.index < this.questions.length - 1) {
                    setTimeout(
                        function () {
                            this.index += 1;
                        }.bind(this),
                        3000
                    );
                }
                if (question.userAnswer === question.correct_answer) {
                    /* Set class on Button if user answered right, to celebrate right answer with animation joyfulButton */
                    e.target.classList.add("rightAnswer");
                    /* Set rightAnswer on question to true, computed property can track a streak out of 20 questions */
                    this.questions[index].rightAnswer = true;
                } else {
                    /* Mark users answer as wrong answer */
                    this.heart--
                    e.target.classList.add("wrongAnswer");
                    this.questions[index].rightAnswer = false;
                    /* Show right Answer */
                    let correctAnswer = this.questions[index].correct_answer;
                    let allButtons = document.querySelectorAll(`[index="${index}"]`);
                    allButtons.forEach(function (button) {
                        if (button.innerHTML === correctAnswer) {
                            button.classList.add("showRightAnswer");
                        }
                    });
                }
            }
        },
    },
};
</script>
  
<style scoped>
#formBtn button {
    font-size: 1.1rem;
    box-sizing: border-box;
    padding: 1rem;
    margin: 0.5rem;
    gap: 1rem;
    background-color: rgba(100, 100, 100, 0.3);
    border: none;
    border-radius: 0.4rem;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.2);
}

#formBtn button:hover:enabled {
    align-self: center;
    transform: scale(1.2);
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
        0 3px 1px -1px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

#formBtn button:focus {
    outline: none;
}

#formBtn button:active:enabled {
    transform: scale(1.05);
}

@keyframes flashButton {
    0% {
        opacity: 1;
        z-index: 5;
        transform: scale(1.3);
    }

    50% {
        opacity: 0.7;
        z-index: 5;
        transform: scale(1.5);
    }

    100% {
        opacity: 1;
        z-index: 5;
        transform: scale(1.3);
    }
}

#formBtn button.clicked {
    pointer-events: none;
}

#formBtn button.rightAnswer {
    animation: flashButton;
    animation-duration: 700ms;
    animation-delay: 200ms;
    animation-iteration-count: 3;
    animation-timing-function: ease-in-out;
    color: black;
    background: linear-gradient(210deg,
            rgba(0, 178, 72, 0.25),
            rgba(0, 178, 72, 0.5));
}

#formBtn button.wrongAnswer {
    color: black;
    background: linear-gradient(210deg,
            rgba(245, 0, 87, 0.25),
            rgba(245, 0, 87, 0.5));
}

#formBtn button.showRightAnswer {
    animation: flashButton;
    animation-duration: 700ms;
    animation-delay: 200ms;
    animation-iteration-count: 2;
    animation-timing-function: ease-in-out;
    color: black;
    background: linear-gradient(210deg,
            rgba(0, 178, 72, 0.25),
            rgba(0, 178, 72, 0.5));
}

.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}

@-moz-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@-o-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>