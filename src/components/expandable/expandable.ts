import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'expandable',
  templateUrl: 'expandable.html'
})
export class ExpandableComponent implements AfterViewInit {

  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
  // @ViewChild('iconButton', {read: ElementRef}) iconButton;
  expanded: boolean;
  @Input('expandHeight') expandHeight;
  @Input('title') title: string;
  iconName: string = "arrow-down";

  constructor(public renderer: Renderer2) {
  }

  ngAfterViewInit() {
    // this.renderer.removeAttribute(this.iconButton.nativeElement,'clickable','false');
    this.renderer.setStyle(this.expandWrapper.nativeElement, 'height', this.expandHeight + 'px');
    // this.renderer.setStyle(this.expandWrapper.nativeElement, 'height', 'auto');
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.iconName = this.iconName == "arrow-down" ? "arrow-up" : "arrow-down";
  }
}
