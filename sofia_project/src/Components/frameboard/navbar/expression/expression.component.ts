import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  getUrl(url: string) {
    return document.location.href.includes(url)
  }
}
