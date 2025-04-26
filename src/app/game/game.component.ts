import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  score = 0;
  gameOver = false;
  ballSpeed = 2;
  ballInterval: any;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.score = 0;
    this.gameOver = false;
    this.resetBall();
  
    const ball = document.getElementById('ball') as HTMLElement;
  
    if (this.ballInterval) clearInterval(this.ballInterval);
  
    this.ballInterval = setInterval(() => {
      if (this.gameOver) return; // if game over, stop moving ball
  
      let ballTop = parseInt(ball.style.top || '0', 10);
      ballTop += this.ballSpeed;
      ball.style.top = `${ballTop}px`;
  
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
        this.resetBall(); // reset ball after successful catch
      }
  
      // Missed - hit the bottom of frame (GAME OVER)
      const gameFrame = document.getElementById('game-frame')!;
      const frameRect = gameFrame.getBoundingClientRect();
  
      if (ballRect.bottom >= frameRect.bottom) { // missed basket
        this.gameOver = true;
        clearInterval(this.ballInterval);
        // Don't use alert
      }
       
    }, 20);
  }
    
  resetBall() {
    const ball = document.getElementById('ball')!;
    const randomLeft = Math.floor(Math.random() * 220); // Adjust to stay inside game-frame
    ball.style.top = '0px';  // Reset ball to top
    ball.style.left = `${randomLeft}px`; // Random horizontal position
  }
    


  @HostListener('window:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    const basket = document.getElementById('basket')!;
    const left = parseInt(basket.style.left || '150', 10);

    if (event.key === 'ArrowLeft' && left > 0) {
      basket.style.left = `${left - 15}px`;
    } else if (event.key === 'ArrowRight' && left < 300) {
      basket.style.left = `${left + 15}px`;
    } else if (event.key.toLowerCase() === 'r' && this.gameOver) {
      this.startGame();
    }
  }
}
