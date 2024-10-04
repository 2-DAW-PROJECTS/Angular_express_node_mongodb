import { Component, Input } from '@angular/core';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-list-errors',
  standalone: true,
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, KeyValuePipe, TitleCasePipe],
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.scss']
})
export class ListErrorsComponent {
  @Input() form?: AbstractControl;
  @Input() errors?: { [key: string]: string[] | null } = {};
}
