import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  startDate = new Date('2026-06-28T00:00:00');
  
  timeTogether = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  showLetter = false;
  isPlaying = false;
  showBackToTop = false;
  selectedImage: string | null = null;
  cardVisible: boolean[] = [];

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChildren('momentoCard', { read: ElementRef }) cardElements!: QueryList<ElementRef>;

  private observer: IntersectionObserver | null = null;

  momentos = [
    {
      title: 'Yantakuy',
      date: 'Julio 2026',
      desc: 'Nunca imaginé que cortar un árbol podía ser tan divertido. Fue lindo conocer tu pueblo y compartir ese momento contigo.',
      img: 'assets/img/arbol.jpeg'
    },
    {
      title: 'Zoológico',
      date: 'Julio 2026',
      desc: 'Viéndolo todo con ojos de niño. Ese día supe que a tu lado hasta lo más simple se vuelve mágico.',
      img: 'assets/img/zoo.jpeg'
    },
    {
      title: 'Fútbol',
      date: 'Julio 2026',
      desc: 'Tenerte en la cancha alentándome fue la mejor motivación. Verte ahí sonriendo hizo que ese partido fuera especial sin importar el resultado.',
      img: 'assets/img/futbol.jpeg'
    }
  ];

  ngOnInit() {
    this.calculateTime();
    setInterval(() => this.calculateTime(), 1000);
  }

  ngAfterViewInit() {
    this.cardVisible = this.momentos.map(() => false);
    this.setupScrollReveal();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollReveal() {
    this.cardElements.changes.subscribe(() => this.observeCards());
    this.observeCards();
  }

  private observeCards() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = this.cardElements.toArray();
          const i = cards.findIndex(c => c.nativeElement === entry.target);
          if (i !== -1) {
            this.cardVisible[i] = true;
          }
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.cardElements.forEach(card => {
      this.observer?.observe(card.nativeElement);
    });
  }

  calculateTime() {
    const now = new Date();
    const diff = now.getTime() - this.startDate.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.timeTogether.months = Math.floor(days / 30);
    this.timeTogether.days = days % 30;
    this.timeTogether.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    this.timeTogether.minutes = Math.floor((diff / 1000 / 60) % 60);
    this.timeTogether.seconds = Math.floor((diff / 1000) % 60);
  }

  toggleAudio() {
    if (!this.audioPlayer) return;
    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();
    } else {
      this.audioPlayer.nativeElement.play().catch(e => console.log('Play prevented'));
    }
    this.isPlaying = !this.isPlaying;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openLightbox(img: string) {
    this.selectedImage = img;
  }

  closeLightbox() {
    this.selectedImage = null;
  }

  openLetter() {
    this.showLetter = true;
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.play().catch(e => console.log('Auto-play prevent default'));
      this.isPlaying = true;
    }
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop = window.scrollY > 400;
  }
}
