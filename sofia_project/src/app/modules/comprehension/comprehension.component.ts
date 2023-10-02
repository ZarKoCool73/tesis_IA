import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent implements OnInit {

  url = {
    question: 'Preguntas',
    verbs: 'Verbos',
    adjetives: 'Adjetivos',
    utensils: 'Artículos del hogar'
  }
  link = ''

  constructor(private _activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      switch (params.type) {
        case 'question':
          this.link = 'Preguntas'; break;
        case  'verbs':
          this.link = 'Verbos'; break;
        case   'adjetives':
          this.link = 'Adjetivos'; break;
        case  'utensils':
          this.link = 'Artículos del hogar'; break;
      }
    })
  }

}
