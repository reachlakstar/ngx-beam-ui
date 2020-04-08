import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {FormGroup} from "@angular/forms";

@Component({
  template: `
    <nb-card class="dialog-card">
      <nb-card-header>{{ title }}</nb-card-header>
      <nb-card-body>
        <form [formGroup]="configForm" (ngSubmit)="onFirstSubmit()">
          <p class="lorem">
            Lorizzle ipsum dolizzle stuff fizzle, consectetuer adipiscing break it down. Nullizzle sapien velizzle,
            my shizz pimpin', shizzle my nizzle crocodizzle shut the shizzle up, gravida vizzle, dang.
          </p>
          <div class="input-group">
            <input nbInput type="text" placeholder="Enter your name" class="form-control" formControlName="firstCtrl"
                   [ngClass]="{'form-control-danger': configForm.invalid && (configForm.dirty || configForm.touched)}">
          </div>
          <button nbButton nbStepperNext>next</button>
        </form>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" (click)="dismiss()">Dismiss Dialog</button>
      </nb-card-footer>
    </nb-card>
  `,
  styleUrls: ['./config.component.scss'],
})
export class ConfigsDialogComponent {
  @Input() title: string;

  configForm: FormGroup;

  constructor(protected ref: NbDialogRef<ConfigsDialogComponent>) {
  }

  dismiss() {
    this.ref.close();
  }

  onFirstSubmit() {

  }
}
