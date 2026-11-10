import { Component, inject, Input } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

// Bootstrap's JS bundle is loaded globally from angular.json "scripts"
declare const bootstrap: any;
import { AuthService } from '../../../core/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() layout!: string;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly cartService = inject(CartService);
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    this.cartService.cartCount$.subscribe((count) => {
      this.c = count;
    });
  
    // No cart yet answers 404; the badge just stays at 0
    this.cartService.getLoggedUserCart().subscribe({ error: () => {} });

    // On phones, close the opened menu after the user picks a page
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const menu = document.getElementById('navbarSupportedContent');
        if (menu?.classList.contains('show') && typeof bootstrap !== 'undefined') {
          bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
        }
      });
  }
 c: number = 0;


}
