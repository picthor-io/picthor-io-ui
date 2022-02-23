export class BaseFormComponent {
  id: string;

  constructor() {
    this.id = Math.random().toString(36).slice(2);
  }
}
