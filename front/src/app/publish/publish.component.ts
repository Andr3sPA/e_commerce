import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { emptyProduct, Product } from '../browse/examples';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KeyValuePipe } from '@angular/common';
import { CamelToDisplayPipe } from '../camel-to-display.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-publish',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule,
    KeyValuePipe, CamelToDisplayPipe, MatIconModule, MatTooltipModule, MatDividerModule],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.css'
})
export class PublishComponent implements OnInit {
  formBuilder = inject(FormBuilder)
  productForm!: FormGroup
  fieldTypes = {
    name: "text",
    description: "textarea",
    category: "text",
    materials: "text",
    price: "number",
    size: "text",
    inStock: "number",
  }

  ngOnInit() {
    const p = emptyProduct()
    this.productForm = this.formBuilder.group({})
    Object.keys(p).forEach(k => {

      let controlType = "text"
      let validators = [Validators.required]
      switch (k) {
        case "inStock":
        case "price":
          controlType = "number"
          validators.push(Validators.min(0))
          break;
        case "description":
          controlType = "textarea"
          break;
      }

      this.productForm.addControl(k,
        this.formBuilder.control(p[k as keyof Product], {
          validators
        })
      )
      if (k === "imgUrl") {
        this.productForm.addControl("imgFile",
          this.formBuilder.control(null)
        )
      } else {
        this.fieldTypes[k as keyof typeof this.fieldTypes] = controlType
      }
    })
  }

  onImgChange(e: Event) {
    if ("files" in e.target!) {
      const img = (e.target.files as FileList)[0]
      const reader = new FileReader()
      reader.readAsDataURL((e.target.files as FileList)[0])
      reader.onload = () => {
        this.productForm.patchValue({
          imgFile: img,
          imgUrl: reader.result
        })
      }
    } else {
      console.error("file upload failed")
    }
  }

  onSubmit() {
    // TODO: validate img an the rest
    console.log(this.productForm.value)
  }
}
