import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  getUrl(url: string) {
    return document.location.href.includes(url)
  }
}
