import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/component/navbar/navbar.component";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../../shared/component/footer/footer.component";

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
