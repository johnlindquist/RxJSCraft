import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {Person} from './person';
import {Car} from './car';
import {App} from './app';

bootstrap(App, [
    provide('person', {useValue: Person}),
    provide('car', {useValue: Car})
])
    .catch(console.log.bind(console));