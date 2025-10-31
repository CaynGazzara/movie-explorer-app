import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetails } from './components/movie-details/movie-details';
import { SearchBar } from './components/search-bar/search-bar';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';
import { TruncatePipe } from './pipes/truncate-pipe';

@NgModule({
  declarations: [
    App,
    MovieList,
    MovieDetails,
    SearchBar,
    LoadingSpinner,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
