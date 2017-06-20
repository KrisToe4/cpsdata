import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder,
         FormControl,
         FormGroup,
         ReactiveFormsModule } from '@angular/forms';

import { Inspection, 
         Client,
         Vehicle,
         Restraint } from '@server-src/data-classes/inspection-model';
import { InspectionService } from '@services/inspection.service';

@Component({
  selector: 'app-inspection-create',
  templateUrl: './new.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './new.component.css'
  ]
})
export class InspectionNewComponent implements OnInit {

  form: FormGroup;
  unsavedChanges: boolean = false;

  constructor( private formBuilder: FormBuilder,
               private inspectionService: InspectionService,
               private router: Router ) { }

  ngOnInit() {

    this.buildForm();
  }

  private buildForm() {

    this.form = this.formBuilder.group({    
      client: this.formBuilder.group(new Client()),
      date: new Date().toISOString().substring(0, 10),
      location: "",
      vehicle: this.formBuilder.group(new Vehicle()),
      restraint: this.formBuilder.group(new Restraint())
    });

    this.form.valueChanges.subscribe(() => {
      this.unsavedChanges = true;
    });
  }

  private createBtnClicked() {

    let component = this;

    if (this.unsavedChanges) {

      console.log(this.form.value);

      // We'll eventually want some validation but for now don't bother
      this.inspectionService.createInspection(this.form.value, function(error: string) {

        if (error) {

        }
        else {

          alert("Inspection Created");
          component.switchToList();
        }
      });
    }
  }

  private cancelBtnClicked() {
    
    this.switchToList();
  }

  private switchToList() {

    this.router.navigate(["/tech/inspection"]);
  }
}
