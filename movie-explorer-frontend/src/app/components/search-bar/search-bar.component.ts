import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor() {
    // Configurar debounce para search em tempo real
    this.searchSubject.pipe(
      debounceTime(400), // Aguarda 400ms após a última tecla
      distinctUntilChanged() // Só emite se o valor mudou
    ).subscribe(query => {
      if (query.trim()) {
        this.search.emit(query.trim());
      } else {
        this.clear.emit();
      }
    });
  }

  onInputChange() {
    this.searchSubject.next(this.searchQuery);
  }

  onClear() {
    this.searchQuery = '';
    this.clear.emit();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClear();
    }
  }
}