import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

// Bootstrap's JS bundle is loaded globally from angular.json "scripts"
declare const bootstrap: any;

@Component({
  selector: 'app-main-slider',
  imports: [],
  standalone: true,
  templateUrl: './main-slider.component.html',
  styleUrl: './main-slider.component.css'
})
export class MainSliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carousel') carouselRef!: ElementRef<HTMLElement>;

  slides = ['images/1.gif', 'images/2.avif', 'images/3.avif', 'images/4.avif'];
  private carousel: any;

  // data-bs-ride only works on the first page load, so start auto-play ourselves
  // (the slider is created later, every time the user opens Home)
  ngAfterViewInit(): void {
    if (typeof bootstrap === 'undefined') return;
    this.carousel = bootstrap.Carousel.getOrCreateInstance(this.carouselRef.nativeElement, {
      interval: 3500,
      ride: 'carousel',
      pause: 'hover',
    });
    this.carousel.cycle();
  }

  ngOnDestroy(): void {
    this.carousel?.dispose();
  }
}
