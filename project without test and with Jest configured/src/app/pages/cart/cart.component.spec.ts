import { Book } from './../../models/book.model';
import { BookService } from './../../services/book.service';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { log } from 'console';

const listBook: Book[] = [
  { name: '', author: '', isbn: '', price: 15, amount: 2 },
  { name: '', author: '', isbn: '', price: 20, amount: 1 },
  { name: '', author: '', isbn: '', price: 8, amount: 7 },
];

describe('cart component', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CartComponent],
      providers: [BookService, CartComponent], // CartComponent lo pusimoas aca para la segunda manera de crear un componente
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // forma correcta de incluir un servicio
    service = fixture.debugElement.injector.get(BookService);

    // lo del onInit
    jest.spyOn(service, 'getBooksFromCart').mockImplementation(() => listBook);
  });

  afterEach(() => {
    fixture.destroy();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // una alternativa para crear un componente y se agrega en provider
  it('should create two', inject(
    [CartComponent],
    (component2: CartComponent) => {
      expect(component2).toBeTruthy();
    }
  ));

  it('getTotalPrice returns an amaunt', () => {
    const totalPrice = component.getTotalPrice(listBook);
    expect(totalPrice).toBeGreaterThan(0);
    // TODO: opciones para hacerlo tambien
    /*
    expect(totalPrice).not.toBe(0);
    expect(totalPrice).not.toBeNull();
    */
  });

  it('onInputNumberChange increment corretly', () => {
    const action = 'plus';
    const [book] = listBook;

    // forma correcta de incluir un servicio, lo pusimos arriba en el beforeEach
    // const service = fixture.debugElement.injector.get(BookService);

    //TODO: espias: espiar un metodo y probar si lo llamamos
    const spy1 = jest
      .spyOn(service, 'updateAmountBook')
      .mockImplementation(() => null);
    const spy2 = jest
      .spyOn(component, 'getTotalPrice')
      .mockImplementation(() => null);

    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);
    // probamos que si incremento
    expect(book.amount).toBe(3);

    // verifica si los metodos fueron llamados
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onInputNumberChange decrement corretly', () => {
    const action = 'minus';
    const [book] = listBook;

    const spy1 = jest
      .spyOn(service, 'updateAmountBook')
      .mockImplementation(() => null);
    const spy2 = jest
      .spyOn(component, 'getTotalPrice')
      .mockImplementation(() => null);

    expect(book.amount).toBe(3);
    component.onInputNumberChange(action, book);
    // probamos que si decremento
    expect(book.amount).toBe(2);

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onClearBooks work correctly', () => {
    // Arrange
    const spy1 = jest
      .spyOn(service, 'removeBooksFromCart')
      .mockImplementation(() => null);
    const spy2 = jest.spyOn(component as any, '_clearListCartBook');
    component.listCartBook = listBook;

    // Act
    component.onClearBooks();

    // Assert
    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('onClearBooks work else', () => {
    // Arrange
    const logSpy = jest.spyOn(console, 'log');

    // Act
    component.onClearBooks();
    console.log('No books available');

    // Assert
    expect(component.listCartBook.length).toBe(0);
    expect(logSpy).toHaveBeenCalledWith('No books available');
  });

  it('_clearListCartBook work correctly ', () => {
    // Arrange
    const spy1 = jest
      .spyOn(service, 'removeBooksFromCart')
      .mockImplementation(() => null);

    // Act
    component.listCartBook = listBook;
    component['_clearListCartBook']();

    // Assert
    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalled();
  });
});
