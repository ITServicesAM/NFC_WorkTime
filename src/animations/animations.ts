import {animate, state, style, transition, trigger} from '@angular/animations';
export function moveIn() {
  return trigger('moveIn', [
    state('void', style({position: 'fixed', width: '100%'})),
    state('*', style({position: 'fixed', width: '100%'})),
    transition(':enter', [
      style({opacity: '0', transform: 'translateX(100px)'}),
      animate('.6s ease-in-out', style({opacity: '1', transform: 'translateX(0)'}))
    ]),
    transition(':leave', [
      style({opacity: '1', transform: 'translateX(0)'}),
      animate('.3s ease-in-out', style({opacity: '0', transform: 'translateX(-200px)'}))
    ])
  ]);
}

export function saveToStoryboard() {
  return trigger('saveToStoryboard', [
    state('saved', style({
      opacity: 1,
      top: '*',
      left: '*',

    })),
    transition('* => void', [
      animate('500ms 10 ease-out',
        style({
          opacity: '0',
          left: '90%',
          top: '-50px'
        }))
    ])
  ]);
}

export function fallIn() {
  return trigger('fallIn', [
    transition(':enter', [
      style({opacity: '0', transform: 'translateY(40px)'}),
      animate('.2s .2s ease-in-out', style({opacity: '1', transform: 'translateY(0)'}))
    ]),
    transition(':leave', [
      style({opacity: '1', transform: 'translateX(0)'}),
      animate('.2s ease-in-out', style({opacity: '0', transform: 'translateX(-200px)'}))
    ])
  ]);
}

export function moveInLeft() {
  return trigger('moveInLeft', [
    transition(':enter', [
      style({opacity: '0', transform: 'translateX(-50px)'}),
      animate('.2s .2s ease-in-out', style({opacity: '1', transform: 'translateX(0)'}))
    ]),
    transition(':leave', [
      style({opacity: '1', transform: 'translateX(0px)'}),
      animate('.2s .2s ease-in-out', style({opacity: '0', transform: 'translateX(-50px)'}))
    ])
  ]);
}

export function fadeIn() {
  return trigger('fadeIn', [
    transition(':enter', [
      style({opacity: '0'}),
      animate('.6s .2s ease-in-out', style({opacity: '1'}))
    ]),
    transition(':leave', [
      style({opacity: '1'}),
      animate('.6s .2s ease-in-out', style({opacity: '0'}))
    ]),
  ]);
}
