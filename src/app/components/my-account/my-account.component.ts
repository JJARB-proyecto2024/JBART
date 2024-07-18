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
  public userName: string = 'Test';
  private service = inject(AuthService);
  @Input() authority!: string | undefined;
  constructor(public router: Router) {
    this.authority = this.service.getUser()?.authorities?.[0]?.authority;
  }

  ngOnInit() { }

  logout() {
     this.service.logout();
     this.router.navigateByUrl('/login');
  }
}