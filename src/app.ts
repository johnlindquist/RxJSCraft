import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/window';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/from';

const container = document.querySelector('.container');
const redBalls = document.querySelectorAll('.red-ball');
const redBallsArray = Array.from(redBalls);
const redBalls$ = Observable.from(redBallsArray);


const redistribute = ()=> {
    redBallsArray.forEach(ball => {
        const targetX = (Math.random() * 180) + 10 - ball.offsetWidth / 2;
        const targetY = (Math.random() * 180) + 10 - ball.offsetHeight / 2;

        ball.style['transition-duration'] = "1s";
        ball.style.transform = `translateX(${targetX}px) translateY(${targetY}px)`;
    });
};
redistribute();

Observable.fromEvent(document.querySelector('.random'), 'click')
    .do(event => event.stopPropagation())
    .subscribe(redistribute);

const redBallClick$ = Observable.fromEvent(redBalls, 'click')
    .do(event => event.stopPropagation());

const containerClick$ = Observable.fromEvent(container, 'click')
    .do(event => event.stopPropagation());

//yay currying
const changeElementColor = color => element => {
    element.style.backgroundColor = color;
};

redBallClick$
    .pluck('target')
    .subscribe(changeElementColor("green"));

containerClick$
    .switchMapTo(redBalls$)
    .subscribe(changeElementColor("red"));

redBallClick$
    .pluck("target")
    .distinct((x, y)=> x === y, containerClick$)
    .buffer(containerClick$)
    .switchMap(Observable.from)
    .withLatestFrom(containerClick$, (ball, event)=> ({ball, event}))
    .subscribe(({ball, event})=>{
            const {clientX:x, clientY:y} = event;
            const {offsetLeft:left, offsetTop:top, offsetWidth:w, offsetHeight:h} = ball;

            const targetX = x - left - w/2;
            const targetY = y - top - h/2;
            ball.style['transition-duration'] = "1s";
            ball.style.transform = `translateX(${targetX}px) translateY(${targetY}px)`;
        }
    );





