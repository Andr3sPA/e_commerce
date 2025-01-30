import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { KeyValuePipe } from '@angular/common';
import { CamelToDisplayPipe } from '../camel-to-display.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { Product, emptyProduct } from '../../models/product';

@Component({
  selector: 'app-publish',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule,
    KeyValuePipe, CamelToDisplayPipe, MatIconModule, MatTooltipModule, MatDividerModule],
  templateUrl: './publish.component.html',
  styleUrl: './publish.component.css'
})
export class PublishComponent implements OnInit {
  httpClient = inject(HttpClient)
  formBuilder = inject(FormBuilder)
  productForm!: FormGroup
  fieldTypes: { [key in keyof Product]?: string } = {
    name: "text",
    description: "textarea",
    reference: "text",
    color: "text",
    material: "text",
    price: "number",
    size: "text",
  }
  imgUrl?: string;

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

    })
  }

  onImgChange(e: Event) {
    if ("files" in e.target!) {
      const img = (e.target.files as FileList)[0]
      this.productForm.patchValue({
        image: img
      })
      const reader = new FileReader()
      reader.readAsDataURL(img)
      reader.onload = () => {
        this.imgUrl = reader.result as string
      }
    } else {
      console.error("file upload failed")
    }
  }

  onSubmit() {
    if (this.productForm.status !== "VALID") {
      return
    }
    const formData = new FormData()
    Object.entries(this.productForm.value).forEach(([k, v]: any) => {
      formData.append(k, v)
    })

    console.log("sending... ", this.productForm.value)
    this.httpClient.post("http://localhost:8080/clothes", formData).subscribe(res => {
      console.log("got res: ", res)
    })
  }

  submitBtnOffset = "0%"
  onSubmitBtnHover() {
    let newOffset = 50 + Math.random() * 200
    if (this.submitBtnOffset[0] !== "-") {
      newOffset = -newOffset
    }
    this.submitBtnOffset = Math.floor(newOffset) + "%"
    console.log(this.submitBtnOffset)
  }
}
