import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import htmlToPdfmake from 'html-to-pdfmake';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ModalCaloriasMacronutrientes } from './componente-modal';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export interface Alimento {
  posicao: number;
  alimento: string;
  categoria: any;
  quantidade: number;
  proteinaEmGramas: number;
  gorduraEmGramas: number;
  carboidratoEmGramas: number;
}

@Component({
  selector: 'componente-principal',
  templateUrl: 'componente-principal.html',
  styleUrls: ['componente-principal.css'],
})

export class ComponentePrincipal implements OnInit {

  @ViewChild('pdfTable') pdfTable: ElementRef;

  tabelaTaco: Observable<any>;

  categoriaAlimentos: Array<string> = [];

  totalProteinaGramasPorRefeicao: number;
  totalGorduraGramasPorRefeicao: number;
  totalCarboidratoGramasPorRefeicao: number;

  colunasTabelaItensSelecionados = ['quantidade', 'alimento', 'proteina', 'gordura', 'carboidrato', 'manter'];
  itensSelecionados: Array<Alimento> = new Array();
  tabelaItensSelecionados: MatTableDataSource<Alimento> = new MatTableDataSource<Alimento>();

  displayedColumns = ['alimento', 'proteina', 'gordura', 'carboidrato'];
  dataSource: MatTableDataSource<Alimento>;

  isNumber = (value: any) => typeof value == "number";

  constructor(private chamadaHttp: HttpClient, public dialog: MatDialog) {

    this.tabelaTaco = chamadaHttp
      .get<any>('assets/tabela-taco.json')
      .pipe(
        shareReplay(1)
      );
  
  }

  ngOnInit(): void {
    this.obterCategorias();
    this.obterListaAlimentos();
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalCaloriasMacronutrientes, {
      data: {}
    });

    dialogRef.afterClosed().subscribe((valoresInformados: any) => {
      this.totalProteinaGramasPorRefeicao = valoresInformados.totalProteinaGramasPorRefeicao;
      this.totalGorduraGramasPorRefeicao = valoresInformados.totalGorduraGramasPorRefeicao;
      this.totalCarboidratoGramasPorRefeicao = valoresInformados.totalCarboidratoGramasPorRefeicao;
    });

  }

  obterCategorias = () => this.tabelaTaco.subscribe(json => this.categoriaAlimentos = Array.from(new Set(Object.values(json).map((item: any) => item.category))));

  obterListaAlimentos = () => {
    this.tabelaTaco.subscribe(json => {
      let listaAlimentos: Array<Alimento> = Object
        .values(json)
        .map((item: any) =>
        ({
          posicao: item.id,
          alimento: item.description,
          categoria: item.category,
          quantidade: 100,
          proteinaEmGramas: this.isNumber(item.protein_g) ? this.arrendondarValor(item.protein_g) : 0,
          gorduraEmGramas: this.isNumber(item.lipid_g) ? this.arrendondarValor(item.lipid_g) : 0,
          carboidratoEmGramas: this.isNumber(item.carbohydrate_g) ? this.arrendondarValor(item.carbohydrate_g) : 0
        }));
      this.dataSource = new MatTableDataSource<Alimento>(listaAlimentos);
    });
  }

  aplicarFiltro = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  removerAlimentoListaSelecionados(indice: number) {
    this.itensSelecionados.forEach((alimento, posicao) => {
      if (alimento.posicao == indice) {
        this.itensSelecionados.splice(posicao, 1);
      }
    });
    this.tabelaItensSelecionados = new MatTableDataSource(this.itensSelecionados);
  }

  addAlimentoListaSelecionados(alimento: Alimento) {
    this.itensSelecionados.push({ ...alimento });
    this.tabelaItensSelecionados = new MatTableDataSource(this.itensSelecionados);
  }

  itemJaSelecionado(indice: number) {
    return this
      .tabelaItensSelecionados
      .data
      .find(alimento => alimento.posicao == indice) ? true : false;
  }

  diminuirQuantidadeGramas = (alimentoTabelaItemSelecionado: Alimento) => {
    const alimentoTabelaOriginal = this.dataSource.data.find(alimento => alimento.posicao == alimentoTabelaItemSelecionado.posicao);

    if (alimentoTabelaOriginal) {
      alimentoTabelaItemSelecionado.quantidade--;
      alimentoTabelaItemSelecionado.proteinaEmGramas = this.arrendondarValor(alimentoTabelaOriginal.proteinaEmGramas * alimentoTabelaItemSelecionado.quantidade / 100);
      alimentoTabelaItemSelecionado.gorduraEmGramas = this.arrendondarValor(alimentoTabelaOriginal.gorduraEmGramas * alimentoTabelaItemSelecionado.quantidade / 100);
      alimentoTabelaItemSelecionado.carboidratoEmGramas = this.arrendondarValor(alimentoTabelaOriginal.carboidratoEmGramas * alimentoTabelaItemSelecionado.quantidade / 100);
    }

  };

  aumentarQuantidadeGramas = (alimentoTabelaItemSelecionado: Alimento) => {
    const alimentoTabelaOriginal = this.dataSource.data.find(alimento => alimento.posicao == alimentoTabelaItemSelecionado.posicao);
    if (alimentoTabelaOriginal) {
      alimentoTabelaItemSelecionado.quantidade++;
      alimentoTabelaItemSelecionado.proteinaEmGramas = this.arrendondarValor(alimentoTabelaOriginal.proteinaEmGramas * alimentoTabelaItemSelecionado.quantidade / 100);
      alimentoTabelaItemSelecionado.gorduraEmGramas = this.arrendondarValor(alimentoTabelaOriginal.gorduraEmGramas * alimentoTabelaItemSelecionado.quantidade / 100);
      alimentoTabelaItemSelecionado.carboidratoEmGramas = this.arrendondarValor(alimentoTabelaOriginal.carboidratoEmGramas * alimentoTabelaItemSelecionado.quantidade / 100);
    }
  }

  totalProteina = () => this.arrendondarValor(this.itensSelecionados.map(alimento => alimento.proteinaEmGramas).reduce((somatoria, valor) => somatoria + valor, 0));

  totalGordura = () => this.arrendondarValor(this.itensSelecionados.map(alimento => alimento.gorduraEmGramas).reduce((somatoria, valor) => somatoria + valor, 0));

  totalCarboidrato = () => this.arrendondarValor(this.itensSelecionados.map(alimento => alimento.carboidratoEmGramas).reduce((somatoria, valor) => somatoria + valor, 0));

  totalEmGramas = () => this.arrendondarValor(this.itensSelecionados.map(alimento => alimento.quantidade).reduce((somatoria, valor) => somatoria + valor, 0));

  arrendondarValor = (valor: number) => Number((valor).toFixed(2));

  recarregarPagina = () => window.location.reload();

  public downloadAsPDF() {
    const doc = new jsPDF();
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }

}
