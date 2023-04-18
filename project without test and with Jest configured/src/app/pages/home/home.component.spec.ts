import { Book } from './../../models/book.model';
import { Pipe, PipeTransform } from '@angular/core';
import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from './../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

const listBook: Book[] = [
  { name: '', author: '', isbn: '', price: 15, amount: 2 },
  { name: '', author: '', isbn: '', price: 20, amount: 1 },
  { name: '', author: '', isbn: '', price: 8, amount: 7 },
];

const bookServiceMock = {
  getBooks: () => of(listBook),
};

// mock de un pipe
@Pipe({ name: 'reduceText' })
class ReducePipeMock implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return '';
  }
}

describe('home component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let bookService: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HomeComponent, ReducePipeMock],
      providers: [
        // BookService
        // mock de un servicio
        {
          provide: BookService,
          useValue: bookServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // forma correcta de incluir un servicio
    bookService = fixture.debugElement.injector.get(BookService);
  });

  // se llama al termminar cada test
  beforeAll(() => {});

  // se llama al termminar todos los test
  afterAll(() => {});

  // se llama al
  afterEach(() => {});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getBook get book from to subscripction', () => {
    // asi se resuelve si fuera sin subscription
    /*
    const spy1 = jest
    .spyOn(bookService, 'getBooks').mockResolvedValueOnce(listBook);
    */

    // Arrange

    //comentamos el espia porque mokeamos el servicio
    /*const spy1 = jest
      .spyOn(bookService, 'getBooks')
      .mockReturnValueOnce(of(listBook));
    */

    // Act
    component.getBooks();

    // Assert
    //expect(spy1).toHaveBeenCalledTimes(1);
    expect(component.listBook.length).toBe(3);
    expect(component.listBook).toEqual(listBook);
  });
});
