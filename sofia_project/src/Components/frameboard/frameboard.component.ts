import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-frameboard',
  templateUrl: './frameboard.component.html',
  styleUrls: ['./frameboard.component.scss']
})
export class FrameboardComponent implements OnInit {
  name = 'World';
  constructor() { }

  @HostListener('window:resize', ['$event'])
  changeNavHeight() {
    const header = document.getElementById('header')
    const navbar = document.getElementById('navbar')
    const content = document.getElementById('content')
    if (header && navbar) {
      navbar.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
    if (header && content) {
      content.style.height = window.innerHeight - header.offsetHeight + 'px'
    }
  }

  ngOnInit(): void {
    this.changeNavHeight()
  }

}
