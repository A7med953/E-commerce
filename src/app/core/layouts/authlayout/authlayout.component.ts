import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/component/navbar/navbar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-authlayout',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './authlayout.component.html',
  styleUrl: './authlayout.component.css'
})
export class AuthlayoutComponent {

}
