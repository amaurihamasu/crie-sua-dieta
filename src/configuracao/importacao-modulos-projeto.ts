import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalCaloriasMacronutrientes } from 'src/app/componente/componente-modal';
import { ComponentePrincipal } from '../app/componente/componente-principal';
import { ImportacaoModulosMaterial } from '../configuracao/importacao-modulos-material';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ImportacaoModulosMaterial,
        MatNativeDateModule,
        ReactiveFormsModule,
    ],
    entryComponents: [ComponentePrincipal, ModalCaloriasMacronutrientes],
    declarations: [
        ComponentePrincipal, ModalCaloriasMacronutrientes],
    bootstrap: [ComponentePrincipal],
})
export class ImportacaoModulosProjeto { }