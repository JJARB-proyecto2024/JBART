import { Component, Input, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: "./my-account.component.html",
})
export class MyAccountComponent implements OnInit {
  public userName?: string = '';
  public role?: string = '';
  private service = inject(AuthService);
  @Input() authority!: string | undefined;
  constructor(public router: Router) {
    this.authority = this.service.getUser()?.authorities?.[0]?.authority;
  }

  ngOnInit() {
    const user = this.service.getUser();
    if (user) {
      this.userName = user.name;
      if (user.authorities && user.authorities[0].authority === "ROLE_USER") {
        this.role = "Comprador";
      }
      if (user.authorities && user.authorities[0].authority === "ROLE_USER_BRAND") {
        this.role = "Marca";
      }
      if (user.authorities && user.authorities[0].authority === "ROLE_SUPER_ADMIN") {
        this.role = "Admin";
      }
    }
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}