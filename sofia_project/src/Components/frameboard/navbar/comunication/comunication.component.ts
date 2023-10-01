import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comunication',
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.scss']
})
export class ComunicationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  getUrl(url: string) {
    return document.location.href.includes(url)
  }
}
