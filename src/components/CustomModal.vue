<template>
    <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <h1 style="font-size: 40px; color: #FEB139; font-family: Feather; margin-left: 28%;">{{ header }}</h1>
            </div>
  
            <div class="modal-body">
              <div id="score">
                You answered
                <span class="highlight">
                  {{
                    Math.floor(
                      (score.correctlyAnsweredQuestions / score.allQuestions) *
                        100
                    )
                  }}
                  % correctly!
                </span>
              </div>
            </div>
  
            <div class="modal-footer">
              <button
                id="play-again"
                class="button-footer"
                @click="$emit('reload')"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    props: {
      header: String,
      subheader: String,
      score: Object,
    },
  };
  </script>
  
  <style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-container {
    width: 90vw;
    max-width: 650px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #003865;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgb(37,169,239);
    transition: all 0.3s ease;
  }
  .modal-header {
    text-align: center;
  }
  .modal-body {
    display: flex;
    text-align: center;
    flex-direction: column;
    margin: 20px 0;
    line-height: 3rem;
  }
  .modal-body > * {
    margin: 1rem 0;
    padding: 0.25rem 0.5rem;
  }
  .modal-footer {
    display: flex;
    justify-content: center;
  }
  /*
   Modal Transition
   */
  .modal-enter {
    opacity: 0;
  }
  .modal-leave-active {
    opacity: 0;
  }
  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  .button-footer {
    padding: 1rem 2rem;
    background: #FEB139;
    color: black;
    font-family: Feather;
    border-radius: 7px;
    border: none;
  }
  .anchor-footer {
    color: black;
    text-decoration: none;
    cursor: default;
  }
  .button-footer:active,
  .button-footer:focus {
    outline: none;
  }
  .button-footer:hover {
    transform: scale(1.02);
  }
  .highlight {
    color: orange;
    border-radius: 4px;
    background-color: green;
    padding: 0.25rem 0.5rem;
  }
  #score {
    background-color: rgb(15,83,126);
    border-radius: 5px;
    box-shadow: 2px 3px 9px rgb(153, 24, 24);
  }
  #chooseCategory {
    text-align: center;
  }
  </style>