import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  score = 0;
  gameOver = false;
  ballSpeed = 2;
  ballInterval: any;
  multiplier = 1;
  flashedScore: string = ''; // To hold the flash score

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.score = 0;
    this.gameOver = false;
    this.resetBall();

    const ball = document.getElementById('ball') as HTMLElement;
    if (this.ballInterval) clearInterval(this.ballInterval);

    // Set interval for ball falling
    this.ballInterval = setInterval(() => {
      if (this.gameOver) return;

      let ballTop = parseInt(ball.style.top || '0', 10);
      ballTop += this.ballSpeed;
      ball.style.top = `${ballTop}px`;

      // Basket detection logic
      const basket = document.getElementById('basket')!;
      const ballRect = ball.getBoundingClientRect();
      const basketRect = basket.getBoundingClientRect();

      // Caught by basket
      if (
        ballRect.bottom >= basketRect.top &&
        ballRect.left >= basketRect.left &&
        ballRect.right <= basketRect.right
      ) {
        this.score++;
        this.flashMultiplication(); // Generate flash score
        this.resetBall(); // Reset ball after successful catch
      }

      // Missed - hit the bottom of the frame (GAME OVER)
      const gameFrame = document.getElementById('game-frame')!;
      const frameRect = gameFrame.getBoundingClientRect();

      if (ballRect.bottom >= frameRect.bottom) { // missed basket
        this.gameOver = true;
        clearInterval(this.ballInterval);
      }
    }, 10);
  }

  flashMultiplication() {
    const currentCatch = this.score; // Use the score as the catch number
    this.flashedScore = `${this.multiplier} x ${currentCatch} = ${this.multiplier * currentCatch}`;

    // Reset the flashed score after 1 second (flashes for 1 second)
    setTimeout(() => {
      this.flashedScore = '';
    }, 1000);
  }

  resetBall() {
    const ball = document.getElementById('ball')!;
    const gameFrame = document.getElementById('game-frame')!;
    const frameWidth = gameFrame.offsetWidth;

    const randomLeft = Math.floor(Math.random() * (frameWidth - 30)); // Ball width is 30px
    ball.style.top = '0px';
    ball.style.left = `${randomLeft}px`;
  }

  // Handle multiplier input
  onSubmitMultiplier(inputValue: number) {
    if (!isNaN(inputValue) && inputValue > 0) {
      this.multiplier = inputValue;
      this.startGame();
    } else {
      this.multiplier = 1;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    const basket = document.getElementById('basket')!;
    const gameFrame = document.getElementById('game-frame')!;
    const frameWidth = gameFrame.offsetWidth;

    let left = basket.offsetLeft; // instead of parsing style

    if (event.key === 'ArrowLeft' && left > 50) {
      basket.style.left = `${left - 15}px`;
    } else if (event.key === 'ArrowRight' && left < frameWidth - 50) {
      basket.style.left = `${left + 15}px`;
    } else if (event.key.toLowerCase() === 'r' && this.gameOver) {
      this.startGame(); // Restart the game
    }
  }
}
