import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { TruncatePipe } from './pipes/truncate-pipe';

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieDetailsComponent,
    SearchBarComponent,
    LoadingSpinnerComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }