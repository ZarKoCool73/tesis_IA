import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent implements OnInit {

 link = ''

  constructor(private _activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      switch (params.type) {
        case 'abc':
          this.link = 'Abecedario'; break;
        case  'common-expressions':
          this.link = 'Expresiones comunes'; break;
        case   'numbers':
          this.link = 'Números'; break;
        case  'colors':
          this.link = 'Colores'; break;
      }
    })
  }

}
