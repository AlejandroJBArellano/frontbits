import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CreatePage } from './create';
import { CreatePageRoutingModule } from './create-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    CreatePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    CreatePage,
  ]
})
export class CreateModule { }
