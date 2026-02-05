import { collectRPSCoin } from './index.js';
import { Animations } from './animations.js';
import { Elements } from './uiElements.js';

export const RPSGame = {
  score: JSON.parse(localStorage.getItem('score')) || { wins: 0, losses: 0, ties: 0 },
  isPlaying: false,

  init() {
    if (i18next.isInitialized) {
    this.updateScoreText();
    this.updateRPSFillBar();
    this.updateSummaryScore();
  } else {
    i18next.on('initialized', () => {
      this.updateScoreText();
      this.updateRPSFillBar();
      this.updateSummaryScore();
    });
  }
  },

  // --- Core Game Logic ---
  
  async playGame(playerMove) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const computerMove = this.pickComputerMove();
    const result = this.determineResult(playerMove, computerMove);

    this.updateInternalScore(result);
    this.saveScore();

    await this.animateMoveResults(playerMove, computerMove, result);
    
    this.updateScoreText();
    if (result === 'win') this.updateRPSFillBar();
    
    if (this.score.wins >= 3) {
      collectRPSCoin();
    }

    this.updateSummaryScore();

    this.isPlaying = false;
  },

  determineResult(player, ai) {
    if (player === ai) return 'tie';
    
    const rules = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };

    return rules[player] === ai ? 'win' : 'lose';
  },

  pickComputerMove() {
    const moves = ['rock', 'paper', 'scissors'];
    return moves[Math.floor(Math.random() * moves.length)];
  },

  // --- State & Storage ---

  updateInternalScore(result) {
    if (result === 'win') this.score.wins++;
    else if (result === 'lose') this.score.losses++;
    else this.score.ties++;
  },

  saveScore() {
    localStorage.setItem('score', JSON.stringify(this.score));
  },

  resetRPSScore() {
    this.score = { wins: 0, losses: 0, ties: 0 };
    localStorage.removeItem('score');
    this.resetResult();
    
    Elements.setText(Elements.jsPlayerMove, '');
    Elements.setText(Elements.jsAiMove, '');
    Elements.jsAvatarMove?.forEach(el => el.classList.add('hidden'));
    
    this.updateRPSFillBar();
    this.updateSummaryScore();
  },

  // --- UI Rendering ---

  async animateMoveResults(player, ai, result) {
    Elements.jsAvatarMove?.forEach(el => el.classList.remove('hidden'));

    const playerHtml = `<img src="icons/${player}-emoji.png" class="move-icon">`;
    const aiHtml = `<img src="icons/${ai}-emoji.png" class="move-icon">`;
    const resultHtml = `<p class="result-highlight">${i18next.t(`index.rps-${result}`)}</p>`;

    Animations.fadeUpdate(Elements.jsPlayerMove, playerHtml);
    await Animations.fadeUpdate(Elements.jsAiMove, aiHtml);
    await Animations.fadeUpdate(Elements.jsResult, resultHtml);
  },

  updateRPSFillBar() {
    const { wins } = this.score;
    const percentage = Math.min((wins / 3) * 100, 100);
    
    if (Elements.rpsFill) Elements.rpsFill.style.width = `${percentage}%`;

    if (wins >= 3) {
      this.handleWinState();
    } else {
      this.handleProgressState(wins);
    }
  },

  handleWinState() {
    Elements.toggle(Elements.rpsGrayCoin, 'hidden', true);
    Elements.toggle(Elements.rpsGoldCoin, 'hidden', false);
    Animations.restart(Elements.rpsBarBorder, 'highlight');

    this.playCoinSpin();

    this.updateBarText(i18next.t('index.coin-collected-text'));
  },

  handleProgressState(wins) {
    const text = wins === 0 ? i18next.t('index.rps-win-3-times') : `${wins}/3`;
    this.updateBarText(text);
    
    if (wins === 0) {
      Elements.rpsBarBorder?.classList.remove('highlight');
      Elements.toggle(Elements.rpsGrayCoin, 'hidden', false);
      Elements.toggle(Elements.rpsGoldCoin, 'hidden', true);
      Elements.rpsBarText?.classList.remove('show');
    }
  },

  updateBarText(text) {
    if (!Elements.rpsBarText) return;
    Elements.rpsBarText.classList.remove('show');
    Elements.rpsBarText.innerHTML = text;
    void Elements.rpsBarText.offsetWidth;
    Elements.rpsBarText.classList.add('show');
  },

  updateScoreText() {
    const { wins, losses, ties } = this.score;
    if (wins === 0 && losses === 0 && ties === 0) {
      this.resetResult();
    } else if (wins !== 0 || losses !== 0 || ties !== 0) {
      if (Elements.jsResult.innerHTML.trim() === '') {
        this.resetResult();
      }
    }
  },

  updateSummaryScore() {
    Elements.setText(document.querySelector('.js-rps-wins'), this.score.wins);
    Elements.setText(document.querySelector('.js-rps-losses'), this.score.losses);
    Elements.setText(document.querySelector('.js-rps-ties'), this.score.ties);
  },

  resetResult() {
    if (Elements.jsResult) {
      Elements.jsResult.innerHTML = i18next.t('index.rps-make-a-move');
    }
  },

  playCoinSpin() {
    if (this.coinIsSpinning) return;
    this.coinIsSpinning = true;
    Animations.playCoinSpin(
      Elements.rpsGoldCoin,
      () => { this.coinIsSpinning = false; }
    );
  }
};