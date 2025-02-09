import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appElementEvade]'
})
export class ElementEvadeDirective implements OnChanges {
  /**
  * @description
  * Handles wheter the element should evade or not
  */
  @Input() evade?: boolean = true
  @Input() vertical?: boolean = false
  elem!: HTMLElement
  offset = 0

  constructor(el: ElementRef) {
    this.elem = el.nativeElement
    this.elem.style.setProperty("--offset", "0")
    this.elem.style.transition = "transform .2s ease-out"
    if (this.vertical) {
      this.elem.style.transform = "translateY(var(--offset))"
    } else {
      this.elem.style.transform = "translateX(var(--offset))"
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["evade"].currentValue == false) {
      this.offset = 0
      this.elem.style.setProperty("--offset", "0")
    }
  }

  @HostListener("mouseover") onHover() {
    if (this.evade) {
      this.move()
    }
  }

  move() {
    let newOffset = Math.max(100, Math.random() * 200)
    if (this.offset > 0) {
      newOffset = -newOffset
    }
    this.offset = Math.floor(newOffset)
    this.elem.style.setProperty("--offset", this.offset + "%")
  }

}
