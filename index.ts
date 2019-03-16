import { TweenMax, TimelineMax, Linear, Sine, Elastic } from 'gsap';
import './src/plugins/DrawSVGPlugin.min.js';
import './src/plugins/Physics2DPlugin.min.js';
import GSDevTools from './src/utils/GSDevTools.min.js';

class App {
  select = s => document.querySelector(s);
  selectAll = s => document.querySelectorAll(s);
  
  mainTl = new TimelineMax({repeat: -1});
  liquidFront = this.select('#liquid-front')
  liquidBack = this.select('#liquid-back')
  ekgOuter = this.select('#ekg-outer');
  ekgInner = this.select('#ekg-inner');
  progressInner = this.select('#progress-line-inner')
  progressOuter = this.select('#progress-line-outer')
  bubbles = this.selectAll('#liquid-bubbles circle')
  particlesLeft = this.selectAll('#particles-left circle');
  particlesRight = this.selectAll('#particles-right circle');
  check = this.select('#check');
  button = this.select('button');
  
  constructor() {
    TweenMax.set(this.check, {transformOrigin: 'center center', rotation: '-=90', scale: 0, opacity: 0})
    TweenMax.set(this.ekgOuter, {opacity: '0.3'})
    TweenMax.set(this.progressInner, {opacity: '0.3'})
    // TweenMax.set([this.progressInner, this.progressOuter], {opacity: '0.3'})
    TweenMax.set([this.ekgOuter, this.ekgInner], {drawSVG: '0% 0%'})
    TweenMax.set([this.progressInner, this.progressOuter], {drawSVG: '0%'})
    
    let ekgTl = new TimelineMax({repeat: -1});
    ekgTl
    .fromTo([this.ekgOuter, this.ekgInner], 0.3, {drawSVG: '0%'}, {drawSVG: '0% 30%', ease: Linear.easeNone}) // enter
    .to([this.ekgOuter, this.ekgInner], 1, {drawSVG: '70% 100%', ease: Linear.easeNone}) // draw through as 30% segment
    .to([this.ekgOuter, this.ekgInner], 0.3, {drawSVG: '100% 100%', ease: Linear.easeNone})
    .addCallback(this.playParticles, '-=1.2', [this.particlesLeft])
    .addCallback(this.playParticles, '-=0.85', [this.particlesRight])
     
    let frontLiquidTimeline = new TimelineMax({repeat:-1});
    frontLiquidTimeline.from('#liquid-front', 3, {
      x: -600,
      ease:Linear.easeNone
    })

    let backLiquidTimeline = new TimelineMax({repeat:-1});
    backLiquidTimeline.to('#liquid-back', 3, {
      x: -600,
      ease:Linear.easeNone
    })

    const bubbleArray = [66, 89, 102, 95, 88, 78, 102, 96, 88, 82, 97, 90, 100, 82]
    let bubbleTl =  new TimelineMax({repeat: -1})
    this.bubbles.forEach((bubble, index) => {
      bubbleTl
      .to(bubble, 0.8, {
        attr: {
          cy: `-=${bubbleArray[index]}`
        },
        ease: Sine.easeInOut
      })
      .to(bubble, 0.7, {
        attr: {
          cy: `+=${bubbleArray[index]}`
        },
        ease: Sine.easeIn,
        onComplete: this.resetBubblePos,
        onCompleteParams: [bubble]
      })
    });
    bubbleTl.pause();

    let progressNumber: number = 0;
    this.button.addEventListener('click', () => {
      if (bubbleTl.paused()) {
        bubbleTl.play();
      }

      if (progressNumber < 100) {
        progressNumber +=10;
        console.log(progressNumber);
        TweenMax.to(['#liquid-front', '#liquid-back'], 0.5, {y: '-=14'})
        TweenMax.to([this.progressInner, this.progressOuter], 0.5, {
          drawSVG: progressNumber + '%'
        })
      }

      if (progressNumber === 100) {
        bubbleTl.pause();
        ekgTl.restart();
        ekgTl.pause();
        TweenMax.set('#track-left', {transformOrigin: 'right'})
        TweenMax.set('#track-right', {transformOrigin: 'left'})
        TweenMax.set('#progress-line-outer', {transformOrigin: 'center'})
        TweenMax.set(this.progressInner, {autoAlpha: 0})
        let endTl = new TimelineMax()
        endTl
          .to(this.check, 0.3, {
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: Sine.easeIn
          })
          .to(['#track-left', '#track-right', '#progress-line-outer'], 0.3, {
            scaleX: 0,
            opacity: 0
          })
      }
    })

    this.mainTl
    .add(ekgTl, 0)
    .add(frontLiquidTimeline, 0)
    .add(backLiquidTimeline, 0)
  
  }

  randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  resetBubblePos = (bubble: object) => {
    TweenMax.set(bubble, {
      attr:{
        cx: this.randomBetween(340, 470),
        r: this.randomBetween(3, 6)
      }
    })
  }

  playParticles = (pArray: Array<Object>) => {
    let d = pArray;
    let i = d.length;

    for(let p of d) {
      TweenMax.set(p, {
        x: 0,
        y: 0,
        attr: {
          r: 2,
          cx: 110,
          cy: 75
        },
        alpha: 0,
        scale: this.randomBetween(5, 10) / 10,
        transformOrigin: '50% 50%'
      })

      let tl = new TimelineMax();
      tl
      .set(p, {alpha: 1})
      .to(p, this.randomBetween(2, 9) / 10, {
        physics2D: {
          velocity: this.randomBetween(24, 70),
          angle: this.randomBetween(-120, -45),
          gravity: this.randomBetween(55, 70)
        }, 
        scale: 0
      });
    }
  }
}

TweenMax.set('svg',{
  transformOrigin:'50% 50%',
  visibility: 'visible'
})

// GSDevTools.create();
let app = new App();