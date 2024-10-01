import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaskService } from '../services/tasks-service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let componente: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HomeComponent],
      providers: [TaskService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('deve inicializar com o modal oculto', () => {
    expect(componente.isModalVisible).toBeFalse();
  });

  it('deve abrir o modal quando openModal for chamado', () => {
    componente.openModal();
    expect(componente.isModalVisible).toBeTrue();
  });

  it('deve marcar o formulário como inválido se os campos estiverem vazios', () => {
    componente.taskForm.controls['nome'].setValue('');
    componente.taskForm.controls['descricao'].setValue('');
    expect(componente.taskForm.invalid).toBeTrue();
  });

});
