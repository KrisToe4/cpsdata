import { Component,
         ElementRef,
         OnInit, 
         QueryList,
         ViewChildren } from '@angular/core';

import { FormBuilder, 
         FormGroup,
         Validators }  from '@angular/forms';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignatureFieldComponent } from "@parts/signature-field/signature-field.component";

@Component({
  templateUrl: './waiver.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './waiver.component.css'
  ]
})
export class InspectionWaiverComponent implements OnInit {

  @ViewChildren(SignatureFieldComponent) public sigs: QueryList<SignatureFieldComponent>;
  @ViewChildren('sigContainer1') public sigContainer1: QueryList<ElementRef>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.beResponsive();
    this.setOptions();
  }

  // set the dimensions of the signature pad canvas
  beResponsive() {

    console.log('Resizing signature pad canvas to suit container size')
    this.size(this.sigContainer1.first, this.sigs.first);
  }

  size(container: ElementRef, sig: SignatureFieldComponent){

    sig.signaturePad.set('canvasWidth', container.nativeElement.clientWidth);
    sig.signaturePad.set('canvasHeight', container.nativeElement.clientHeight);
  }

  setOptions() {

    this.sigs.first.signaturePad.set('penColor', 'rgb(0, 0, 0)');
    this.sigs.last.signaturePad.clear(); // clearing is needed to set the background colour
  }

  submit() {

    console.log('CAPTURED SIGS:');
    console.log(this.sigs.first.signature);
    console.log(this.sigs.last.signature);
  }

  clear() {

    this.sigs.first.clear();
    this.sigs.last.clear();
  }
}
