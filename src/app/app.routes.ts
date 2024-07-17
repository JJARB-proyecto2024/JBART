import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRole } from './interfaces';
import { BrandSignupComponent } from './pages/auth/brand-signup/brand-signup.component';
import { BrandUserListComponent } from './components/brand-user/brand-user-list/brand-user-list.component';
import { BuyerSignupComponent } from './pages/auth/buyer-signup/buyer-signup.component';
import { BrandUsersComponent } from './pages/brandUsers/brand-users.component';
import { ResetPasswordSendEmailComponent } from './pages/auth/reset-password/reset-password-send-email/reset-password-send-email.component';
import { ResetPasswordValidateComponent } from './pages/auth/reset-password/reset-password-validate/reset-password-validate.component';
import { BuyerProfileComponent } from './pages/profile/buyer-profile/buyer-profile.component';
import { BrandProfileComponent } from './pages/profile/brand-profile/brand-profile.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup/brand',
    component: BrandSignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup/buyer',
    component: BuyerSignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset/email',
    component: ResetPasswordSendEmailComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset/validate',
    component: ResetPasswordValidateComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          name: 'Usuarios'
        }
      },
      {
        path: 'brands',
        component: BrandUsersComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          showInSidebar: true,
          name: 'Marcas'
        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Dashboard'
        }
      },
      {
        path: 'buyer-profile',
        component: BuyerProfileComponent,
        data: { 
          authorities: [
            IRole.user
          ],
          name: 'Perfil',
          showInSidebar: false
        }
      },
      {
        path: 'brand-profile',
        component: BrandProfileComponent,
        data: { 
          authorities: [
            IRole.userBrand
          ],
          name: 'Perfil',
          showInSidebar: false
        }
      }
      
    ],
  },
];
