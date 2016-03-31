import {Component, DynamicComponentLoader, ElementRef, Injector} from 'angular2/core'
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';


@Component({
    selector: 'app',
    template: `
    <div>
      <button (click)="click$.next('person')">Add a Person</button>
      <button (click)="click$.next('car')">Add a Car</button>
      
      <div #loadTarget></div>
    </div>
  `
})
export class App {
    click$ = new Subject();

    constructor(
        private _loader:DynamicComponentLoader,
        private _ref:ElementRef,
        private injector:Injector
    ) {
        const loadComp = comp => Observable
            .fromPromise(
                this._loader.loadIntoLocation(
                    //the injector looks up the component by string
                    this.injector.get(comp),
                    this._ref,
                    'loadTarget'
                )
            );

        this.click$
            //pass the 'string' from the click to the loadComp
            .switchMap(compName => loadComp(compName))
            .subscribe(comp => comp.instance.id = Math.random());
    }
}