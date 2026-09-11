import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  leftLink = output<void>();
  rightLink = output<void>();
  middleLink = output<void>();

  leftLinkClicked() {
    this.leftLink.emit();
  }

  rightLinkClicked() {
    this.rightLink.emit();
  }

  middleLinkClicked() {
    this.middleLink.emit();
  }
}
