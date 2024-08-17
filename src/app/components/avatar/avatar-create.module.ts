import { NgModule } from '@angular/core';
import { AvatarCreateComponent } from './avatar-create.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AvatarCreateComponent],
  imports: [CommonModule],
  exports: [AvatarCreateComponent]
})
export class AvatarModule { }